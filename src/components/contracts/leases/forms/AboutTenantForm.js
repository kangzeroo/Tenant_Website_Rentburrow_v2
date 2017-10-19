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
	Form,
	Card,
	Accordion,
	Button,
	Checkbox,
	Icon,
	Step,
	Modal,
	Message,
	Dropdown,
	Image,
	Radio,
	Header,
} from 'semantic-ui-react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { xMidBlue } from '../../../../styles/base_colors'
import { countryOptions, languageOptions } from '../../../../api/leasing/leasing_options'
import { filterNonImages } from '../../../../api/aws/aws-S3'
import { saveTenantDetails, } from '../../../../api/auth/tenant_api'

class AboutStudentForm extends Component {

	constructor() {
		super()
		this.state = {
	    first_name: '',
	    last_name: '',
	    date_of_birth: '',
	    gender: '',
      
			building_address_components: {},
			building_address: '',					  // the building_address typed in
      building_lat: 0,                // the building lat according to google
      building_long: 0,               // the building lng according to google
      building_place_id: '',          // the building place_id according to google
      
      phone: '',
	    email: '',

	    primary_language: '',
	    secondary_languages: '',
	    citizenship: '',
	    permanent_resident: false,
	    government_id: '',

			understand_uncertainty: false,
			submitted: false,
			error_messages: [],
			activeIndex: 1,

			toggle_modal: false,
      modal_name: '',
      context: {},
	  }

		this.why_sign_online = [
			{ index: 1, icon: 'book', title: 'It\'s required to lease', description: 'Landlords require you to provide identifying information about yourself in order to complete the lease application and live in their building. It is mandatory to provide this information so that the landlord can do background checks and other security and legal requirements. You would want your neighbors to go through these checks too - everyone has to provide this information to the landlord.' },
			{ index: 2, icon: 'user', title: 'Why do I have to upload a piece of Government ID?', description: 'Government ID is needed in order to verify that the name you provided is real. All landlords require this official record. You would want your neighbor to have to prove their real name too, so Government ID helps ensure safety for all tenants.' },
			{ index: 3, icon: 'eye', title: 'Who will see my information?', description: 'Only the landlord will be able to see your information. Like a regular lease application, the landlord will only use this information to do their job.' },
			{ index: 4, icon: 'expeditedssl', title: 'Is my information safe?', description: 'Yes. Rentburrow secures your information using Amazon Web Services and only allows your landlord to access it. Third parties do not have access to your information. Uploaded photos are encrypted using bank-level AES-256 bit encryption.' },
		]
	}

	componentWillMount() {
		const tenant = this.props.tenant_profile
		this.setState({
			first_name: tenant.first_name,
			last_name: tenant.last_name,
			phone: tenant.phone,
			email: tenant.email,
    })
  }
  
	componentDidMount() {
		// google address autocomplete
    // restricted to only show addresses and in canada
    this.autocomplete = new google.maps.places.Autocomplete(
            /** @type {!HTMLInputElement} */(document.getElementById('building_address')),
            {
              types: ['address'],
              componentRestrictions: { country: 'ca' },
              // bounds: new google.maps.LatLngBounds(
              //   new google.maps.LatLng(-80.671519, 43.522913),
              //   new google.maps.LatLng(-80.344067, 43.436979)
              // )
            }
          );
    // When the user selects an address from the dropdown, populate the address
    // fields in the form.
    this.autocomplete.addListener('place_changed', this.fillInAddress.bind(this));
	}

  // fill in address from google autocomplete dropdown
  fillInAddress() {
		const place = this.autocomplete.getPlace()
		this.setState({
      building_address_components: place.address_components,
      building_address: place.formatted_address,
			building_lat: place.geometry.location.lat().toFixed(7),
      building_long: place.geometry.location.lng().toFixed(7),
			building_place_id: place.place_id,
		})
	}

	updateAttr(e, attr) {
		this.setState({
			[attr]: e.target.value,
			current_active_field: attr,
		})
	}

	updateDate(date, attr) {
		this.setState({
			[attr]: date,
			current_active_field: attr,
		})
	}

