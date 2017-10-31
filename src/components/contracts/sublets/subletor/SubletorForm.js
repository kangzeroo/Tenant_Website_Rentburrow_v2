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
	Card,
	Step,
	Accordion,
	Icon,
	Modal,
} from 'semantic-ui-react'
import {
	xMidBlue,
} from '../../../../styles/base_colors'
import DatePicker from 'react-datepicker'
import { getStudentCard } from '../../../../api/auth/tenant_api'
import { filterNonImages, getEncryptedS3Image } from '../../../../api/aws/aws-S3'
import { convertToRegularSubletObj, getSubleteeProfile, } from '../../../../api/signing/sublet_contract_api'
import SubleteeSubletorRelationship from '../SubleteeSubletorRelationship'
import { validateEmail } from '../../../../api/general/general_api'
import SubletorIntroModal from '../../../instructions/SubletorIntroModal'
require('../../../../styles/react-datepicker.css')


class SubletorForm extends Component {

	constructor() {
		super()
		this.state = {
			subletor_first_name: '',
			subletor_last_name: '',
			subletor_phone_number: '',
			subletor_email: '',
			subletor_student_card: '',
			official_begin_date: moment(),
			official_end_date: moment(),
			original_lease_signing_date: moment(),
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
			auto_sublet_terms_verified: false,
			current_active_field: 'subletor_first_name',
			activeIndex: 1,

			toggle_modal: false,
      modal_name: '',
      context: {},
		}
		this.steps = [
		  { icon: 'user', title: 'Profile', description: 'Subletor Profile', step_number: '1' },
		  { icon: 'building', title: 'Room Info', description: 'Sublet Terms', step_number: '2' },
		  { icon: 'phone', title: 'Landlord Info', description: 'Contact & Emergancies', step_number: '3' },
		  // { icon: 'eye', title: 'Contract Witness', description: 'Verification', step_number: '4' },
		]
		this.why_sign_online = [
			{ index: 1, icon: 'protect', title: 'It\'s Safe', description: 'By signing online, both parties get a digital receipt of the contract. This eliminates the possibilty of fraud or an invalid sublet contract. All sublet contracts signed with our software is legally binding. We require all users to sign in with Facebook so that you can talk directly with them and see that they are a real person. Your signature is completely safe using our service provider PandaDoc. You must be 18 or older to sign a contract.' },
			{ index: 2, icon: 'lightning', title: 'It\'s Simple and Fast', description: 'The traditional method requires a printer or PDF software, but online signing only requires a web browser. If you wanted, you could print out a contract to sign in person or send it as an email PDF to be signed with random software, but how tedious is that? Rentburrow allows you to complete the entire process online within minutes - way easier than the old way.' },
			{ index: 3, icon: 'question circle', title: 'How does it work?', description: 'Good question. The person who sent you this URL link most likely already discussed sublet contract terms with you. They have filled out their portion, now you must fill out the form on the left. When you are done, click submit. After a successful submission, everyone including witnesses will get an email where you can sign the sublet contract online. Be sure to read over the sublet contract one last time before signing! Once signed, the contract is complete and you will arrange a time to meet the other person to exchange keys and payment.' },
			{ index: 4, icon: 'dollar', title: 'Is there any cost?', description: 'Nope, its completely free :)' },
			{ index: 5, icon: 'eye', title: 'Why do I need a witness?', description: 'Most contracts require a contract as backup proof that the contract was indeed signed by the stated parties. Don\'t worry, witnesses can be anyone who saw you sign the contract. So you can put your roommate, friend or a parent/guardian. They will get an email and be able to sign from within the email without any extra hassle.' },
			{ index: 6, icon: 'user', title: 'Why do I need to upload my student card?', description: 'For safety purposes. Because you are renting student housing, we require that you be a student. You do not necessarily need to be a student of the University of Waterloo or Wilfrid Laurier University, as long as you are a student. The other person will be able to see your student card, and you will be able to see theirs. That way, everyone feels safe. We keep all sensitive information secure and encrypted on bank level AES-256 bit encryption.' },
			{ index: 7, icon: 'privacy', title: 'How do I get paid rent and exchange keys?', description: 'You will still need to meet up in person to exchange keys and payment. It is up to you to determine how you will receive payment from the other person. Please remember that when you rent to a sublet, you are still paying the original landlord. This is your responsibility, not the subletee.' },
			{ index: 8, icon: 'user cancel', title: 'What if the other person backs out?', description: 'If the other person agreed to sublet from you and signed the contract but later changed their mind, then legally they are still bound to the agreement. If the other person ignores this and does not pay you, you will have to work things out with them by yourself. You must also continue paying rent to your original landlord. Rentburrow cannot enforce a sublet contract for you, so be sure that the other person has integrity to uphold the contract.' },
			{ index: 9, icon: 'legal', title: 'What are the terms and conditions?', description: 'We keep the terms and conditions very simple. Rentburrow provides you the means to sign a sublet contract online but we do not guarantee that the sublet contract is legally valid in every situation. We also do not guarantee that signing a sublet contract via Rentburrow will guarantee that you actually get the sublet - that is up to you and the other person. By using this service, you agree to take all responsibility for this sublet contract. You also release Rentburrow (and its parent company Bytenectar Inc) from all legal responsibility related to this sublet contract.' },
			{ index: 10, icon: 'heart', title: 'This is awesome, how can I show some appreciation?', description: 'We\'re glad you like this! Rentburrow is made with love by a group of students from the University of Waterloo and Wilfrid Laurier University. We welcome any and all feedback! Message or like us on Facebook at https://www.facebook.com/rentburrow/' },
		]
		this.terms_and_conditions = 'We keep the terms and conditions very simple. Rentburrow provides you the means to sign a sublet contract online but we do not guarantee that the sublet contract is legally valid in every situation. We also do not guarantee that signing a sublet contract via Rentburrow will guarantee that you actually get the sublet - that is up to you and the other person. By using this service, you agree to take all responsibility for this sublet contract. You also release Rentburrow (and its parent company Bytenectar Inc) from all legal responsibility related to this sublet contract.'
	}

