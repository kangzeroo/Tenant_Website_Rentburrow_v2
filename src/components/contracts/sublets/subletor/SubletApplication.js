// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import Dropzone from 'react-dropzone'
import { withRouter } from 'react-router-dom'
import moment from 'moment'
import {
	Form,
	Checkbox,
	Button,
	Input,
	Image,
	Message,
} from 'semantic-ui-react'
import DatePicker from 'react-datepicker'
import { filterNonImages } from '../../../../api/aws/aws-S3'
import { convertToRegularSubletObj, getSubleteeProfile, } from '../../../../api/signing/sublet_contract_api'
import SubletDetailed from '../../../sublets/SubletDetailed'
import SubletCard from '../../../housing/cards/SubletCard'
import { validateEmail } from '../../../../api/general/general_api'
// require('../../../../styles/react-datepicker.css')


class SubletApplication extends Component {

	constructor() {
		super()
		this.state = {
			subletor_full_legal_name: '',
			subletor_phone_number: '',
			subletor_email: '',
			subletor_student_card: '',
			official_begin_date: moment(),
			official_end_date: moment(),
			price: 0,
			address: '',
			suite_id: '',
			room_id: '',
			subletor_witness_full_legal_name: '',
			subletor_witness_email: '',
			landlord_full_legal_name: '',
			landlord_phone: '',
			landlord_email: '',
			agree_to_terms: false,
			submitted: false,
			error_messages: [],
			subletee: {},
		}
	}