	// upload just 1 photo
  uploadPhoto(acceptedFiles, rejectedFiles, attr) {
    const filteredFiles = filterNonImages(acceptedFiles)
    this.setState({
      [attr]: filteredFiles[0]
    })
  }

	saveTenantDetailsToDb() {
		console.log({
			tenant_id: this.props.tenant_profile.tenant_id,
			first_name: this.state.first_name,
			last_name: this.state.last_name,
			address: this.state.address,
			date_of_birth: this.state.date_of_birth.format('MMMM Do YYYY'),
			gender: this.state.gender,
			primary_language: this.state.primary_language,
			secondary_languages: this.state.secondary_languages,
			citizenship: this.state.citizenship,
			permanent_resident: this.state.permanent_resident,
			government_id: this.state.government_id,
		})
		saveTenantDetails({
			tenant_id: this.props.tenant_profile.tenant_id,
			first_name: this.state.first_name,
			last_name: this.state.last_name,
			address: this.state.address,
			date_of_birth: this.state.date_of_birth.format('MMMM Do YYYY'),
			gender: this.state.gender,
			primary_language: this.state.primary_language,
			secondary_languages: this.state.secondary_languages,
			citizenship: this.state.citizenship,
			permanent_resident: this.state.permanent_resident,
			government_id: this.state.government_id,
		})
		.then((data) => {
			this.props.goToNextForm()
		})
	}

	toggleModal(bool, attr, context) {
		this.setState({
      toggle_modal: bool,
      modal_name: attr,
      context,
    })
  }

	renderAppropriateModal(modal_name, context) {
		if (modal_name === 'terms') {
			return (
	      <Modal
					dimmer
					open={this.state.toggle_modal}
					onClose={() => this.toggleModal(false)}
					closeIcon
					size='fullscreen'
				>
	        <Modal.Content style={comStyles().terms_and_conditions}>
						{
							this.terms_and_conditions
						}
	        </Modal.Content>
	      </Modal>
	    )
		}
	}

	renderBasicProfileCard() {
		return (
			<Card raised fluid style={comStyles().card_style}>
				<Card.Header style={comStyles().card_header}>
					The Basics
				</Card.Header>
				<div style={comStyles().student_div}>
					<div style={comStyles().student_form}>
						<Form.Field>
							<label>Legal First Name</label>
							<input
								placeholder='Legal First Name'
								onChange={(e) => this.updateAttr(e, 'first_name')}
								value={this.state.first_name}
								disabled={this.props.tenant_profile.first_name !== ''}
							/>
						</Form.Field>
						<Form.Field>
							<label>Legal Last Name</label>
							<input
								placeholder='Legal Last Name'
								onChange={(e) => this.updateAttr(e, 'last_name')}
								value={this.state.last_name}
								disabled={this.props.tenant_profile.last_name !== ''}
							/>
						</Form.Field>
						<Form.Field required>
							<label>Date of Birth</label>
							<DatePicker
								selected={this.state.date_of_birth}
								onChange={(d) => this.updateDate(d, 'date_of_birth')}
							/>
						</Form.Field>
						<Form.Field required>
							<label>Gender</label>
							<Dropdown
								placeholder='Gender'
								selection
								onChange={(e, value) => this.updateAttr({ target: { value: value.value } }, 'gender')}
								options={[
									{ key: 'male', value: 'male', text: 'Male' },
									{ key: 'female', value: 'female', text: 'Female' },
									{ key: 'other', value: 'other', text: 'Other' },
								]}
							/>
						</Form.Field>
					</div>
					{/*<div style={comStyles().student_card}>
						<Button basic fluid primary onClick={() => this.props.history.push('/account')} content='Edit Profile Details' style={comStyles().edit_profile} />
					</div>*/}
				</div>
			</Card>
		)
	}

