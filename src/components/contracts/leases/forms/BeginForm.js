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
	Header,
} from 'semantic-ui-react'
import { xMidBlue } from '../../../../styles/base_colors'
import { insertWitnessToDb, } from '../../../../api/application/lease_application_api'
import BuildingCard from '../../../housing/cards/BuildingCard'

class WitnessForm extends Component {

	constructor() {
		super()
		this.state = {
	    witness_name: '',
			witness_email: '',

			submitted: false,
			error_messages: [],
			activeIndex: 1,

			toggle_modal: false,
      modal_name: '',
      context: {},
			parent_component_saved: true,
	  }

		this.why_sign_online = [
			{ index: 1, icon: 'home', title: 'Your application will go straight to the landlord', description: 'They will review your application and decide if they want to approve you. Your chances of success are high as the only requirement is that you are a student. If the landlord has any additional questions, they will reach out to you by email or phone.' },
			{ index: 2, icon: 'hourglass half', title: 'How long will this take?', description: 'Applying is very fast, approximately 5 minutes. After the landlord approves your application, you will be instructued to sign the final lease. Most of it will already be filled out for you based on the information you enter here. The entire process should not take more than 1 day.' },
			{ index: 3, icon: 'shield', title: 'Is this safe?', description: 'Yes it is safe and secure. Your information is only sent to the landlord for processing and all information is encrypted with SSL in-transit and AES-256bit encryption at rest. Your security is backed by Amazon Web Services.' },
			{ index: 4, icon: 'question', title: 'What if I have questions?', description: 'You can message the landlord directly using our in-app chat. The landlord will receive an email copy and reply back to you as soon as possible, so check your email or in-app chat located on the bottom right hand corner.' },
			{ index: 5, icon: 'group', title: 'Can I apply as a group?', description: 'Yes absolutely. There will be a link you can share with your roommates. When they open the link they will automatically be added to your group. You do not need to wait for them, complete your application now.' },
			{ index: 6, icon: 'money', title: 'How do I pay?', description: 'You will pay through the landlord as you normally would. Depending on the landlord, your payment options are by cheque, debit card, wire transfer, credit card or cash.' },
			{ index: 7, icon: 'user cancel', title: 'Can I cancel an application after submitting?', description: 'You are legally able to back out, but this is very frowned upon. If you are at this step, you should have already made a decision and be ready to sign and pay. Canceling a lease application may get you a bad reputation, so do not back out of an application.' },
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
					<div style={comStyles().contents}>
						<div style={comStyles().form_contents}>
							{/*<BuildingCard
								key={this.props.building.building_id}
								building={this.props.building}
								style={comStyles().gridItem}
							/>

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
							</Form.Field>*/}
							<Card fluid style={comStyles().header_card_style}>
								<Header
									fluid
									as='h2'
									icon='building'
									content='Apply To Live Here'
									subheader={this.props.building.building_address}
								/>
								<div style={comStyles().next_button_div}>
									{
										this.state.submitted
										?
										<div style={comStyles().hidden_loading}>
											<img src='https://s3.amazonaws.com/rentburrow-static-assets/Loading+Icons/loading-blue-clock.gif' width='50px' height='auto' />
										</div>
										:
										<Button
											primary
											fluid
											size='huge'
											content='Begin'
											onClick={() => this.props.goToNextForm(this.state)}
											style={comStyles().begin}
										/>
									}
								</div>
							</Card>

						</div>
						<div style={comStyles().tips_contents}>
							<Accordion fluid styled>
								<Accordion.Title active={this.stateactiveIndex === 0}  style={comStyles().why_sign_online_title}>
									How does this work?
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
WitnessForm.propTypes = {
	history: PropTypes.object.isRequired,
	goToNextForm: PropTypes.func.isRequired,			// passed in
	building: PropTypes.object.isRequired,				// passed in
}

// for all optional props, define a default value
WitnessForm.defaultProps = {
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(WitnessForm)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {

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
			justifyContent: 'center',
			alignItems: 'center',
		},
		viewTerms: {
			color: 'blue',
			cursor: 'pointer',
		},
		contents: {
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			padding: '20px',
		},
		form_contents: {
      display: 'flex',
      flexDirection: 'column',
			minWidth: '600px',
			width: '80vw',
			height: '100%',
			padding: '20px',
		},
		tips_contents: {
      display: 'flex',
      flexDirection: 'column',
			minWidth: '350px',
			width: '80vw',
			padding: '20px 50px 20px 20px',
		},
		card_style: {
			padding: '20px',
			height: '350px',
		},
		header_card_style: {
			padding: '20px',
			display: 'flex',
			flexDirection: 'row',
			position: 'relative',
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
			width: '100%',
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
		},
		begin: {
			margin: '30px auto',
		},
		next_button_div: {
			width: '30%',
			position: 'absolute',
			right: '10px',
			bottom: '0px',
		}
	}
}