	componentWillMount() {
		this.setState({
			subletor_first_name: this.props.tenant_profile.first_name ? this.props.tenant_profile.first_name : '',
			subletor_last_name: this.props.tenant_profile.last_name ? this.props.tenant_profile.last_name : '',
			subletor_phone_number: this.props.tenant_profile.phone ? this.props.tenant_profile.phone : '',
			subletor_email: this.props.tenant_profile.email ? this.props.tenant_profile.email : '',
			price: this.props.subletee_contract.rent_price,
			address: this.props.subletee_contract.building_address,
			official_begin_date: moment(this.props.subletee_contract.begin_date),
			official_end_date: moment(this.props.subletee_contract.end_date),

			toggle_modal: true,
			modal_name: 'primer',
		})
		getSubleteeProfile(this.props.subletee_contract.subletee_id)
			.then((data) => {
				const subletee = data
				this.setState({
					subletee,
				})
			})
		getStudentCard({ tenant_id: this.props.tenant_profile.tenant_id }).then((data) => {
			if (data) {
				getEncryptedS3Image(data.student_card, `${this.props.tenant_profile.tenant_id}/`).then((data) => {
					this.setState({
						subletor_student_card: data.image_blob
					})
				})
			} else {
				this.setState({
					subletor_student_card: ''
				})
			}
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

	toggleModal(bool, attr, context) {
		this.setState({
      toggle_modal: bool,
      modal_name: attr,
      context,
    })
  }

	submit() {
		this.setState({
			submitted: true,
		})
		if (this.formValidation()) {
			setTimeout(() => {
				this.props.saveSubletorForm(this.state)
			}, 3000)
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
		if (this.state.subletor_first_name.length === 0 || this.state.subletor_last_name.length === 0 || this.state.subletor_phone_number.length === 0 || !this.state.subletor_email.length === 0) {
			errors.push('You must include your name, phone number and email')
		}
		if (this.state.suite_id.length === 0 || this.state.room_id.length === 0) {
			errors.push('You must include the suite number and room number')
		}
		// if (!validateEmail(this.state.subletor_email) || !validateEmail(this.state.subletor_witness_email)) {
		// 	errors.push('One of the emails you entered is not valid')
		// }
		// if (this.state.subletor_witness_full_legal_name.length === 0 || this.state.subletor_witness_email.length === 0) {
		// 	errors.push('Please provide a witness to sign the contract too')
		// }
		if (!this.state.address.length > 1) {
			errors.push('There must be an address')
		}
		if (!this.state.official_begin_date.isAfter(moment())) {
			errors.push('The contract begin date cannot be in the past')
		}
		if (!this.state.official_end_date.isAfter(this.state.official_start_date)) {
			errors.push('The contract end date cannot be before the start date')
		}
		if (this.state.original_lease_signing_date.isAfter(moment())) {
			errors.push('The original lease signing date must be in the past')
		}
		if (this.state.price <= 0) {
			errors.push('Monthly sublet rent cannot be zero or less')
		}
		// if (!this.state.subletor_student_card) {
		// 	errors.push('You must upload a picture of your student card')
		// }
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
			this.setState({
				error_messages: errors,
				submitted: false,
			})
		}
		return submittable
	}

	checkIfStepActive(step_number) {
		let active = false
		if (step_number === '1') {
			if (this.state.current_active_field === 'subletor_first_name' || this.state.current_active_field === 'subletor_last_name' || this.state.current_active_field === 'subletor_phone_number' || this.state.current_active_field === 'subletor_email') {
				active = true
			}
		} else if (step_number === '2') {
			if (this.state.current_active_field === 'official_begin_date' || this.state.current_active_field === 'official_end_date' || this.state.current_active_field === 'price' || this.state.current_active_field === 'address' || this.state.current_active_field === 'suite_id' || this.state.current_active_field === 'room_id' || this.state.current_active_field === 'original_lease_signing_date') {
				active = true
			}
		} else if (step_number === '3') {
			if (this.state.current_active_field === 'landlord_full_legal_name' || this.state.current_active_field === 'landlord_phone' || this.state.current_active_field === 'landlord_email') {
				active = true
			}
		}
		// else if (step_number === '4') {
		// 	if (this.state.current_active_field === 'subletor_witness_full_legal_name' || this.state.current_active_field === 'subletor_witness_email') {
		// 		active = true
		// 	}
		// }
		return active
	}

	checkIfStepComplete(step_number) {
		let complete = false
		if (step_number === '1') {
			if (this.state.subletor_first_name.length > 0 && this.state.subletor_last_name.length > 0 && this.state.subletor_phone_number.length > 0 && this.state.subletor_email.length > 0 && this.state.subletor_student_card && this.state.subletor_student_card.name && this.state.subletor_student_card.name.length > 0) {
				complete = true
			}
		} else if (step_number === '2') {
			if (this.state.address.length > 1 && this.state.price > 0 && this.state.official_begin_date && this.state.official_end_date && this.state.original_lease_signing_date && this.state.suite_id.length > 0 && this.state.room_id.length > 0 && this.state.auto_sublet_terms_verified) {
				complete = true
			}
		} else if (step_number === '3') {
			if (this.state.landlord_full_legal_name.length > 0 && this.state.landlord_phone.length > 0 && this.state.landlord_email.length > 0) {
				complete = true
			}
		}
		// else if (step_number === '4') {
		// 	if (this.state.subletor_witness_full_legal_name.length > 0 && this.state.subletor_witness_email.length > 0) {
		// 		complete = true
		// 	}
		// }
		return complete
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
		} else if (modal_name === 'primer') {
			return (
	      <Modal
	        dimmer
	        open={this.state.toggle_modal}
	        onClose={() => this.toggleModal(false)}
	        closeIcon
	        size='fullscreen'
	      >
	        <Modal.Content style={comStyles().terms_and_conditions}>
						<SubletorIntroModal
							toggleModal={(a, b, c) => this.toggleModal(a, b, c)}
						/>
	        </Modal.Content>
	      </Modal>
	    )
		}
	}

	render() {
		return (
			<div style={comStyles().container}>
				<div style={comStyles().main_contents}>
					<Card fluid color='blue' header='Approve This Subletee' style={comStyles().sign_header} />

					<div style={comStyles().subletee_subletor_relationship}>
						<SubleteeSubletorRelationship
							subletee={{
								fb_user_id: this.state.subletee.fb_user_id,
								fb_user_name: `${this.state.subletee.first_name} ${this.state.subletee.last_name}`,
								fb_user_pic: this.state.subletee.thumbnail
							}}
							sublet_post={convertToRegularSubletObj(this.props.sublet_post)}
						/>
					</div>

					<div style={comStyles().contents}>
						<div style={comStyles().form_contents}>
							<Form style={comStyles().form}>

								<Card raised fluid style={comStyles().card_style}>
									<Card.Header style={comStyles().card_header}>
										Step 1: Subletor Profile
									</Card.Header>
									<div style={comStyles().student_div}>
										<div style={comStyles().student_form}>
									    <Form.Field>
									      <label>First Name</label>
									      <input
													placeholder='First Name'
													onChange={(e) => this.updateAttr(e, 'subletor_first_name')}
													value={this.state.subletor_first_name}
													disabled={this.props.tenant_profile.first_name !== ''}
												/>
									    </Form.Field>
									    <Form.Field>
									      <label>Last Name</label>
									      <input
													placeholder='Last Name'
													onChange={(e) => this.updateAttr(e, 'subletor_last_name')}
													value={this.state.subletor_last_name}
													disabled={this.props.tenant_profile.last_name !== ''}
												/>
									    </Form.Field>
									    <Form.Field>
									      <label>Phone</label>
									      <input
													placeholder='Phone Number'
													onChange={(e) => this.updateAttr(e, 'subletor_phone_number')}
													value={this.state.subletor_phone_number}
													disabled={this.props.tenant_profile.phone !== ''}
												/>
									    </Form.Field>
									    <Form.Field>
									      <label>Email</label>
									      <input
													placeholder='Email'
													onChange={(e) => this.updateAttr(e, 'subletor_email')}
													value={this.state.subletor_email}
													disabled={this.props.tenant_profile.email !== ''}
												/>
									    </Form.Field>
											<Button basic fluid primary onClick={() => this.props.history.push('/account')} content='Edit Profile Details' style={comStyles().edit_profile} />
										</div>
										<div style={comStyles().student_card}>
											<Form.Field>
												{
													this.state.subletor_student_card
													?
													<Image src={this.state.subletor_student_card} style={comStyles().uploadImagesQueue} />
													:
													<div style={comStyles().dropzone_text}>
														<Icon name='camera' /> &nbsp;
														Edit Profile Details with a Student Card
													</div>
												}
											</Form.Field>
										</div>
									</div>
								</Card>

								<Card raised fluid style={comStyles().card_style}>
									<Card.Header style={comStyles().card_header}>
										Step 2: Room Info
									</Card.Header>
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
									<div style={comStyles().dates}>
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
								      <label>Original Lease Signing Date</label>
											<DatePicker
												selected={this.state.original_lease_signing_date}
												onChange={(d) => this.updateDate(d, 'original_lease_signing_date')}
											/>
								    </Form.Field>
									</div>
									<Form.Field>
										<Checkbox label='I verify that these sublet terms are accurate' onChange={(e, d) => this.updateAttr({ target: { value: d.checked } }, 'auto_sublet_terms_verified')} checked={this.state.auto_sublet_terms_verified} />
									</Form.Field>
								</Card>

								<Card raised fluid style={comStyles().card_style}>
									<Card.Header style={comStyles().card_header}>
										Step 3: Landlord Info
									</Card.Header>
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
								</Card>

								{/*
								<Card raised fluid style={comStyles().card_style}>
									<Card.Header style={comStyles().card_header}>
										Step 4: Contract Witness
									</Card.Header>
							    <Form.Field>
							      <label>Witness Name</label>
							      <input placeholder='Witness Name' onChange={(e) => this.updateAttr(e, 'subletor_witness_full_legal_name')} value={this.state.subletor_witness_full_legal_name} />
							    </Form.Field>
							    <Form.Field>
							      <label>Witness Email</label>
							      <input placeholder='Witness Email' onChange={(e) => this.updateAttr(e, 'subletor_witness_email')} value={this.state.subletor_witness_email} />
							    </Form.Field>
								</Card>*/}

								<Card fluid style={comStyles().card_style}>
									<Form.Field>
										<Checkbox label='I agree to the Terms and Conditions' onChange={(e, d) => this.updateAttr({ target: { value: d.checked } }, 'agree_to_terms')} checked={this.state.agree_to_terms} />
										&nbsp;
										<span onClick={() => this.toggleModal(true, 'terms')} style={comStyles().viewTerms}>View</span>
									</Form.Field>
								</Card>

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
									<div style={comStyles().saving} >
										<div style={comStyles().hidden_loading}>
											<img src='https://s3.amazonaws.com/rentburrow-static-assets/Loading+Icons/loading-blue-clock.gif' width='50px' height='auto' />
										</div>
										<p>Generating Contract...</p>
									</div>
									:
							    <Button primary size='large' type='submit' onClick={() => this.submit()}>Submit</Button>
								}
						  </Form>
						</div>

						<div style={comStyles().tips_contents}>
							<Accordion styled>
								<Accordion.Title active={this.stateactiveIndex === 0}  style={comStyles().why_sign_online_title}>
									Why Sign Contracts Online?
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
				<div style={comStyles().step_contents}>
					<Step.Group style={comStyles().steps}>
						{
							this.steps.map((step) => {
								return (
									<Step key={step.step_number} active={this.checkIfStepActive(step.step_number)} completed={this.checkIfStepComplete(step.step_number)} title={step.title} description={step.description} icon={step.icon} />
								)
							})
						}
					</Step.Group>
				</div>
				{
          this.renderAppropriateModal(this.state.modal_name, this.state.context)
        }
			</div>
		)
	}
}

// defines the types of variables in this.props
SubletorForm.propTypes = {
	history: PropTypes.object.isRequired,
	sublet_post: PropTypes.object.isRequired,		// passed in
	subletee_contract: PropTypes.object.isRequired,	// passed in
	tenant_profile: PropTypes.object.isRequired,
	saveSubletorForm: PropTypes.func.isRequired,	// passed in
}

// for all optional props, define a default value
SubletorForm.defaultProps = {
	tenant_profile: {},
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(SubletorForm)

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
		subletee_subletor_relationship: {

		},
		saving: {
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			justifyContent: 'center'
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
			minWidth: '60vw',
			maxWidth: '60vw',
			height: '100%',
			padding: '20px',
		},
		tips_contents: {
      display: 'flex',
      flexDirection: 'column',
			minWidth: '40vw',
			maxWidth: '40vw',
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
			width: '80%',
		},
		student_card: {
			display: 'flex',
			flexDirection: 'column',
			padding: '20px',
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
		},
		step_contents: {
      display: 'flex',
      flexDirection: 'column',
			minHeight: '10vh',
			maxHeight: '10vh',
		},
		dropzone_text: {
			margin: 'auto',
		},
		card_header: {
			padding: '30px 0px 40px 0px',
			fontWeight: 'bold',
			fontSize: '1.8rem',
		},
		sign_header: {
			width: '100%',
			height: '120px',
			fontSize: '2.5rem',
			fontWeight: 'bold',
			textAlign: 'center',
			backgroundColor: 'rgba(0,0,0,0.1)',
			color: 'black',
			borderRadius: '10px',
		},
		why_sign_online_title: {
			fontSize: '2rem',
			fontWeight: 'bold',
			backgroundColor: xMidBlue,
			color: 'white',
		},
		why_title: {
			fontSize: '1.8rem',
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
		}
	}
}