	renderContactProfileCard() {
		return (
			<Card raised fluid style={comStyles().card_style}>
				<Card.Header style={comStyles().card_header}>
					Contact Info
				</Card.Header>
				<div style={comStyles().student_div}>
					<div style={comStyles().student_form}>
						<Form.Field required>
							<label>Permanent Address</label>
							<input
								id='building_address'
								placeholder='Permanent Address'
								onChange={(e) => this.updateAttr(e, 'building_address')}
								value={this.state.building_address}
							/>
						</Form.Field>
						<Form.Field>
							<label>Primary Phone</label>
							<input
								placeholder='Primary Phone'
								onChange={(e) => this.updateAttr(e, 'phone')}
								value={this.state.phone}
								disabled={this.props.tenant_profile.phone !== ''}
							/>
						</Form.Field>
						<Form.Field>
							<label>Email</label>
							<input
								placeholder='Email'
								onChange={(e) => this.updateAttr(e, 'email')}
								value={this.state.email}
								disabled={this.props.tenant_profile.email !== ''}
							/>
						</Form.Field>
					</div>
					{/*<div style={comStyles().student_card}>
						<Button basic fluid primary onClick={() => this.props.history.push('/account')} content='Edit Profile Details' style={comStyles().edit_profile} />
					</div>*/}
				</div>
			</Card>
		)
	}

	renderGovtAndLanguageCard() {
		return (
			<Card raised fluid style={comStyles().card_style}>
				<Card.Header style={comStyles().card_header}>
					Language and Government
				</Card.Header>
				<div style={comStyles().student_div}>
					<div style={comStyles().student_form}>
						<Form.Field required>
							<label>Primary Language</label>
							<Dropdown
								placeholder='English'
								selection
								onChange={(e, value) => this.updateAttr({ target: { value: value.value } }, 'primary_language')}
								options={languageOptions}
							/>
						</Form.Field>
						<Form.Field required>
							<label>Secondary Languages</label>
							<input
								placeholder='List secondary languages here'
								onChange={(e) => this.updateAttr(e, 'secondary_languages')}
								value={this.state.secondary_languages}
							/>
						</Form.Field>
						<Form.Field required>
							<label>Citizenship</label>
							<Dropdown
								placeholder='Select Country'
								fluid
								selection
								onChange={(e, value) => this.updateAttr({ target: { value: value.value } }, 'citizenship')}
								options={countryOptions}
							/>
						</Form.Field>
						<Form.Field required>
							<Checkbox
								onChange={(e, d) => this.updateAttr({ target: { value: d.checked } }, 'permanent_resident')}
								checked={this.state.permanent_resident}
								label='I am a Canadian Permanant Resident'
							/>
						</Form.Field>
						<br />
						<Form.Field required>
							<label>Photo ID</label>
							<label>(Drivers License, Health Card or Passport)</label>
							<Dropzone onDrop={(acceptedFiles, rejectedFiles) => this.uploadPhoto(acceptedFiles, rejectedFiles, 'government_id')} style={comStyles().dropzone} multiple={false}>
								{
									this.state.government_id
									?
									<div>
										{
											this.state.government_id.preview
											?
											<Image key={this.state.government_id.name} src={this.state.government_id.preview} style={comStyles().uploadImagesQueue} />
											:
											<Image key='government_id' src={this.state.government_id} style={comStyles().uploadImagesQueue} />
										}
									</div>
									:
									<div style={comStyles().dropzone_text}>Upload Government ID</div>
								}
							</Dropzone>
						</Form.Field>
					</div>
					{/*<div style={comStyles().student_card}>
						<Button basic fluid primary onClick={() => this.props.history.push('/account')} content='Edit Profile Details' style={comStyles().edit_profile} />
					</div>*/}
				</div>
			</Card>
		)
	}

