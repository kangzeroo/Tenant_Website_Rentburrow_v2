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
  Select,
} from 'semantic-ui-react'
import { sendBuildingObj, updateBuildingThumbnailAndCoverPhotos, getBuildingsForCorporation } from '../../api/building/building_api'
import { saveBuildingsForCorp } from '../../actions/corporation/corporation_actions'
import { uploadImageToS3, uploadBatchImagesRx, filterNonImages } from '../../api/aws/aws-S3'

class CreateBuilding extends Component {

  constructor() {
		super()
		this.autocomplete = null
		this.state = {
			building_address: '',					  // the building_address typed in
      building_alias: '',             // the email typed in
      building_desc: '',              // the description of the building
      building_type: '',              // the building type
      building_lat: 0,                // the building lat according to google
      building_long: 0,               // the building lng according to google
      building_place_id: '',          // the building place_id according to google
      thumbnail: '',                  // the building thumbnail to S3
      images: [],                     // the images to be saved to S3
      banner_photo: '',                // the building cover photo to S3
      progress_message: '',           // the progress message to be shown
			errorMessage: null,							// error message to be shown
			loading: false,									// flag for loading status
      submitted: false,               // flag for submitted status
      babylonvr_link: 'https://beta.babylonvr.ca/vr/vr2',             // link to babylon_vr content
      options: [
                  { key: 'a', text: 'Apartment', value: 'apartment' },
                  { key: 'h', text: 'House', value: 'house' },
                  { key: 'l', text: 'Low Rise', value: 'lowrise' }
                ]
		}
	}

  componentDidMount() {
		// submits the form when you press enter
		const buildingInput = document.getElementById('building_alias')
    const enterKeyPressedStream = Rx.Observable.fromEvent(buildingInput, 'keyup').filter(e => e.keyCode === 13)
		enterKeyPressedStream.subscribe({
			next: () => this.createBuilding(this.state)
		})

    // google address autocomplete
    this.autocomplete = new google.maps.places.Autocomplete(
            /** @type {!HTMLInputElement} */(document.getElementById('building_address')),
            { types: ['geocode'] });
    // When the user selects an address from the dropdown, populate the address
    // fields in the form.
    this.autocomplete.addListener('place_changed', this.fillInAddress.bind(this));
	}

  // fill in address from google autocomplete dropdown
  fillInAddress() {
		const place = this.autocomplete.getPlace()

		this.setState({
      building_address: place.formatted_address,
			building_lat: place.geometry.location.lat().toFixed(7),
      building_long: place.geometry.location.lng().toFixed(7),
			building_place_id: place.place_id,
		}, () => {
      console.log(this.state)
    })
	}

  updateAttr(event, attr) {
		this.setState({
			[attr]: event.target.value
		})
	}

