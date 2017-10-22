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
	Header
} from 'semantic-ui-react'
import { xMidBlue } from '../../../../styles/base_colors'
import { getAvailableSuites } from '../../../../api/building/building_api'
import { saveRankingsToDb, getSuiteRankings, } from '../../../../api/group/group_api'
import SuitePreviewsForSelection from '../support/SuitePreviewsForSelection'

class SuitePreferenceForm extends Component {

	constructor() {
		super()
		this.state = {

			available_suites: [],
			understand_uncertainty: false,

			submitted: false,
			error_messages: [],
			activeIndex: 1,

			error_messages: [],
			toggle_modal: false,
      modal_name: '',
      context: {},
			parent_component_saved: true,
	  }

		this.why_sign_online = [
			{ index: 1, icon: 'cubes', title: 'Someone might have booked the suite already', description: 'When the landlord gets your application, the suite you want may already be taken. By ranking, you can increase your likelihood of getting a suite. The landlord will try to place you in whichever suite is your next priority.' },
			{ index: 2, icon: 'cube', title: 'I only want 1 suite', description: 'Then exclude every other suite. We hope you get the suite you want, but there is no guarantee it is still available!' },
			{ index: 3, icon: 'square outline', title: 'What if no suites are available?', description: 'There is a possibility that no suites are available anymore. The landlord will have no choice but to reject your application, and then you will have to find another building to live at. Don\'t worry though! Rentburrow.com is exactly the tool for that!' },
			{ index: 4, icon: 'cancel', title: 'What if I change my mind?', description: 'If the landlord assigns your group a suite and you change your mind, you will have to cancel the application and re-apply.' },
			{ index: 5, icon: 'thumbs down', title: 'What if I don\'t like the suite when I move in?', description: 'You must stick with your choice. It is too late to change after move-in period.' },
			{ index: 6, icon: 'picture', title: 'What if the suite doesn\'t look like the pictures?', description: 'Rentburrow tries to get pictures of the exact suite and exact room you will be moving into. However, this is not always possible. To ensure accuracy, ask the landlord to confirm that the suite does look like the pictures. By using Rentburrow.com, you accept the potential risks of media inaccuracy and assume all risks and responsibilities upon yourself.' },
			{ index: 7, icon: 'bed', title: 'When can we pick our rooms?', description: 'You can pick your rooms after the landlord approves your application and assigns your group to a suite.' },
		]
		this.terms_and_conditions = 'On behalf of my group, I understand and accept that Rentburrow cannot guarantee that we will get the suite we want. I also understand that Rentburrow does not guarantee that suite and room photos are exact to life and that by using Rentburrow.com I assume all consequences of any media inaccuracies.'
	}

	componentWillMount() {
		const group_id = localStorage.getItem('leasing_group_id')
		getSuiteRankings(group_id)
		.then((data) => {
			if (data.length > 0) {
				this.setState({
					available_suites: data.map((suite) => {
						return {
							suite_id: suite.sample_suite_id,
							suite_style_id: suite.suite_style_id,
							suite_alias: suite.suite_alias,
							rank: suite.ranking,
							cover_photo: suite.cover_photo,
							imgs: suite.imgs,
						}
					})
				})
			} else {
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

	saveRankings() {
		this.setState({
			submitted: true,
		})
		if (this.validationCheck()) {
			const arrayOfPromises = this.state.available_suites.map((suite) => {
				return saveRankingsToDb({
					group_id: this.props.group_id,
					sample_suite_id: suite.suite_id,
					suite_style_id: suite.suite_style_id,
					suite_alias: suite.suite_alias,
					ranking: suite.rank,
					cover_photo: suite.cover_photo,
					imgs: suite.imgs,
				})
			})
			Promise.all(arrayOfPromises).then((res, rej) => {
				this.setState({
					error_messages: [],
				})
				this.props.goToNextForm(this.state)
			})
		}
	}

	validationCheck() {
		let ok_to_proceed = true
		const error_messages = []

		let at_least_one_suite = false
		this.state.available_suites.forEach((suite) => {
			if (suite.rank > 0) {
				at_least_one_suite = true
			}
		})

		if (!at_least_one_suite) {
			ok_to_proceed = false
			error_messages.push('You must select at least one suite style')
		}

		if (!this.state.understand_uncertainty) {
			ok_to_proceed = false
			error_messages.push('You must understand the uncertainty before proceeding')
		}

		this.setState({
			error_messages: error_messages,
			submitted: false,
		})
		return ok_to_proceed
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
							<Form style={comStyles().form}>

								{/*<Card raised fluid style={comStyles().transparent_card}>*/}
									<Card raised fluid style={comStyles().card_style}>
										<Header
											as='h1'
											icon='star'
											content='Suite Preferences'
											subheader='Rank your preferred suites'
										/>
									</Card>
									{
										this.state.available_suites.length > 0
										?
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
										:
										<div style={comStyles().hidden_loading}>
											<img src='https://s3.amazonaws.com/rentburrow-static-assets/Loading+Icons/loading-blue-clock.gif' width='50px' height='auto' />
										</div>
									}
								{/*</Card>*/}

								<Card fluid style={comStyles().card_style}>
									<Form.Field>
										<Checkbox
											label='I understand the conditions on these suites'
											onChange={(e, d) => this.updateAttr({ target: { value: d.checked } }, 'understand_uncertainty')}
											checked={this.state.understand_uncertainty}
										/>
										&nbsp; &nbsp; &nbsp;
										<span onClick={() => this.toggleModal(true, 'terms')} style={comStyles().viewTerms}>View</span>
									</Form.Field>
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
											onClick={() => this.saveRankings()}
										/>
									}
								</Card>

							</Form>
						</div>
						<div style={comStyles().tips_contents}>
							<Accordion styled>
								<Accordion.Title active={this.stateactiveIndex === 0}  style={comStyles().why_sign_online_title}>
									Why are we ranking suites?
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
	group_id: PropTypes.string.isRequired, 				// passed in
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
		transparent_card: {
			padding: '20px',
			height: 'auto',
			backgroundColor: 'rgba(256, 256, 256, 0)',
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
			minHeight: '90vh',
			height: '100%',
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
