// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import Dropzone from 'react-dropzone'
import moment from 'moment'
import { withRouter } from 'react-router-dom'
import {
	Form,
	Checkbox,
	Button,
	Input,
	Image,
	Message,
} from 'semantic-ui-react'
import DatePicker from 'react-datepicker'
// import 'react-datepicker/dist/react-datepicker.css'
import { filterNonImages } from '../../../../api/aws/aws-S3'
import { convertToRegularSubletObj } from '../../../../api/search/sublet_api'
import SubletDetailed from '../../../sublets/SubletDetailed'
import { validateEmail } from '../../../../api/general/general_api'


class SubletApply extends Component {

	constructor() {
		super()
		this.state = {
			subletee_full_legal_name: '',
			subletee_phone_number: '',
			subletee_email: '',
			subletee_student_card: '',
			requested_begin_date: moment(),
			requested_end_date: moment(),
			price: 0,
			address: '',
			subletee_witness_full_legal_name: '',
			subletee_witness_email: '',
			agree_to_terms: false,
			submitted: false,
			error_messages: [],
		}
	}

	componentWillMount() {
		this.setState({
			subletee_full_legal_name: this.props.tenant_profile.name ? this.props.tenant_profile.name : '',
			subletee_phone_number: this.props.tenant_profile.phone ? this.props.tenant_profile.phone : '',
			subletee_email: this.props.tenant_profile.email ? this.props.tenant_profile.email : '',
			price: this.props.sublet_post.PRICE,
			address: this.props.sublet_post.ADDRESS,
		})
	}

	updateAttr(e, attr) {
		this.setState({
			[attr]: e.target.value,
		})
	}

	updateDate(date, attr) {
		this.setState({
			[attr]: date,
		})
	}

	submit() {
		if (this.formValidation()) {
			this.props.saveSubletApply(this.state)
			this.setState({
				submitted: true,
			})
		}
	}

	// upload just 1 photo
  uploadPhoto(acceptedFiles, rejectedFiles, attr) {
    const filteredFiles = filterNonImages(acceptedFiles)
    this.setState({
      [attr]: filteredFiles[0]
    })
  }

	formValidation() {
		let submittable = true
		const errors = []
		if (this.state.subletee_full_legal_name.length === 0 || this.state.subletee_phone_number.length === 0 || !this.state.subletee_email.length === 0) {
			errors.push('You must include your name, phone number and email')
		}
		if (!validateEmail(this.state.subletee_email) || !validateEmail(this.state.subletee_witness_email)) {
			errors.push('One of the emails you entered is not valid')
		}
		if (this.state.subletee_witness_full_legal_name.length === 0 || this.state.subletee_witness_email.length === 0) {
			errors.push('Please provide a witness to sign the contract too')
		}
		if (!this.state.address.length > 1) {
			errors.push('There must be an address')
		}
		if (this.state.price <= 0) {
			errors.push('Monthly sublet rent cannot be zero or less')
		}
		if (!this.state.subletee_student_card || !this.state.subletee_student_card.name || !this.state.subletee_student_card.name.length > 0) {
			errors.push('You must upload a picture of your student card')
		}
		if (!this.state.agree_to_terms) {
			errors.push('You must agree to the terms and conditions of this online service')
		}
		if (errors.length > 0) {
			submittable = false
		}
		this.setState({
			error_messages: errors
		})
		return submittable
	}

