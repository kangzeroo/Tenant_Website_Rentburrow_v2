// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
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
} from 'semantic-ui-react'
import { xMidBlue } from '../../../../styles/base_colors'

class GuarantorForm extends Component {

	constructor() {
		super()
		this.state = {
	    first_name: '',

			submitted: false,
			error_messages: [],
			activeIndex: 1,

			toggle_modal: false,
      modal_name: '',
      context: {},
	  }

		this.why_sign_online = [
			{ index: 1, icon: 'protect', title: 'It\'s Safer', description: 'By signing online, both parties get a digital receipt of the contract. This eliminates the possibilty of fraud or an invalid sublet contract. All sublet contracts signed with our software is legally binding. We require all users to sign in with Facebook so that you can talk directly with them and see that they are a real person. We also require you to upload your student card so that both parties know that they are renting with students and not outsiders. You must be 18 or older to sign a contract.' },
			{ index: 2, icon: 'lightning', title: 'It\'s Simple and Fast', description: 'The traditional method requires a printer or PDF software, but online signing only requires a web browser. If you wanted, you could print out a contract to sign in person or send it as an email PDF to be signed with random software, but how tedious is that? Rentburrow allows you to complete the entire process online within minutes - way easier than the old way.' },
			{ index: 3, icon: 'question circle', title: 'How does it work?', description: 'Good question. First message the person subletting on Facebook to work out the details such as price and the sublet start/end date. When you two have reached an agreement, you must fill out the form on the left and click submit. After submitting, you will get a URL link that you must send to the other person. They will open the link and fill out another form that will verify the sublet details. They will also provide the landlords contact info for you. When they submit their form, everyone including witnesses will get an email where you can sign the sublet contract online. Be sure to read over the sublet contract one last time before signing! Once signed, the contract is complete and you will arrange a time to meet the other person to exchange keys and payment.' },
			{ index: 4, icon: 'dollar', title: 'Is there any cost?', description: 'Nope, its completely free :)' },
			{ index: 5, icon: 'eye', title: 'Why do I need a witness?', description: 'Most contracts require a contract as backup proof that the contract was indeed signed by the stated parties. Don\'t worry, witnesses can be anyone who saw you sign the contract. So you can put your roommate, friend or a parent/guardian. They will get an email and be able to sign from within the email without any extra hassle.' },
			{ index: 6, icon: 'user', title: 'Why do I need to upload my student card?', description: 'For safety purposes. Because you are renting student housing, we require that you be a student. You do not necessarily need to be a student of the University of Waterloo or Wilfrid Laurier University, as long as you are a student. The other person will be able to see your student card, and you will be able to see theirs. That way, everyone feels safe. We keep all sensitive information secure and encrypted on bank level AES-256 bit encryption.' },
			{ index: 7, icon: 'privacy', title: 'How do I pay rent and get my keys?', description: 'You will still need to meet up in person to exchange keys and payment. It is up to you to determine how you will pay the other person. Please remember that when you pay for a sublet, you are paying the current tenant who will in turn pay the landlord.' },
			{ index: 8, icon: 'user cancel', title: 'What if the other person backs out?', description: 'First of all, check with the person to see if the sublet is still available. You can simply message them on Facebook. If the other person agreed to sublet to you but later gave it to someone else, then legally the first person who signed a sublet contract has rights to the room. If the other person does not sublet at all, you will have to work things out with them by yourself. Rentburrow cannot enforce a sublet contract for you, so be sure that the other person has integrity to uphold the contract. In the rare event that the other person does not pay rent to the original landlord, you must go directly to the landlord and explain to them the situation.' },
			{ index: 9, icon: 'legal', title: 'What are the terms and conditions?', description: this.terms_and_conditions },
			{ index: 10, icon: 'heart', title: 'This is awesome, how can I show some love?', description: 'We\'re glad you like this! Rentburrow is made with love by a group of students from the University of Waterloo and Wilfrid Laurier University. We welcome any and all feedback! Message or like us on Facebook at https://www.facebook.com/rentburrow/' },
		]
		this.terms_and_conditions = 'We keep the terms and conditions very simple. Rentburrow provides you the means to sign a sublet contract online but we do not guarantee that the sublet contract is legally valid in every situation. We also do not guarantee that signing a sublet contract via Rentburrow will guarantee that you actually get the sublet - that is up to you and the other person. By using this service, you agree to take all responsibility for this sublet contract. You also release Rentburrow (and its parent company Bytenectar Inc) from all legal responsibility related to this sublet contract.'
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

	render() {
		return (
			<div style={comStyles().container}>
				<div style={comStyles().main_contents}>
					<div style={comStyles().sign_header}>Guarantors</div>
					<div style={comStyles().contents}>
						<div style={comStyles().form_contents}>
							<Form style={comStyles().form}>

								<Card raised fluid style={comStyles().card_style}>
									<Card.Header style={comStyles().card_header}>
										Step 1: Subletee Profile
									</Card.Header>
									<div style={comStyles().student_div}>
										<div style={comStyles().student_form}>
											<Form.Field>
												<label>Legal First Name</label>
												<input
													placeholder='First Name'
													onChange={(e) => this.updateAttr(e, 'first_name')}
													value={this.state.first_name}
													disabled={this.props.tenant_profile.first_name !== ''}
												/>
											</Form.Field>
										</div>
										<div style={comStyles().student_card}>
											<Button basic fluid primary onClick={() => this.props.history.push('/account')} content='Edit Profile Details' style={comStyles().edit_profile} />
										</div>
									</div>
								</Card>

								<Card fluid style={comStyles().card_style}>
									<Form.Field>
										<Checkbox label='I agree to the Terms and Conditions' onChange={(e, d) => this.updateAttr({ target: { value: d.checked } }, 'agree_to_terms')} checked={this.state.agree_to_terms} />
										&nbsp; &nbsp; &nbsp;
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
									<div style={comStyles().hidden_loading}>
										<img src='https://s3.amazonaws.com/rentburrow-static-assets/Loading+Icons/loading-blue-clock.gif' width='50px' height='auto' />
									</div>
									:
									<Button type='submit' primary size='large' onClick={() => this.submit()}>Submit</Button>
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
		}
	}
}