  // ok, seems complicated but its similier than it seems
  createBuilding(state) {
    // first we create a reference to the original 'this' which is <CreateBuilding>
    const self = this
    // then we check for at a least a building address
    if (state.building_address) {
      // change the internal compt state to reflect loading status
      this.setState({
        loading: true,
      }, () => {
        // compile our building object
        const buildingJSON = {
          building_name: this.state.building_alias,
          building_address: this.state.building_address,
          building_desc: this.state.building_desc,
          building_type: this.state.building_type,
          gps_x: this.state.building_lat,
          gps_y: this.state.building_long,
          place_id: this.state.building_place_id,
          corporation_id: this.props.staffProfile.corporation_id,
          thumbnail: this.state.thumbnail,
          banner_photo: this.state.banner_photo,
          babylonvr_link: this.state.babylonvr_link,
        }
        // set a progress message
        self.setState({ progress_message: 'Uploading images...' })
        // send off our building object to be saved to database
        sendBuildingObj(buildingJSON).then((data) => {
          // get the building_id back and hold onto it
          // we will need to update the building once we upload images to S
          const building_id = data.building_id
          // our s3 bucket follows a naming convention of corp_id/building_id/asset_type/image.png
          // the backslashes / let us define folders, so its important we have the correct prefixes

          // uploadBatchImagesRx(imageArray, corporation_id, prefix)
          // corporation_id with a backslash, which means this upload will go under an appropriate corporation folder
          // prefix is additional folder nesting. it will be concatenated with corporation_id
          uploadBatchImagesRx(this.state.images, this.props.s3_corporation, `${building_id}/building_photos/`).then((observable) => {
              // since we are uploading multiple images, an observable would be perfect here because it allows us to update the progress messsage on each .next()
              // lets hold the compeleted building_photos received back from S3 on each successful upload
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
                  // the building photos have been uploaded to S3, but we need to save their urls to Postgres
                  // this database query still needs to be done
                  console.log('------ Successfully Uploaded Main Images to S3 ------')
                  console.log(completedImages)
                  // now that we have uploaded the building_photos, we must also upload the building thumbnail and banner_photo
                  // define variables so we can have access to each photo returned from S3
                  let thumbnail
                  let cover
                  self.setState({ progress_message: 'Uploading thumbnail...' })
                  // one by one, we upload each in a promise chain
                  // for organization, we have also changed the folder destination
                  uploadImageToS3(this.state.thumbnail, this.props.s3_corporation, `${building_id}/building_thumbnail/`).then((s3_thumbnail) => {
                    self.setState({ progress_message: 'Uploading cover photo...' })
                    console.log(s3_thumbnail)
                    thumbnail = s3_thumbnail
                    // keep on uploading one by one
                    return uploadImageToS3(this.state.banner_photo, this.props.s3_corporation, `${building_id}/building_cover/`)
                  })
                  .then((s3_cover) => {
                    self.setState({ progress_message: 'Saving building...' })
                    cover = s3_cover
                    // finally we have uploaded all images and are ready to update the building in the database
                    const buildingObj = {
                      building_id: building_id,
                      images: completedImages,
                      thumbnail: thumbnail.Location,
                      banner_photo: cover.Location,
                    }
                    console.log(buildingObj)
                    // send it off to be saved
                    return updateBuildingThumbnailAndCoverPhotos(buildingObj)
                  })
                  .then((data) => {
                    console.log('sent building object to node server')
                    // great, we're done now! update internal state to reflect success
                    self.setState({
                      loading: false,
                      submitted: true,
                      progress_message: '',
                    })
                    // finally, lets get the latest buildings for the corporation
                    return getBuildingsForCorporation(self.props.staffProfile.corporation_id)
                  })
                  .then((buildings) => {
                    // and save them to the redux store
                    self.props.saveBuildingsForCorp(buildings)
                  })
                  .catch((err) => {
                    // update internal state to reflect failure
                    self.setState({
                      loading: false,
                      error: 'Failed to create building',
                      progress_message: '',
                    })
                  })
                }
              })
            })
          })
        })
    } else {
      this.setState({
        errorMessage: 'You must enter an address'
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

	render() {
		return (
			<div style={comStyles().container}>
				<p>CREATE BUILDING FORM</p>
        <Input
          id='building_alias'
          value={this.state.building_alias}
          onChange={(e) => { this.updateAttr(e, 'building_alias') }}
          type='text'
          placeholder='Building Nickname'
        />
        <Input
          id='building_address'
          value={this.state.building_address}
          onChange={(e) => { this.updateAttr(e, 'building_address') }}
          type='text'
          placeholder='Building Address'
        />
				<Select
          id='building_type'
          options={this.state.options}
          onChange={(e) => { this.updateAttr(e, 'building_type') }}
          placeholder='Building Type'
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
        <Dropzone onDrop={(acceptedFiles, rejectedFiles) => this.uploadPhoto(acceptedFiles, rejectedFiles, 'banner_photo')} style={comStyles().dropzone} multiple={false}>
          <div>Cover Photo</div>
          {
            this.state.banner_photo
            ?
            <Image key={this.state.banner_photo.name} src={this.state.banner_photo.preview} style={comStyles().uploadQueueThumbnail} />
            :
            null
          }
        </Dropzone>
        <Input
          id='building_desc'
          value={this.state.building_desc}
          onChange={(e) => { this.updateAttr(e, 'building_desc') }}
          type='text'
          placeholder='Building Description'
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
        {
          this.state.submitted
          ?
          <p>Successfully submitted building!</p>
          :
          <Button onClick={() => this.createBuilding(this.state)} loading={this.state.loading}>
            CREATE
          </Button>
        }
        {
          this.state.progress_message
          ?
          <p>{ this.state.progress_message }</p>
          :
          null
        }
			</div>
		)
	}
}

// defines the types of variables in this.props
CreateBuilding.propTypes = {
	history: PropTypes.object.isRequired,
  staffProfile: PropTypes.object.isRequired,
  saveBuildingsForCorp: PropTypes.func.isRequired,
  s3_corporation: PropTypes.string.isRequired,
}

// for all optional props, define a default value
CreateBuilding.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(CreateBuilding)

// Get access to state from the Redux store
function mapStateToProps(state) {
	return {
    staffProfile: state.auth.staff_profile,
    s3_corporation: state.corporation.s3_corporation,
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapStateToProps, {
    saveBuildingsForCorp,
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
    uploadQueueThumbnail: {
      width: '50px',
      height: '50px',
      overflow: 'hidden',
    }
	}
}