	render() {
		console.log(this.props.sublet_post)
		return (
			<div style={comStyles().container}>
				<SubletDetailed
					key={this.props.sublet_post.POST_ID}
					sublet={convertToRegularSubletObj(this.props.sublet_post)}
				/>
				<Form style={comStyles().form}>
					<h1>Subletee Form</h1>
			    <Form.Field>
			      <label>Full Legal Name</label>
			      <input
							placeholder='Full Legal Name'
							onChange={(e) => this.updateAttr(e, 'subletee_full_legal_name')}
							value={this.state.subletee_full_legal_name} />
			    </Form.Field>
			    <Form.Field>
			      <label>Phone</label>
			      <input placeholder='Phone Number' onChange={(e) => this.updateAttr(e, 'subletee_phone_number')} value={this.state.subletee_phone_number} />
			    </Form.Field>
			    <Form.Field>
			      <label>Email</label>
			      <input placeholder='Email' onChange={(e) => this.updateAttr(e, 'subletee_email')} value={this.state.subletee_email} />
			    </Form.Field>
			    <Form.Field>
			      <label>Building Address</label>
			      <input placeholder='Address of Subletted Room' onChange={(e) => this.updateAttr(e, 'address')} value={this.state.address} />
			    </Form.Field>
			    <Form.Field>
			      <label>Price</label>
						<Input icon='dollar' type='number' iconPosition='left' placeholder='Sublet Price' onChange={(e) => this.updateAttr(e, 'price')} value={this.state.price} />
			    </Form.Field>
			    <Form.Field>
			      <label>Requested Sublet Start Date</label>
						<DatePicker
							selected={this.state.requested_begin_date}
							onChange={(d) => this.updateDate(d, 'requested_begin_date')}
						/>
			    </Form.Field>
			    <Form.Field>
			      <label>Requested Sublet End Date</label>
						<DatePicker
							selected={this.state.requested_end_date}
							onChange={(d) => this.updateDate(d, 'requested_end_date')}
						/>
			    </Form.Field>
					<Form.Field>
						<Dropzone onDrop={(acceptedFiles, rejectedFiles) => this.uploadPhoto(acceptedFiles, rejectedFiles, 'subletee_student_card')} style={comStyles().bannerDropzone} multiple={false}>
							{
								this.state.subletee_student_card
								?
								<Image key={this.state.subletee_student_card.name} src={this.state.subletee_student_card.preview} style={comStyles().uploadImagesQueue} />
								:
								<div>Upload Student Card</div>
							}
						</Dropzone>
					</Form.Field>
			    <Form.Field>
			      <label>Witness Name</label>
			      <input placeholder='Witness Full Legal Name' onChange={(e) => this.updateAttr(e, 'subletee_witness_full_legal_name')} value={this.state.subletee_witness_full_legal_name} />
			    </Form.Field>
			    <Form.Field>
			      <label>Witness Email</label>
			      <input placeholder='Witness Email' onChange={(e) => this.updateAttr(e, 'subletee_witness_email')} value={this.state.subletee_witness_email} />
			    </Form.Field>
			    <Form.Field>
			      <Checkbox label='I agree to the Terms and Conditions' onChange={(e, d) => this.updateAttr({ target: { value: d.checked } }, 'agree_to_terms')} checked={this.state.agree_to_terms} />
						&nbsp;
						<span onClick={() => console.log('view terms and conditions')} style={comStyles().viewTerms}>View</span>
			    </Form.Field>
			    <Form.Field>
						{
							this.state.error_messages.map((err, index) => {
								return (
									<Message
										visible
										key={index}
										error
					          content={err}
					        />
								)
							})
						}
					</Form.Field>
					{
						this.state.submitted
						?
						<div style={comStyles().hidden_loading}>
							<img src='https://s3.amazonaws.com/rentburrow-static-assets/Loading+Icons/loading-blue-clock.gif' width='50px' height='auto' />
						</div>
						:
				    <Button type='submit' onClick={() => this.submit()}>Submit</Button>
					}
			  </Form>
			</div>
		)
	}
}

// defines the types of variables in this.props
SubletApply.propTypes = {
	history: PropTypes.object.isRequired,
	sublet_post: PropTypes.object.isRequired,		// passed in
	saveSubletApply: PropTypes.func.isRequired,	// passed in
	tenant_profile: PropTypes.object,
}

// for all optional props, define a default value
SubletApply.defaultProps = {
	tenant_profile: {},
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(SubletApply)

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
			padding: '20px',
		},
		form: {
      display: 'flex',
      flexDirection: 'column',
			width: '700px',
			maxWidth: '700px',
			minWidth: '700px',
			padding: '20px',
		},
		viewTerms: {
			color: 'blue',
			cursor: 'pointer',
		}
	}
}