	render() {
		return (
			<div style={comStyles().container}>
				<div style={comStyles().main_contents}>
					<Header
						as='h1'
						icon='user'
						content='Tenant Profile'
						subheader='Tell the landlord a bit more about you'
					/>
					<div style={comStyles().contents}>
						<div style={comStyles().form_contents}>
							<Form style={comStyles().form}>

								{
									this.renderBasicProfileCard()
								}
								{
									this.renderContactProfileCard()
								}
								{
									this.renderGovtAndLanguageCard()
								}

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
									<Button
										primary
										size='large'
										content='Save'
										onClick={() => this.saveTenantDetailsToDb()}
									/>
								}
							</Form>
						</div>
						<div style={comStyles().tips_contents}>
							<Accordion styled>
								<Accordion.Title active={this.stateactiveIndex === 0} style={comStyles().why_sign_online_title}>
									Why do I need to answer these questions?
								</Accordion.Title>
								{
									this.why_sign_online.map((why) => {
										return (
											<div key={why.index}>
												<Accordion.Title active={this.state.activeIndex === why.index} onClick={() => this.setState({ activeIndex: why.index })} style={comStyles().why_title}>
													<Icon name={why.icon} />
													&nbsp; &nbsp;
													{ why.title }
												</Accordion.Title>
												<Accordion.Content active={this.state.activeIndex === why.index} style={comStyles().why_content}>
													<p>
														{ why.description }
													</p>
												</Accordion.Content>
											</div>
										)
									})
								}
							</Accordion>
						</div>
					</div>
				</div>
				{
					this.renderAppropriateModal(this.state.modal_name, this.state.context)
				}
			</div>
		)
	}
}

// defines the types of variables in this.props
AboutStudentForm.propTypes = {
	history: PropTypes.object.isRequired,
	tenant_profile: PropTypes.object.isRequired,
	goToNextForm: PropTypes.func.isRequired,			// passed in
}

// for all optional props, define a default value
AboutStudentForm.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(AboutStudentForm)

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
		},
		form: {
      display: 'flex',
      flexDirection: 'column',
		},
		viewTerms: {
			color: 'blue',
			cursor: 'pointer',
		},
		contents: {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'center',
			padding: '20px',
		},
		form_contents: {
      display: 'flex',
      flexDirection: 'column',
			minWidth: '600px',
			width: '60vw',
			height: '100%',
			padding: '20px',
		},
		tips_contents: {
      display: 'flex',
      flexDirection: 'column',
			minWidth: '350px',
			width: '25vw',
			padding: '20px',
		},
		card_style: {
			padding: '20px',
			height: 'auto',
		},
		dates: {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'space-between',
		},
		student_div: {
			display: 'flex',
			flexDirection: 'row',
		},
		student_form: {
			display: 'flex',
			flexDirection: 'column',
			width: '75%',
		},
		student_card: {
			display: 'flex',
			flexDirection: 'column',
			padding: '10px',
			justifyContent: 'center',
			alignItems: 'center',
		},
		main_contents: {
      display: 'flex',
      flexDirection: 'column',
			minHeight: '85vh',
			maxHeight: '85vh',
			padding: '20px',
			overflow: 'scroll',
			width: '85vw',
		},
		step_contents: {
      display: 'flex',
      flexDirection: 'column',
			minHeight: '10vh',
			maxHeight: '10vh',
		},
		card_header: {
			padding: '30px 0px 40px 0px',
			fontWeight: 'bold',
			fontSize: '1.8rem',
		},
		sign_header: {
			width: '100%',
			padding: '40px',
			fontSize: '2.5rem',
			fontWeight: 'bold',
			textAlign: 'center',
			backgroundColor: xMidBlue,
			color: 'white',
			borderRadius: '10px',
		},
		why_sign_online_title: {
			fontSize: '1.8rem',
			fontWeight: 'bold',
			backgroundColor: xMidBlue,
			color: 'white',
			lineHeight: '30px',
		},
		why_title: {
			fontSize: '1.5rem',
			fontWeight: 'bold',
		},
		why_content: {
			fontSize: '1.2rem',
		},
		hidden_loading: {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'center',
			alignItems: 'center',
			padding: '20px',
		},
		edit_profile: {
			margin: '10px auto',
		},
		terms_and_conditions: {
			padding: '30px',
			fontSize: '1.3rem',
			fontWeight: 'bold',
		},
		dropzone_text: {
			width: '100%',
			height: '100%',
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'center',
			alignItems: 'center',
		},
	}
}
