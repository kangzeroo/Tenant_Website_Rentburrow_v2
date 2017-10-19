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
import { getAvailableSuites } from '../../../../api/building/building_api'
import SuitePreviewsForSelection from '../support/SuitePreviewsForSelection'

class SuitePreferenceForm extends Component {

	constructor() {
		super()
		this.state = {
	    first_name: '',

			available_suites: [],
			understand_uncertainty: false,

			submitted: false,
			error_messages: [],
			activeIndex: 1,

			toggle_modal: false,
      modal_name: '',
      context: {},
	  }

		this.why_sign_online = [
			{ index: 1, icon: 'protect', title: 'It\'s Safer', description: 'By signing online, both parties get a digital receipt of the contract. This eliminates the possibilty of fraud or an invalid sublet contract. All sublet contracts signed with our software is legally binding. We require all users to sign in with Facebook so that you can talk directly with them and see that they are a real person. We also require you to upload your student card so that both parties know that they are renting with students and not outsiders. You must be 18 or older to sign a contract.' },
		]
	}

	componentWillMount() {
		getAvailableSuites({
			building_id: this.props.building.building_id,
		}).then((data) => {
			this.setState({
				available_suites: data.map((suite, index) => {
					return {
						...suite,
						rank: index + 1,
					}
				}),
			})
		})
	}

	updateSuiteRanking(suite_id, amount) {
		let prechange_rank = 0
		let total = 0
		this.state.available_suites.forEach((suite, index) => {
			if (suite.suite_id === suite_id) {
				prechange_rank = suite.rank
			}
			if (suite.rank !== 0) {
				total++
			}
		})
		if (prechange_rank + amount > 0 && prechange_rank + amount <= total) {
			this.setState({
				available_suites: this.state.available_suites.map((suite) => {
					if (suite.suite_id === suite_id) {
						return {
							...suite,
							rank: suite.rank + amount,
						}
					} else if (suite.rank === 0) {
						return suite
					} else if (suite.rank - amount === prechange_rank) {
						return {
							...suite,
							rank: prechange_rank
						}
					} else {
						return suite
					}
				})
			})
		}
	}

	toggleSuiteInclusion(suite_id, bool) {
		// if we are including a suite, we add it to the back of the list
		if (bool) {
			// first get the total of non-zero ranks
			let total = 0
			this.state.available_suites.forEach((suite, index) => {
				if (suite.rank !== 0) {
					total++
				}
			})
			// and set the selected suite to have a rank equal to total + 1
			this.setState({
				available_suites: this.state.available_suites.map((suite) => {
					if (suite.suite_id === suite_id) {
						return {
							...suite,
							rank: total + 1,
						}
					} else {
						return suite
					}
				})
			})
		} else {
			// if we are excluding a suite, we set the rank to zero, and for all suites with a higher rank we decrement by 1
			let prechange_rank = 9999999
			this.setState({
				available_suites: this.state.available_suites.map((suite) => {
					if (suite.suite_id === suite_id) {
						prechange_rank = suite.rank
						return {
							...suite,
							rank: 0,
						}
					} else if (suite.rank > prechange_rank) {
						return {
							...suite,
							rank: suite.rank - 1
						}
					} else {
						return suite
					}
				})
			})
		}
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
					<div style={comStyles().sign_header}>Suite & Room Preferences</div>
					<div style={comStyles().contents}>
						<div style={comStyles().form_contents}>
							<Form style={comStyles().form}>

								<Card raised fluid style={comStyles().card_style}>
									<Card.Header style={comStyles().card_header}>
										Rank Your Suite Preferences
									</Card.Header>
									<div style={comStyles().student_div}>
										{
											this.state.available_suites.sort((suiteA, suiteB) => {
												return suiteA.rank - suiteB.rank
											}).filter((suite) => {
												return suite.rank
											}).concat(
												this.state.available_suites.filter((suite) => {
													return !suite.rank
												})
											).map((suite) => {
												return (
													<SuitePreviewsForSelection
														key={suite.suite_id}
														building={this.props.building}
														suite={suite}
														updateSuiteRanking={(suite_id, amount) => this.updateSuiteRanking(suite_id, amount)}
														toggleSuiteInclusion={(suite_id, bool) => this.toggleSuiteInclusion(suite_id, bool)}
													/>
												)
											})
										}
									</div>
								</Card>

								<Card fluid style={comStyles().card_style}>
									<Form.Field>
										<Checkbox label='I understand that my group may not necessarily get the suite we want but the landlord will try their best to accomodate' onChange={(e, d) => this.updateAttr({ target: { value: d.checked } }, 'understand_uncertainty')} checked={this.state.understand_uncertainty} />
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
									<Button type='submit' primary size='large' onClick={() => this.props.goToNextForm()}>Next</Button>
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
SuitePreferenceForm.propTypes = {
	history: PropTypes.object.isRequired,
	tenant_profile: PropTypes.object.isRequired,
	goToNextForm: PropTypes.func.isRequired,			// passed in
	building: PropTypes.object.isRequired,				// passed in
}

// for all optional props, define a default value
SuitePreferenceForm.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(SuitePreferenceForm)

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
			flexDirection: 'column',
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
		},
	}
}
