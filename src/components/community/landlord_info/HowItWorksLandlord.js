// Compt for copying as a HowItWorksLandlord
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
	Step,
	Icon,
	Button,
} from 'semantic-ui-react'


class HowItWorksLandlord extends Component {

	constructor() {
		super()
		this.state = {
			current_step: 'benefits',
		}
		this.steps = [
			{ key: 'benefits', icon: 'cubes', title: 'Benefits', desc: 'Fill up rooms faster' },
			{ key: 'filming', icon: 'camera', title: 'Filming', desc: 'We will your place look beautiful' },
			{ key: 'relax', icon: 'home', title: 'Sit Back and Relax', desc: 'We will bring students to you' },
			{ key: 'paperwork', icon: 'mail', title: 'Complete Leases', desc: 'Collect your money and contract' },
		]
	}

	renderStep(current_step) {
		if (current_step === 'benefits') {
			return (
				<div>BENEFITS</div>
			)
		} else if (current_step === 'filming') {
			return (
				<div>FILMING</div>
			)
		} else if (current_step === 'relax') {
			return (
				<div>RELAX</div>
			)
		} else if (current_step === 'paperwork') {
			return (
				<div>PAPERWORK</div>
			)
		} else if (current_step === 'done') {
			return (
				<div>DONE</div>
			)
		}
	}

	isActive(key) {
		if (key === this.state.current_step) {
			return true
		} else {
			return false
		}
	}

	isCompleted(key) {
		let completedObj = {
			benefits: false,
			filming: false,
			relax: false,
			paperwork: false,
		}
		if (key === 'benefits') {
			completedObj.benefits = false
			completedObj.filming = false
			completedObj.relax = false
			completedObj.paperwork = false
		} else if (key === 'filming') {
			completedObj.benefits = true
			completedObj.filming = false
			completedObj.relax = false
			completedObj.paperwork = false
		} else if (key === 'relax') {
			completedObj.benefits = true
			completedObj.filming = true
			completedObj.relax = false
			completedObj.paperwork = false
		} else if (key === 'paperwork') {
			completedObj.benefits = true
			completedObj.filming = true
			completedObj.relax = true
			completedObj.paperwork = false
		} else if (key === 'done') {
			completedObj.benefits = true
			completedObj.filming = true
			completedObj.relax = true
			completedObj.paperwork = true
		}
		return completedObj
	}

	goToNextStep(currentStep) {
		let next_step = 'benefits'
		if (currentStep === 'benefits') {
			next_step = 'filming'
		} else if (currentStep === 'filming') {
			next_step = 'relax'
		} else if (currentStep === 'relax') {
			next_step = 'paperwork'
		} else if (currentStep === 'paperwork') {
			next_step = 'done'
		}
		this.setState({
			current_step: next_step
		})
	}

	render() {
		return (
			<div style={comStyles().container}>
				<Step.Group>
					{
						this.steps.map((step, i) => {
							return (
								<Step key={step.key} active={this.isActive(step.key)} onClick={() => this.setState({ current_step: this.steps[i].key })} completed={this.isCompleted(this.state.current_step)[step.key]}>
									<Icon name={step.icon} />
									<Step.Content>
										<Step.Title>{step.title}</Step.Title>
										<Step.Description>{step.desc}</Step.Description>
									</Step.Content>
								</Step>
							)
						})
					}
				</Step.Group>

				<div style={comStyles().next}>
					{
						this.state.current_step === 'done'
						?
						<Button content='Start Today' onClick={() => this.props.history.push('/join-landlord')} primary fluid />
						:
						<Button content='Next' onClick={() => this.goToNextStep(this.state.current_step)} positive fluid />
					}
				</div>

				<div style={comStyles().content}>
					{
						this.renderStep(this.state.current_step)
					}
				</div>
			</div>
		)
	}
}

// defines the types of variables in this.props
HowItWorksLandlord.propTypes = {
	history: PropTypes.object.isRequired,
}

// for all optional props, define a default value
HowItWorksLandlord.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(HowItWorksLandlord)

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
			padding: '50px',
		},
		content: {
			minHeight: '500px',
			width: '100%',
			padding: '20px',
		},
		next: {
			height: '20%',
			width: '100%',
		}
	}
}
