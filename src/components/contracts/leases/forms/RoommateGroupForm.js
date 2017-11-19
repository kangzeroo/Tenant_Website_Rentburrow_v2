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
	Input,
} from 'semantic-ui-react'
import { xMidBlue } from '../../../../styles/base_colors'
import { getGroupInfo, saveGroupNameToDb } from '../../../../api/group/group_api'
import GroupMembers from '../group/GroupMembers'

class RoommateGroupForm extends Component {

	constructor() {
		super()
		this.state = {
			group_id: '',
			group_name: '',
			new_group_name: '',
	    first_name: '',
			expected_group_size: 1,

			submitted: false,
			error_messages: [],
			activeIndex: 1,

			toggle_modal: false,
      modal_name: '',
      context: {},

			edit: false,
			parent_component_saved: true,
	  }

		this.why_sign_online = [
			{ index: 1, icon: 'users', title: 'Share the link', description: 'When your roommates open the link, they will automatically be added to your group. Each roommate must submit their own lease application, and the landlord will recieve all of them together. The original person who send this link is the leader and all roommates are that persons group. If you start a new application without the group link, then you are creating a seperate application altogether with your own seperate group. Make sure you only have 1 leader for each group of roommates.' },
			{ index: 2, icon: 'user', title: 'I have no roommates', description: 'If you do not want or have roommates, then simply click next without sharing the link.' },
			{ index: 3, icon: 'exclamation triangle', title: 'How many roommates max?', description: 'You can have as many roommates as you want, but the building you are applying to may not necessarily have enough bedrooms in one suite to hold you all. Later when you reach the Notes To The Landlord form, you can request that the landlord put all your friends in suites near eachother.' },
			{ index: 4, icon: 'remove user', title: 'Removing roommates', description: 'To remove a user, go to your account at the top-right hand corner of the screen and from the dropdown menu, select Roommates. You can manage your roommates from there. Note that only the group leader can remove roommates.' },
		]
	}

	componentWillMount() {
		getGroupInfo(this.props.group_id)
		.then((data) => {
			if (data.group_name !== null) {
				this.setState({
					group_id: this.props.group_id,
					group_name: data.group_name,
				})
			} else {
				this.setState({
					group_name: 'Group Name'
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

	saveGroupName(new_group_name) {
		saveGroupNameToDb(this.props.group_id, new_group_name)
		this.setState({
			group_name: new_group_name,
			new_group_name: '',
			edit: false,
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
			<div id='RoommateGroupForm' style={comStyles().container}>
				<div style={comStyles().main_contents}>
					<div style={comStyles().contents}>
						<div style={comStyles().form_contents}>
							<Form style={comStyles().form}>
								{
									this.state.edit
									?
									<Card fluid style={comStyles().row_card_style} >
										<Input
											placeholder='Enter A Group Name'
											value={this.state.new_group_name}
											onChange={(e) => this.updateAttr(e, 'new_group_name')}
											width='70%'
										/>
										<div style={comStyles().buttons_container} >
											<Button
												primary
												basic
												content='Cancel'
												onClick={() => this.setState({ edit: false, new_group_name: '' })}
											/>
											<Button
												primary
												content='Save'
												onClick={() => this.saveGroupName(this.state.new_group_name)}
											/>
										</div>
									</Card>
									:
									<Card fluid style={comStyles().row_card_style}>
										<Header
											as='h1'
											content={this.state.group_name}
											subheader='Add roommates to your group'
											icon='add user'
											width='300px'
										/>
										<div style={comStyles().expected_group_size}>
											<label>Group Size</label>
											<Input
												primary
												type='number'
												value={this.state.expected_group_size}
												onChange={(e) => this.setState({ expected_group_size: e.target.value, })}
												style={comStyles().group_size}
											/>
										</div>
										<Button
											primary
											basic
											content='Edit Group Name'
											onClick={() => this.setState({ edit: true, })}
											style={comStyles().edit_group_name}
										/>
									</Card>
								}
								<Card raised fluid style={comStyles().card_style}>
									<Card.Header style={comStyles().card_header}>
										Share this link with your roommates
										<div style={comStyles().keep_going}>You do not need to wait for them, click next to continue</div>
									</Card.Header>
									<div style={comStyles().student_div}>
										<div style={comStyles().share_link}>
											{ `${window.location.origin}${window.location.pathname}?group=${this.props.group_id}` }
										</div>
									</div>
									<div style={comStyles().next_button}>
										{
											this.state.submitted
											?
											<div style={comStyles().hidden_loading}>
												<img src='https://s3.amazonaws.com/rentburrow-static-assets/Loading+Icons/loading-blue-clock.gif' width='50px' height='auto' />
											</div>
											:
											<Button fluid type='submit' primary size='large' onClick={() => this.props.goToNextForm(this.state)}>Next</Button>
										}
									</div>
								</Card>
								<GroupMembers
									group_id={this.props.group_id}
								/>
							</Form>
						</div>
						<div style={comStyles().tips_contents}>
							<Accordion styled>
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
RoommateGroupForm.propTypes = {
	history: PropTypes.object.isRequired,
	tenant_profile: PropTypes.object.isRequired,
	group_id: PropTypes.string.isRequired,				// passed in
	goToNextForm: PropTypes.func.isRequired,			// passed in
}

// for all optional props, define a default value
RoommateGroupForm.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(RoommateGroupForm)

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
		header_container: {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'space-between'
		},
		buttons_container: {
			position: 'absolute',
			right: '20px',
		},
		form: {
      display: 'flex',
      flexDirection: 'column',
			margin: '10px',
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
			width: '50vw',
			height: '100%',
			padding: '20px',
		},
		tips_contents: {
      display: 'flex',
      flexDirection: 'column',
			minWidth: '350px',
			width: '35vw',
			padding: '20px',
		},
		card_style: {
			padding: '20px',
			height: '350px',
		},
		row_card_style: {
			display: 'flex',
			flexDirection: 'row',
			width: '100%',
			padding: '20px',
			justifyContent: 'space-between',
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
			margin: '0px 0px 20px 0px',
			height: '400px',
			justifyContent: 'center',
			alignItems: 'center',
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
			fontSize: '2rem',
			lineHeight: '30px',
		},
		keep_going: {
			// fontWeight: 'bold',
			fontSize: '1.2rem',
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
		share_link: {
			fontSize: '1.2rem',
			fontWeight: 'bold',
			padding: '30px',
		},
		next_button: {
			margin: '20px',
		},
		edit_group_name: {
			width: '100px',
			position: 'absolute',
			right: '20px',
		},
		expected_group_size: {
			display: 'flex',
			flexDirection: 'column',
			width: '100px',
			fontWeight: 'bold',
		}
	}
}
