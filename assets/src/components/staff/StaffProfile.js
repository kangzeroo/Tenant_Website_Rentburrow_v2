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
	Card,
	Icon,
	Image,
	Button,
} from 'semantic-ui-react'
import { setStaffProfile } from '../../actions/auth/auth_actions'
import { getStaffInfo, updateStaffThumbnailPhoto } from '../../api/staff/staff_api'
import { uploadImageToS3, filterNonImages } from '../../api/aws/aws-S3'


class StaffProfile extends Component {

	constructor() {
		super()
		this.state = {
			thumbnail: '',
			loading: false,
			errorMessage: '',
			progress_message: '',
			editThumbnail: false,
		}
	}

	componentWillMount() {
		if (!this.props.staffProfile.thumbnail) {
			this.setState({
				editThumbnail: true
			})
		}
	}

	updateStaff({ staff_id, thumbnail }) {
		const self = this
		if (thumbnail && staff_id) {
			this.setState({
				loading: true,
				errorMessage: '',
				progress_message: '',
			}, () => {
				self.setState({ progress_message: 'Uploading thumbnail...' })
				uploadImageToS3(thumbnail, this.props.s3_corporation, `staff-${staff_id}/thumbnail/`).then((s3_thumbnail) => {
					self.setState({ progress_message: 'Saving staff...' })
					// finally we have uploaded all images and are ready to update the building in the database
					console.log(s3_thumbnail)
					const staffObj = {
						staff_id: staff_id,
						thumbnail: s3_thumbnail.Location,
					}
					console.log(staffObj)
					// send it off to be saved
					return updateStaffThumbnailPhoto(staffObj)
				})
				.then((data) => {
					return getStaffInfo(staff_id)
				})
				.then((staff) => {
					this.props.setStaffProfile(staff)
					this.setState({
						loading: false,
						errorMessage: '',
						progress_message: '',
						editThumbnail: false,
					})
				})
				.catch((err) => {
					this.setState({
						loading: false,
						errorMessage: 'Failed to update staff thumbnail',
						progress_message: '',
					})
				})
			})
		}
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
				StaffProfile
				<Card>
					{
						!this.state.editThumbnail
						?
						<div>
					    <Image
								src={this.props.staffProfile.thumbnail}
								fluid
								shape='circular'
							/>
							<Button onClick={() => this.setState({ editThumbnail: true })}>Edit</Button>
						</div>
						:
						<div>
	            <Dropzone onDrop={(acceptedFiles, rejectedFiles) => this.uploadPhoto(acceptedFiles, rejectedFiles, 'thumbnail')} style={comStyles().dropzone} multiple={false}>
	              <p>Upload Profile Picture</p>
	              {
	                this.state.thumbnail
	                ?
	                <Image key={this.state.thumbnail.name} src={this.state.thumbnail.preview} style={comStyles().uploadQueueThumbnail} />
	                :
	                null
	              }
	            </Dropzone>
	            {
	              this.state.errorMessage
	              ?
	              <p>{ this.state.errorMessage }</p>
	              :
	              null
	            }
							<Button onClick={() => this.updateStaff({ staff_id: this.props.staffProfile.staff_id, thumbnail: this.state.thumbnail })}>Update</Button>
							<Button onClick={() => this.setState({ editThumbnail: false })}>Cancel</Button>
							{
	              this.state.progress_message
	              ?
	              <p>{ this.state.progress_message }</p>
	              :
	              null
	            }
						</div>
					}
			    <Card.Content>
			      <Card.Header>
			        {this.props.staffProfile.name}
			      </Card.Header>
			      <Card.Meta>
			        <span className='date'>
			          {this.props.staffProfile.staff_title}
			        </span>
			      </Card.Meta>
			      <Card.Description>
			        {this.props.corporationProfile.corp_name}
			      </Card.Description>
			    </Card.Content>
			    <Card.Content extra style={comStyles().info}>
			      <a>
			        <Icon name='phone' />
			        {this.props.staffProfile.phone}
			      </a>
			      <a>
			        <Icon name='mail' />
			        {this.props.staffProfile.email}
			      </a>
			    </Card.Content>
			  </Card>
			</div>
		)
	}
}

// defines the types of variables in this.props
StaffProfile.propTypes = {
	history: PropTypes.object.isRequired,
	staffProfile: PropTypes.object.isRequired,
	corporationProfile: PropTypes.object.isRequired,
	setStaffProfile: PropTypes.func.isRequired,
}

// for all optional props, define a default value
StaffProfile.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(StaffProfile)

// Get access to state from the Redux store
function mapStateToProps(state) {
	return {
		staffProfile: state.auth.staff_profile,
		corporationProfile: state.auth.corporation_profile,
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapStateToProps, {
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
		info: {
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
