// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Dropzone from 'react-dropzone'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
	Input,
	Button,
	Image,
} from 'semantic-ui-react'
import { encryptKMS, decryptKMS } from '../../api/aws/aws-kms'
import { filterNonImages } from '../../api/aws/aws-S3'
import { uploadImageToS3WithEncryption, getEncryptedS3Image } from '../../api/aws/aws-S3'


class ExampleEncryptionS3 extends Component {

	constructor() {
		super()
		this.state = {
			text: '',
			encrypted_text: '',
			decrypted_text: '',
			image: '',
			encrypted_image_location: '',
			decrypted_image_blob: '',
		}
	}

	encryptText(text) {
		console.log(text)
		encryptKMS(text).then((data) => {
			console.log(data)
			this.setState({
				encrypted_text: data.CiphertextBlob
			})
		})
	}

	decryptText(text) {
		console.log(text)
		decryptKMS(text).then((data) => {
			console.log(data)
			this.setState({
				decrypted_text: data.decoded_string
			})
		})
	}

	uploadEncryptedImage() {
		uploadImageToS3WithEncryption(this.state.image, `${this.props.tenant_profile.tenant_id}/`, 'test-s3-encryption-')
			.then((S3Obj) => {
				console.log(S3Obj)
				this.setState({
					encrypted_image_location: S3Obj.Location
				})
			})
	}

	// upload just 1 photo
  uploadPhoto(acceptedFiles, rejectedFiles, attr) {
    const filteredFiles = filterNonImages(acceptedFiles)
    this.setState({
      [attr]: filteredFiles[0]
    })
  }

	getEncryptedPhoto(url) {
		getEncryptedS3Image(url, `${this.props.tenant_profile.tenant_id}/`).then((data) => {
			console.log(data)
			this.setState({
				decrypted_image_blob: data
			})
		}).catch((err) => {
			console.log(err)
		})
	}

	render() {
		return (
			<div id='ExampleEncryptionS3' style={comStyles().container}>
				<label>Test Text Input</label>
				<Input value={this.state.text} onChange={(e) => this.setState({ text: e.target.value })} />
				<Button color='red' onClick={() => this.encryptText(this.state.text)} content='Encrypt Text' />
				<br /><br /><br />
				<Button color='blue' onClick={() => this.decryptText(this.state.encrypted_text)} content='Decrypt Text' />
				{
					this.state.decrypted_text
				}
				<br /><br /><br />
				<Dropzone onDrop={(acceptedFiles, rejectedFiles) => this.uploadPhoto(acceptedFiles, rejectedFiles, 'image')} style={comStyles().dropzone} multiple={false}>
					{
						this.state.image
						?
						<Image key={this.state.image.name} src={this.state.image.preview} style={comStyles().uploadImagesQueue} />
						:
						<div style={comStyles().dropzone_text}>Upload Image for Encryption</div>
					}
				</Dropzone>
				<Button color='red' onClick={() => this.uploadEncryptedImage()} content='Upload Image To Be Encrypted' />
				<a href={this.state.encrypted_image_location} target='_blank'>{this.state.encrypted_image_location}</a>
				<br /><br /><br />
				<Button color='blue' onClick={() => this.getEncryptedPhoto(this.state.encrypted_image_location)} content='View Encrypted Image' />
				<br /><br /><br />
				<div>
				<Image src={this.state.decrypted_image_blob.image_blob} style={comStyles().regularImage} />
				</div>
			</div>
		)
	}
}

// defines the types of variables in this.props
ExampleEncryptionS3.propTypes = {
	history: PropTypes.object.isRequired,
	tenant_profile: PropTypes.object.isRequired,
}

// for all optional props, define a default value
ExampleEncryptionS3.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(ExampleEncryptionS3)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
		tenant_profile: redux.auth.tenant_profile,
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {

	})(RadiumHOC)
)

// ===============================

// the JS function that returns Radium JS styling
const comStyles = () => {
	return {
		container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh'
		},
		headerImage: {
			height: '50vh'
		},
		regularImage: {
			width: '100%',
			height: '100%',
		}
	}
}
