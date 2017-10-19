// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
	Card,
} from 'semantic-ui-react'


class BeginForm extends Component {

	render() {
		return (
			<div style={comStyles().container}>
				<Card style={comStyles().card_style}>
					BeginForm
				</Card>
			</div>
		)
	}
}

// defines the types of variables in this.props
BeginForm.propTypes = {
	history: PropTypes.object.isRequired,
	goToNextForm: PropTypes.func.isRequired,			// passed in
}

// for all optional props, define a default value
BeginForm.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(BeginForm)

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
			width: '100%',
			height: '100%',
		},
		card_style: {
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
		}
	}
}
