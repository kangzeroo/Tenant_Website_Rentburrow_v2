// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import Dropzone from 'react-dropzone'
import { withRouter } from 'react-router-dom'
import {
  Input,
  Button,
  Image,
} from 'semantic-ui-react'
import { submitSuiteToDB, updateSuiteThumbnailPhoto } from '../../../api/suite/suite_api'
import { uploadImageToS3, uploadBatchImagesRx, filterNonImages } from '../../../api/aws/aws-S3'
import { selectBuilding } from '../../../actions/selection/selection_actions'


class CreateSuite extends Component {

  constructor() {
    super()
    this.state = {
      alias: '',
      desc: '',
      thumbnail: '',
      code: '',
      room_count: 1,
      den_count: 0,
      bath_count: 1,
      balcony: false,
      building_id: '',
      corporation_id: '',
      images: [],
      loading: false,
      submitted: false,
      errorMessage: '',
      progress_message: '',
      babylonvr_link: 'https://beta.babylonvr.ca/vr/vr2',             // link to babylon_vr content
    }
  }

  componentWillMount() {
    // instead of grabbing the building from the redux store, we grab it from the url
    // then compare it against all the buildings in the redux store to get the appropriate one
    const building_id_loc = this.props.location.pathname.indexOf('buildings/')
    const suite_id_loc = this.props.location.pathname.indexOf('/suite')
    const building_id = this.props.location.pathname.slice(building_id_loc + 10, suite_id_loc)
    // compare building_id from url to all buildings in the redux store
    let building = {}
    this.props.buildings.forEach((b) => {
      if (b.building_id === building_id) {
        building = b
      }
    })
    this.props.selectBuilding(building)
    this.setState({
      building_id: building_id,
      corporation_id: this.props.staffProfile.corporation_id,
    })
  }

  updateAttr(event, attr) {
		this.setState({
			[attr]: event.target.value
		})
	}

  createSuite(state) {
    const self = this
    if (state.alias && state.thumbnail && state.code && state.room_count && state.bath_count) {
      this.setState({
        errorMessage: '',
        loading: true,
      }, () => {
        self.setState({ progress_message: 'Saving this suite...' })
        submitSuiteToDB({
          suite_alias: state.alias,
          suite_code: state.code,
          suite_desc: state.desc,
          thumbnail: state.thumbnail,
          room_count: state.room_count,
          bath_count: state.bath_count,
          den_count: state.den_count,
          balcony: state.balcony,
          building_id: state.building_id,
          corporation_id: state.corporation_id,
          babylonvr_link: this.state.babylonvr_link,
        }).then(({ suite_id }) => {
          self.setState({ progress_message: 'Uploading suite images...' })
          uploadBatchImagesRx(this.state.images, this.props.s3_corporation, `${state.building_id}/${suite_id}/suite_photos/`).then((observable) => {
              // since we are uploading multiple images, an observable would be perfect here because it allows us to update the progress messsage on each .next()
              // lets hold the compeleted suite_photos received back from S3 on each successful upload
              const completedImages = []

              // subscribe to the observable returned from uploadBatchImagesRx()
              observable.subscribe({
                // everytime .next() was called in the observable, run this function
                next: (s3_img) => {
                  // add each uploaded S3 image to our completedImages list
                  completedImages.push(s3_img)
                  // update the progress message
                  self.setState({ progress_message: `Uploaded image ${s3_img.Location}` })
                },
                // if there is an error we update the react compt internal state to reflect changes
                error: (err) => {
                  self.setState({
                    errorMessage: 'Error uploading images',
                    progress_message: '',
                    loading: false,
                  })
                },
                // finally, when .complete() is called in the observable, run this function
                // its a big function because its the rest of the upload logic
                complete: () => {
                  // the suite photos have been uploaded to S3, but we need to save their urls to Postgres
                  // this database query still needs to be done
                  console.log('------ Successfully Uploaded Main Images to S3 ------')
                  console.log(completedImages)
                  // now that we have uploaded the building_photos, we must also upload the suite thumbnail
                  // define variables so we can have access to each photo returned from S3
                  let thumbnail
                  self.setState({ progress_message: 'Uploading thumbnail...' })
                  // one by one, we upload each in a promise chain
                  // for organization, we have also changed the folder destination
                  uploadImageToS3(this.state.thumbnail, this.props.s3_corporation, `${state.building_id}/${suite_id}/thumbnail/`).then((s3_thumbnail) => {
                    self.setState({ progress_message: 'Saving building...' })
                    console.log(s3_thumbnail)
                    thumbnail = s3_thumbnail
                    // finally we have uploaded all images and are ready to update the building in the database
                    const suiteObj = {
                      suite_id: suite_id,
                      images: completedImages,
                      thumbnail: thumbnail.Location,
                    }
                    console.log(suiteObj)
                    // send it off to be saved
                    return updateSuiteThumbnailPhoto(suiteObj)
                  })
                  .then((data) => {
                    console.log('sent suite object to node server')
                    // great, we're done now! update internal state to reflect success
                    self.setState({
                      loading: false,
                      submitted: true,
                      progress_message: '',
                    })
                  })
                  .catch((err) => {
                    // update internal state to reflect failure
                    self.setState({
                      loading: false,
                      error: 'Failed to create building',
                      progress_message: '',
                      errorMessage: '',
                    })
                  })
                }
              })
            })
          })
          .catch((err) => {
            this.setState({
              errorMessage: err,
              loading: false,
            })
          })
        })
    } else {
      this.setState({
        errorMessage: 'Missing _______ from form'
      })
    }
  }

