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
	Image,
	Dropdown,
} from 'semantic-ui-react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { xMidBlue } from '../../../../styles/base_colors'
import { countryOptions, languageOptions } from '../../../../api/leasing/leasing_options'
import { filterNonImages } from '../../../../api/aws/aws-S3'

class GuarantorForm extends Component {

	constructor() {
		super()
		this.state = {
			first_name: '',
	    last_name: '',
	    relationship: '',
	    date_of_birth: '',
	    address: '',
	    cell_phone: '',
	    email: '',
	    primary_language: '',
	    secondary_languages: '',
	    government_id: '',
	    citizenship: '',
	    permanent_resident: false,

			guarantor_is_in_canada: false,
			guarantor_not_possible: false,
			submitted: false,
			error_messages: [],
			activeIndex: 1,

			toggle_modal: false,
      modal_name: '',
      context: {},
	  }

		this.why_sign_online = [
			{ index: 1, icon: 'money', title: 'In case you cannot pay rent', description: 'The landlord needs to be able to collect your rent debt from someone. Your guarantor is the person who the landlord has a legal right to collect your missing rent payments from. That means if your mom is your guarantor, than failure to pay rent will result in the landlord contacting and collecting rent from her.' },
			{ index: 2, icon: 'flag', title: 'Why does my guarantor have to be Canadian?', description: 'Landlords require that your guarantor be Canadian because it is too difficult to collect rent debt internationally. Your guarantor does not need to be Canadian citizen, they just need to be residing in Canada.' },
			{ index: 3, icon: 'user', title: 'Why do I need to upload a photo of my guarantors Government ID?', description: 'For the same reason why you need to upload a piece of Government ID. So that the landlord can verify that the name provided matches a real official record.' },
			{ index: 4, icon: 'user x', title: 'What if I do not have a Canadian guarantor?', description: 'If you do not have a Canadian guarantor, then the landlord will deem you a risky tenant. In order to compensate for this risk, the landlord may require you to provide additional months rent. You do not have to provide this additional rent deposit, but the landlord also does not have to take the risk of renting out to you.' },
		]
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

	toggleModal(bool, attr, context) {
		this.setState({
      toggle_modal: bool,
      modal_name: attr,
      context,
    })
  }

	// upload just 1 photo
  uploadPhoto(acceptedFiles, rejectedFiles, attr) {
    const filteredFiles = filterNonImages(acceptedFiles)
    this.setState({
      [attr]: filteredFiles[0]
    })
  }

	toggleGuarantorNotPossible(event, data) {
		if (data.checked) {
			this.setState({
				guarantor_not_possible: !this.state.guarantor_not_possible,
				guarantor_is_in_canada: false,
			})
		} else {
			this.setState({
				guarantor_not_possible: !this.state.guarantor_not_possible,
			})
		}
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

	renderGuarantorAvailable() {
		return (
			<Card raised fluid style={comStyles().card_style}>
				<div style={comStyles().student_div}>
					<div style={comStyles().student_form}>
						<Form.Field>
							<Checkbox
								onChange={(e, d) => this.updateAttr({ target: { value: d.checked } }, 'guarantor_is_in_canada')}
								checked={this.state.guarantor_is_in_canada}
								label='I verify that my guarantor lives in Canada'
							/>
						</Form.Field>
						<Form.Field>
							<Checkbox
								onChange={(e, d) => this.toggleGuarantorNotPossible(e, { checked: !d.checked })}
								checked={this.state.guarantor_not_possible}
								label='I do not have a Canadian guarantor'
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

	renderBasicProfile() {
		return (
			<Card raised fluid style={comStyles().card_style}>
				<Card.Header style={comStyles().card_header}>
					Guarantor Profile
				</Card.Header>
				<div style={comStyles().student_div}>
					<div style={comStyles().student_form}>
						<Form.Field>
							<label>Legal First Name</label>
							<input
								placeholder='Legal First Name'
								onChange={(e) => this.updateAttr(e, 'first_name')}
								value={this.state.first_name}
							/>
						</Form.Field>
						<Form.Field>
							<label>Legal Last Name</label>
							<input
								placeholder='Legal Last Name'
								onChange={(e) => this.updateAttr(e, 'last_name')}
								value={this.state.last_name}
							/>
						</Form.Field>
						<Form.Field>
							<label>Guarantor Relationship to Tenant</label>
							<input
								placeholder='Eg. Mother, Legal Guardian, Wealthy Uncle'
								onChange={(e) => this.updateAttr(e, 'relationship')}
								value={this.state.relationship}
							/>
						</Form.Field>
						<Form.Field>
							<label>Guarantor Date of Birth</label>
							<DatePicker
								selected={this.state.date_of_birth}
								onChange={(d) => this.updateDate(d, 'date_of_birth')}
							/>
						</Form.Field>
					</div>
				</div>
			</Card>
		)
	}

	renderContactInfo() {
		return (
			<Card raised fluid style={comStyles().card_style}>
				<Card.Header style={comStyles().card_header}>
					Contact Information
				</Card.Header>
				<div style={comStyles().student_div}>
					<div style={comStyles().student_form}>
						<Form.Field>
							<label>Address</label>
							<input
								placeholder='Address'
								onChange={(e) => this.updateAttr(e, 'address')}
								value={this.state.address}
							/>
						</Form.Field>
						<Form.Field>
							<label>Cell Phone</label>
							<input
								placeholder='Cell Phone'
								onChange={(e) => this.updateAttr(e, 'cell_phone')}
								value={this.state.cell_phone}
							/>
						</Form.Field>
						<Form.Field>
							<label>Email</label>
							<input
								placeholder='Email'
								onChange={(e) => this.updateAttr(e, 'email')}
								value={this.state.email}
							/>
						</Form.Field>
					</div>
				</div>
			</Card>
		)
	}

	renderGovtInfo() {
		return (
			<Card raised fluid style={comStyles().card_style}>
				<Card.Header style={comStyles().card_header}>
					Language and Government
				</Card.Header>
				<div style={comStyles().student_div}>
					<div style={comStyles().student_form}>
						<Form.Field>
							<label>Primary Language</label>
							<Dropdown
								placeholder='English'
								selection
								onChange={(e, value) => this.updateAttr({ target: { value: value.value } }, 'primary_language')}
								options={languageOptions}
							/>
						</Form.Field>
						<Form.Field>
							<label>Secondary Languages</label>
							<input
								placeholder='List secondary languages here'
								onChange={(e) => this.updateAttr(e, 'secondary_languages')}
								value={this.state.secondary_languages}
							/>
						</Form.Field>
						<Form.Field>
							<label>Citizenship</label>
							<Dropdown
								placeholder='Select Country'
								fluid
								selection
								onChange={(e, value) => this.updateAttr({ target: { value: value.value } }, 'citizenship')}
								options={countryOptions}
							/>
						</Form.Field>
						<Form.Field>
							<Checkbox
								onChange={(e, d) => this.updateAttr({ target: { value: d.checked } }, 'permanent_resident')}
								checked={this.state.permanent_resident}
								label='The guarantor is a Canadian Permanant Resident'
							/>
						</Form.Field>
						<br />
						<Form.Field>
							<label>Photo ID</label>
							<label>(Drivers License or Health Card)</label>
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
					<div style={comStyles().sign_header}>Guarantors</div>
					<div style={comStyles().contents}>
						<div style={comStyles().form_contents}>
							{
								this.state.guarantor_not_possible
								?
								<Card raised fluid style={comStyles().card_style}>
									<Card.Header style={comStyles().no_guarantor_message}>
										If you do not have a Canadian guarantor, the landlord will likely require some other form of security from you. Most often this will be a few extra months of rent in advance. Click next to continue.
									</Card.Header>
									<br />
									<Form.Field>
										<Checkbox
											onChange={(e, d) => this.toggleGuarantorNotPossible(e, d)}
											checked={!this.state.guarantor_not_possible}
											label='I do have a Canadian guarantor'
										/>
									</Form.Field>
								</Card>
								:
								<Form style={comStyles().form}>
									{
										this.renderGuarantorAvailable()
									}
									{
										this.renderBasicProfile()
									}
									{
										this.renderContactInfo()
									}
									{
										this.renderGovtInfo()
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
								</Form>
							}
							{
								this.state.submitted
								?
								<div style={comStyles().hidden_loading}>
									<img src='https://s3.amazonaws.com/rentburrow-static-assets/Loading+Icons/loading-blue-clock.gif' width='50px' height='auto' />
								</div>
								:
								<Button type='submit' primary size='large' onClick={() => this.props.goToNextForm()}>Next</Button>
							}
						</div>
						<div style={comStyles().tips_contents}>
							<Accordion styled>
								<Accordion.Title active={this.stateactiveIndex === 0}  style={comStyles().why_sign_online_title}>
									Why do I need a guarantor?
								</Accordion.Title>
								{
									this.why_sign_online.map((why) => {
										return (
											<div key={why.index}>
												<Accordion.Title active={this.state.activeIndex === why.index}  onClick={() => this.setState({ activeIndex: why.index })} style={comStyles().why_title}>
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
GuarantorForm.propTypes = {
	history: PropTypes.object.isRequired,
	tenant_profile: PropTypes.object.isRequired,
	goToNextForm: PropTypes.func.isRequired,			// passed in
}

// for all optional props, define a default value
GuarantorForm.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(GuarantorForm)

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
			minHeight: '100%',
			maxHeight: '100%',
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
		no_guarantor_message: {
			lineHeight: '20px',
		}
	}
}