	componentWillMount() {
		console.log(this.props.subletee_contract)
		this.setState({
			subletor_full_legal_name: this.props.tenant_profile.name ? this.props.tenant_profile.name : '',
			subletor_phone_number: this.props.tenant_profile.phone ? this.props.tenant_profile.phone : '',
			subletor_email: this.props.tenant_profile.email ? this.props.tenant_profile.email : '',
			price: this.props.subletee_contract.rent_price,
			address: this.props.subletee_contract.building_address,
			official_begin_date: moment(this.props.subletee_contract.begin_date),
			official_end_date: moment(this.props.subletee_contract.end_date),
		})
		getSubleteeProfile(this.props.subletee_contract.subletee_id)
		.then((data) => {
			const subletee = JSON.parse(data)
			this.setState({
				subletee,
			})
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
			this.props.saveSubletApplication(this.state)
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
		if (this.state.subletor_full_legal_name.length === 0 || this.state.subletor_phone_number.length === 0 || !this.state.subletor_email.length === 0) {
			errors.push('You must include your name, phone number and email')
		}
		if (this.state.suite_id.length === 0 || this.state.room_id.length === 0) {
			errors.push('You must include the suite number and room number')
		}
		if (!validateEmail(this.state.subletor_email) || !validateEmail(this.state.subletor_witness_email)) {
			errors.push('One of the emails you entered is not valid')
		}
		if (this.state.subletor_witness_full_legal_name.length === 0 || this.state.subletor_witness_email.length === 0) {
			errors.push('Please provide a witness to sign the contract too')
		}
		if (!this.state.address.length > 1) {
			errors.push('There must be an address')
		}
		if (this.state.price <= 0) {
			errors.push('Monthly sublet rent cannot be zero or less')
		}
		if (!this.state.subletor_student_card || !this.state.subletor_student_card.name || !this.state.subletor_student_card.name.length > 0) {
			errors.push('You must upload a picture of your student card')
		}
		if (this.state.landlord_full_legal_name.length === 0) {
			errors.push('You must include the landlords name')
		}
		if (this.state.landlord_phone.length === 0 && this.state.landlord_email.length === 0) {
			errors.push('You must include the landlords phone or email')
		}
		if (this.state.landlord_email.length > 0) {
			if (!validateEmail(this.state.landlord_email)) {
				errors.push('The landlords email is invalid')
			}
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
		return (
			<div style={comStyles().container}>
				<SubletCard
					key='subletee'
					sublet={{
						fb_user_id: this.state.subletee.fb_user_id,
						fb_user_name: this.state.subletee.full_name,
						fb_user_pic: this.state.subletee.thumbnail
					}}
				/>
				<SubletDetailed
					key={this.props.sublet_post.POST_ID}
					sublet={convertToRegularSubletObj(this.props.sublet_post)}
				/>
				<Form style={comStyles().form}>
					<h1>Subletor Form</h1>
			    <Form.Field>
			      <label>Full Legal Name</label>
			      <input
							placeholder='Full Legal Name'
							onChange={(e) => this.updateAttr(e, 'subletor_full_legal_name')}
							value={this.state.subletor_full_legal_name}
						/>
			    </Form.Field>
			    <Form.Field>
			      <label>Phone</label>
			      <input placeholder='Phone Number' onChange={(e) => this.updateAttr(e, 'subletor_phone_number')} value={this.state.subletor_phone_number} />
			    </Form.Field>
			    <Form.Field>
			      <label>Email</label>
			      <input placeholder='Email' onChange={(e) => this.updateAttr(e, 'subletor_email')} value={this.state.subletor_email} />
			    </Form.Field>
					<Form.Field>
			      <label>Building Address</label>
			      <input placeholder='Address of Subletted Room' onChange={(e) => this.updateAttr(e, 'address')} value={this.state.address} />
			    </Form.Field>
					<Form.Field>
			      <label>Suite Number</label>
			      <input placeholder='Suite of Subletted Room' onChange={(e) => this.updateAttr(e, 'suite_id')} value={this.state.suite_id} />
			    </Form.Field>
					<Form.Field>
			      <label>Room Number</label>
			      <input placeholder='Subletted Room' onChange={(e) => this.updateAttr(e, 'room_id')} value={this.state.room_id} />
			    </Form.Field>
			    <Form.Field>
			      <label>Price</label>
						<Input icon='dollar' iconPosition='left' type='number' placeholder='Sublet Price' onChange={(e) => this.updateAttr(e, 'price')} value={this.state.price} />
			    </Form.Field>
			    <Form.Field>
			      <label>Requested Sublet Start Date</label>
						<DatePicker
							selected={this.state.official_begin_date}
							onChange={(d) => this.updateDate(d, 'official_begin_date')}
						/>
			    </Form.Field>
			    <Form.Field>
			      <label>Requested Sublet End Date</label>
						<DatePicker
							selected={this.state.official_end_date}
							onChange={(d) => this.updateDate(d, 'official_end_date')}
						/>
			    </Form.Field>
					<Form.Field>
						<Dropzone onDrop={(acceptedFiles, rejectedFiles) => this.uploadPhoto(acceptedFiles, rejectedFiles, 'subletor_student_card')} style={comStyles().bannerDropzone} multiple={false}>
							{
								this.state.subletor_student_card
								?
								<Image key={this.state.subletor_student_card.name} src={this.state.subletor_student_card.preview} style={comStyles().uploadImagesQueue} />
								:
								<div>Upload Student Card</div>
							}
						</Dropzone>
					</Form.Field>
			    <Form.Field>
			      <label>Landlord Name</label>
			      <input placeholder='Landlord Name' onChange={(e) => this.updateAttr(e, 'landlord_full_legal_name')} value={this.state.landlord_full_legal_name} />
			    </Form.Field>
			    <Form.Field>
			      <label>Landlord Phone</label>
			      <input placeholder='Landlord Phone' onChange={(e) => this.updateAttr(e, 'landlord_phone')} value={this.state.landlord_phone} />
			    </Form.Field>
			    <Form.Field>
			      <label>Landlord Email</label>
			      <input placeholder='Landlord Email' onChange={(e) => this.updateAttr(e, 'landlord_email')} value={this.state.landlord_email} />
			    </Form.Field>
			    <Form.Field>
			      <label>Witness Name</label>
			      <input placeholder='Witness Name' onChange={(e) => this.updateAttr(e, 'subletor_witness_full_legal_name')} value={this.state.subletor_witness_full_legal_name} />
			    </Form.Field>
			    <Form.Field>
			      <label>Witness Email</label>
			      <input placeholder='Witness Email' onChange={(e) => this.updateAttr(e, 'subletor_witness_email')} value={this.state.subletor_witness_email} />
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
SubletApplication.propTypes = {
	history: PropTypes.object.isRequired,
	sublet_post: PropTypes.object.isRequired,		// passed in
	subletee_contract: PropTypes.object.isRequired,	// passed in
	saveSubletorForm: PropTypes.func.isRequired,	// passed in
	tenant_profile: PropTypes.object.isRequired,
}

// for all optional props, define a default value
SubletApplication.defaultProps = {
	tenant_profile: {},
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(SubletApplication)

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
