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
import {
	submitApplicationToDb,
} from '../../../../api/application/lease_application_api'

class SubmitLeaseApplication extends Component {

	constructor() {
		super()
		this.state = {
			agree_to_terms: false,

			submitted: false,
			error_messages: [],
			activeIndex: 1,

			toggle_modal: false,
      modal_name: '',
      context: {},
			parent_component_saved: true,
	  }

		this.why_sign_online = [
			{ index: 1, icon: 'protect', title: 'It\'s Safer', description: 'By signing online, both parties get a digital receipt of the contract. This eliminates the possibilty of fraud or an invalid sublet contract. All sublet contracts signed with our software is legally binding. We require all users to sign in with Facebook so that you can talk directly with them and see that they are a real person. We also require you to upload your student card so that both parties know that they are renting with students and not outsiders. You must be 18 or older to sign a contract.' },
		]
		this.terms_and_conditions = 'Terms and conditions are...'
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

	submitApplication() {
		if (this.state.agree_to_terms) {
			submitApplicationToDb(this.props.my_application_id)
			.then(() => {
				this.setState({
					submitted: true,
					error_messages: [],
				})
				// this.props.history.push('/applications')
				this.props.sendSummaryEmail()
			})
		} else {
			this.setState({
				error_messages: ['You must agree to the terms and conditions before you can submit this application.']
			})
		}
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
							<Form style={comStyles().form}>

								<Accordion fluid styled>
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

								<Card fluid style={comStyles().card_style}>
									<Form.Field>
										<Checkbox label='I agree to the Terms and Conditions' onChange={(e, d) => this.updateAttr({ target: { value: d.checked } }, 'agree_to_terms')} checked={this.state.agree_to_terms} />
										&nbsp; &nbsp; &nbsp;
										<span onClick={() => this.toggleModal(true, 'terms')} style={comStyles().viewTerms}>View</span>
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
												Submitted Application.
											</div>
											:
											<Button
												primary
												size='large'
												content='Submit Application'
												onClick={() => this.submitApplication()}
											/>
									}
								</Card>

							</Form>
						</div>
						<div style={comStyles().tips_contents}>

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
SubmitLeaseApplication.propTypes = {
	history: PropTypes.object.isRequired,
	tenant_profile: PropTypes.object.isRequired,
	my_application_id: PropTypes.string.isRequired,
	sendSummaryEmail: PropTypes.func.isRequired,			// passed in
}

// for all optional props, define a default value
SubmitLeaseApplication.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(SubmitLeaseApplication)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
		tenant_profile: redux.auth.tenant_profile,
		my_application_id: redux.group.my_application_id,
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
			width: '80vw',
			height: '100%',
			padding: '20px',
		},
		tips_contents: {
      display: 'flex',
      flexDirection: 'column',
			minWidth: '0px',
			width: '0vw',
			padding: '0px',
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
