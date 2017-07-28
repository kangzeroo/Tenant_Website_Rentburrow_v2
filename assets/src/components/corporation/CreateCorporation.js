// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import Dropzone from 'react-dropzone'
import {
  Input,
  Button,
  Image,
} from 'semantic-ui-react'
import { getStaffInfo } from '../../api/staff/staff_api'
import { saveCorporationProfile, setStaffProfile } from '../../actions/auth/auth_actions'
import { sendCorpInfo, getCorpInfo, updateCorporationThumbnail } from '../../api/corporation/corporation_api'
import { uploadImageToS3, filterNonImages } from '../../api/aws/aws-S3'


class CreateCorporation extends Component {

  constructor() {
		super()
		this.state = {
			corporation_name: '',					  // the name typed in
      corporation_email: '',          // the email typed in
      corporation_thumbnail: {},       // the thumbnail image for this corporation
			errorMessage: null,							// error message to be shown
			loading: false,									// flag for loading status
      submitted: false,               // flag for submitted status
		}
	}

  componentDidMount() {
		// submits the form when you press enter
		const corporationInput = document.getElementById('corporation_email')
    const enterKeyPressedStream = Rx.Observable.fromEvent(corporationInput, 'keyup').filter(e => e.keyCode === 13)
		enterKeyPressedStream.subscribe({
			next: () => this.createCorp(this.state)
		})
	}

  updateAttr(event, attr) {
		this.setState({
			[attr]: event.target.value
		})
	}

  createCorp(state) {
    this.setState({
      loading: true,
    }, () => {
      // send corpInfo obj to node server
      const corpJSON = {
        corp_name: this.state.corporation_name,
        corp_email: this.state.corporation_email,
        staff_id: this.props.staffProfile.staff_id
      }
      let corp_id = ''
      sendCorpInfo(corpJSON).then((data) => {
          return getCorpInfo(data.corp_id)
        })
        .then((corp) => {
          corp_id = corp.corp_id
          this.props.saveCorporationProfile(corp)
          return getStaffInfo(this.props.staffProfile.staff_id)
        })
        .then((staff) => {
      		this.props.setStaffProfile(staff)
          return uploadImageToS3(this.state.corporation_thumbnail, `${corp_id}/`, `corporation_assets/thumbnail/`)
        })
        .then((S3Img) => {
          return updateCorporationThumbnail({
            corp_id: corp_id,
            thumbnail: S3Img.Location
          })
        })
        .then(() => {
          return getCorpInfo(corp_id)
        })
        .then((corp) => {
          this.props.saveCorporationProfile(corp)
          this.setState({
            loading: false,
            submitted: true,
          }, () => {
            this.props.history.push('/dashboard')
          })
        })
    })
  }

  uploadNewLogo(acceptedFiles, rejectedFiles) {
    console.log(acceptedFiles)
    console.log(rejectedFiles)
    const filteredFiles = filterNonImages(acceptedFiles)
  	this.setState({
  		corporation_thumbnail: filteredFiles[0]
  	})
  }

	render() {
		return (
			<div style={comStyles().container}>
				<p>CREATE CORPORATION FORM</p>
				<Input id='corporation_name' value={this.state.corporation_name} onChange={(e) => this.updateAttr(e, 'corporation_name')} type='text' placeholder='Company Name' />
				<Input id='corporation_email' value={this.state.corporation_email} onChange={(e) => this.updateAttr(e, 'corporation_email')} type='text' placeholder='Company Email' />
        <Dropzone onDrop={(acceptedFiles, rejectedFiles) => this.uploadNewLogo(acceptedFiles, rejectedFiles)} multiple={false} style={comStyles().dropzone}>
          <div>Drag an image here, or click to select the image to upload.</div>
        </Dropzone>
        <Image src={this.state.corporation_thumbnail.preview} />
        {
          this.state.submitted
          ?
          <p>Successfully created company!</p>
          :
          <Button onClick={() => this.createCorp(this.state)} loading={this.state.loading}>
            CREATE
          </Button>
        }
			</div>
		)
	}
}

// defines the types of variables in this.props
CreateCorporation.propTypes = {
	history: PropTypes.object.isRequired,
  staffProfile: PropTypes.object.isRequired,
  s3_corporation: PropTypes.string,
  saveCorporationProfile: PropTypes.func.isRequired,
  setStaffProfile: PropTypes.func.isRequired,
}

// for all optional props, define a default value
CreateCorporation.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(CreateCorporation)

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
    saveCorporationProfile,
    setStaffProfile,
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
		dropzone: {
			width: '75%',
			height: '100px',
			textAlign: 'center',
			alignItems: 'center',
			border: '2px dashed black',
			color: 'black',
			padding: '10px',
			fontSize: '1rem'
		},
	}
}