  uploadPhotos(acceptedFiles, rejectedFiles) {
    console.log(acceptedFiles)
    console.log(rejectedFiles)
    const filteredFiles = filterNonImages(acceptedFiles)
    this.setState({
      images: filteredFiles
    })
  }

  uploadPhoto(acceptedFiles, rejectedFiles, attr) {
    const filteredFiles = filterNonImages(acceptedFiles)
    this.setState({
      [attr]: filteredFiles[0]
    })
  }

  generateRoomForm() {
    return null
  }

	render() {
		return (
			<div style={comStyles().container}>
          <div style={comStyles().createSuiteForm}>
    				<Input
              id='alias'
              label='Suite Name'
              value={this.state.alias}
              onChange={(e) => { this.updateAttr(e, 'alias') }}
              type='text'
              placeholder='Suite Name'
            />
    				<Input
              id='desc'
              label='Suite Description'
              value={this.state.desc}
              onChange={(e) => { this.updateAttr(e, 'desc') }}
              type='text'
              placeholder='About this suite'
            />
            <Dropzone onDrop={(acceptedFiles, rejectedFiles) => this.uploadPhoto(acceptedFiles, rejectedFiles, 'thumbnail')} style={comStyles().dropzone} multiple={false}>
              <div>Thumbnail</div>
              {
                this.state.thumbnail
                ?
                <Image key={this.state.thumbnail.name} src={this.state.thumbnail.preview} style={comStyles().uploadQueueThumbnail} />
                :
                null
              }
            </Dropzone>
    				<Input
              id='code'
              label='Suite Number'
              value={this.state.code}
              onChange={(e) => { this.updateAttr(e, 'code') }}
              type='text'
              placeholder='Suite Number'
            />
    				<Input
              id='room_count'
              label='# of Rooms'
              value={this.state.room_count}
              onChange={(e) => { this.updateAttr(e, 'room_count') }}
              type='number'
              step={1}
              min={1}
              placeholder='# of Rooms'
            />
            {
              this.generateRoomForm()
            }
            <Input
              id='den_count'
              label='# of Common Areas'
              value={this.state.den_count}
              onChange={(e) => { this.updateAttr(e, 'den_count') }}
              type='number'
              step={0.5}
              min={0}
              placeholder='# of Common Areas'
            />
            <Input
              id='bath_count'
              label='# of Baths'
              value={this.state.bath_count}
              onChange={(e) => { this.updateAttr(e, 'bath_count') }}
              type='number'
              min={0}
              step={0.5}
              placeholder='# of Bathrooms'
            />
            <Dropzone onDrop={(acceptedFiles, rejectedFiles) => this.uploadPhotos(acceptedFiles, rejectedFiles)} style={comStyles().dropzone} multiple>
              <div>Drag images here, or click to select the image to upload.</div>
              {
                this.state.images.map((img) => {
                  return (
                    <Image key={img.name} src={img.preview} style={comStyles().uploadQueueThumbnail}/>
                  )
                })
              }
            </Dropzone>
            {
              this.state.errorMessage
              ?
              <p>{ this.state.errorMessage }</p>
              :
              null
            }
            <Button onClick={() => this.createSuite(this.state)} loading={this.state.loading}>
              {
                this.state.submitted
                ?
                <p>Success! Create Another?</p>
                :
                <p>Create</p>
              }
            </Button>
            <Button onClick={() => this.props.history.push(`/buildings/${this.state.building_id}`)}>Back to Building</Button>
            {
              this.state.progress_message
              ?
              <p>{ this.state.progress_message }</p>
              :
              null
            }
          </div>
			</div>
		)
	}
}

// defines the types of variables in this.props
CreateSuite.propTypes = {
	history: PropTypes.object.isRequired,
  buildings: PropTypes.array,
  building: PropTypes.object.isRequired,
  staffProfile: PropTypes.object.isRequired,
  s3_corporation: PropTypes.string.isRequired,
  selectBuilding: PropTypes.func.isRequired,
}

// for all optional props, define a default value
CreateSuite.defaultProps = {
  buildings: [],
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(CreateSuite)

// Get access to state from the Redux store
function mapReduxToProps(state) {
	return {
    buildings: state.corporation.buildings,
    building: state.selection.current_building,
    staffProfile: state.auth.staff_profile,
    s3_corporation: state.corporation.s3_corporation,
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
    selectBuilding,
	})(RadiumHOC)
)

// ===============================

// the JS function that returns Radium JS styling
const comStyles = () => {
	return {
		container: {
      display: 'flex',
      flexDirection: 'column',
		},
    createSuiteForm: {
      display: 'flex',
      flexDirection: 'column',
    },
    uploadQueueThumbnail: {
      width: '50px',
      height: '50px',
      overflow: 'hidden',
    }
	}
}
