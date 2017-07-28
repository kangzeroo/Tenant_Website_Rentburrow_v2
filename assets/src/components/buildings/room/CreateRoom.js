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
  Checkbox,
  Image,
} from 'semantic-ui-react'
import { submitRoomToDB, updateRoomThumbnails, getRoomsFromDb } from '../../../api/room/room_api'
import { uploadImageToS3, uploadBatchImagesRx, filterNonImages } from '../../../api/aws/aws-S3'
import { selectRooms } from '../../../actions/selection/selection_actions'


class CreateRoom extends Component {

  constructor() {
    super()
    this.state = {
      room_code: '',
      room_alias: '',
      room_desc: '',
      thumbnail: '',
      room_price: 500,
      ensuite_bath: false,
      walkin_closet: false,
      occupied: false,
      flooring: 'carpet',       // carpet, hardwood, marble, laminate
      furnished: false,
      sqft: 0,
      notes: '',
      submitted: false,
      loading: false,
      errorMessage: '',
      progress_message: '',
      building_id: '',
      suite_id: '',
      images: [],
      babylonvr_link: 'https://beta.babylonvr.ca/vr/vr2',             // link to babylon_vr content
    }
  }

  componentWillMount() {
    // instead of grabbing the building from the redux store, we grab it from the url
    // then compare it against all the buildings in the redux store to get the appropriate one
    const building_id_loc = this.props.location.pathname.indexOf('buildings/')
    const building_id_loc_end = this.props.location.pathname.indexOf('/suite/')
    const building_id = this.props.location.pathname.slice(building_id_loc+10, building_id_loc_end)
    const suite_id_loc = this.props.location.pathname.indexOf('suite/')
    const suite_id = this.props.location.pathname.slice(suite_id_loc+6)
    this.setState({
      building_id: building_id,
      suite_id: suite_id,
    })
  }

  updateAttr(event, attr) {
		this.setState({
			[attr]: event.target.value
		})
	}

  submitRoom(state) {
    const self = this
    if (state.room_code && state.room_alias && state.room_price) {
      this.setState({
        loading: true,
        errorMessage: '',
      }, () => {
        self.setState({ progress_message: 'Saving this room...' })
        submitRoomToDB({
          ...state,
          building_id: this.state.building_id,
          corporation_id: this.props.corporation_id,
          babylonvr_link: this.state.babylonvr_link,
        }).then(({ room_id }) => {
          self.setState({ progress_message: 'Uploading room images...' })
          uploadBatchImagesRx(this.state.images, this.props.s3_corporation, `${state.building_id}/${state.suite_id}/${room_id}/room_photos/`).then((observable) => {
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
                  uploadImageToS3(this.state.thumbnail, this.props.s3_corporation, `${state.building_id}/${state.suite_id}/${room_id}/thumbnail/`).then((s3_thumbnail) => {
                    self.setState({ progress_message: 'Saving room...' })
                    thumbnail = s3_thumbnail
                    // finally we have uploaded all images and are ready to update the building in the database
                    const roomObj = {
                      room_id: room_id,
                      images: completedImages,
                      thumbnail: thumbnail.Location,
                    }
                    console.log(roomObj)
                    // send it off to be saved
                    return updateRoomThumbnails(roomObj)
                  })
                  .then((data) => {
                    console.log('sent room object to node server')
                    // great, we're done now! update internal state to reflect success
                    self.setState({
                      loading: false,
                      submitted: true,
                      progress_message: '',
                      errorMessage: '',
                    })
                    return getRoomsFromDb({
                              suite_id: self.state.suite_id,
                              corporation_id: self.props.corporation_id,
                              building_id: self.state.building_id,
                            })
                  })
                  .then((rooms) => {
                    self.props.selectRooms(
                      rooms.map(r => JSON.parse(r))
                    )
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
        errorMessage: 'Missing _____ props',
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
        <h2>Create Room</h2>
        <Input
          id='room_code'
          label='Room Code'
          value={this.state.room_code}
          onChange={(e) => { this.updateAttr(e, 'room_code') }}
          type='text'
          placeholder='Room A'
        />
        <Input
          id='room_alias'
          label='Room Nickname'
          value={this.state.room_alias}
          onChange={(e) => { this.updateAttr(e, 'room_alias') }}
          type='text'
          placeholder='Master Bedroom'
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
          id='room_desc'
          label='Room Description'
          value={this.state.room_desc}
          onChange={(e) => { this.updateAttr(e, 'room_desc') }}
          type='text'
          placeholder='Room Description'
        />
        <Input
          id='room_price'
          label='Room Price'
          value={this.state.room_price}
          onChange={(e) => { this.updateAttr(e, 'room_price') }}
          type='number'
          step={5}
          min={100}
        />
        <Checkbox
          toggle
          id='ensuite_bath'
          label='Ensuite Bath'
          checked={this.state.ensuite_bath}
          onChange={() => { this.setState({ ensuite_bath: !this.state.ensuite_bath }) }}
        />
        <Checkbox
          toggle
          id='walkin_closet'
          label='Walk-In Closet'
          checked={this.state.walkin_closet}
          onChange={() => { this.setState({ walkin_closet: !this.state.walkin_closet }) }}
        />
        <Input
          id='flooring'
          label='Flooring Type'
          value={this.state.flooring}
          onChange={(e) => { this.updateAttr(e, 'flooring') }}
          type='text'
          placeholder='Laminate'
        />
        <Checkbox
          toggle
          id='furnished'
          label='Furnished'
          checked={this.state.furnished}
          onChange={() => { this.setState({ furnished: !this.state.furnished }) }}
        />
        <Input
          id='sqft'
          label='Square Footage'
          value={this.state.sqft}
          onChange={(e) => { this.updateAttr(e, 'sqft') }}
          type='number'
        />
        <Checkbox
          toggle
          id='occupied'
          label='Occupied'
          checked={this.state.occupied}
          onChange={() => { this.setState({ occupied: !this.state.occupied }) }}
        />
        <Input
          id='notes'
          label='Notes'
          value={this.state.notes}
          onChange={(e) => { this.updateAttr(e, 'notes') }}
          type='text'
          placeholder='Notes'
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
        <Button onClick={() => this.submitRoom(this.state)} loading={this.state.loading}>
          {
            this.state.submitted
            ?
            <p>Successfully submitted! Submit another?</p>
            :
            <p>Submit</p>
          }
        </Button>
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
CreateRoom.propTypes = {
	history: PropTypes.object.isRequired,
  building_id: PropTypes.string,           // passed in
  corporation_id: PropTypes.string,
  suite_id: PropTypes.string,              // passed in
  selectRooms: PropTypes.func.isRequired,
}

// for all optional props, define a default value
CreateRoom.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(CreateRoom)

// Get access to state from the Redux store
function mapReduxToProps(state) {
	return {
    corporation_id: state.auth.corporation_profile.corp_id
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
    selectRooms,
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
