// Compt for copying as a JoinPageLandlord
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
	Header,
	Card,
	Form,
} from 'semantic-ui-react'
import LandlordSignupForm from './forms/LandlordSignupForm'


class JoinPageLandlord extends Component {

	render() {
		return (
			<div id='JoinPageLandlord' style={comStyles().container}>
				<Header
					as='h1'
					icon='home'
					content='Join the Rentburrow Network'
					subheader='See Why So Many Landlords Have Benefited'
				/>
				<LandlordSignupForm />
			</div>
		)
	}
}

// defines the types of variables in this.props
JoinPageLandlord.propTypes = {
	history: PropTypes.object.isRequired,
}

// for all optional props, define a default value
JoinPageLandlord.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(JoinPageLandlord)

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
			justifyContent: 'center',
			alignItems: 'center',
			padding: '50px',
			width: '100%',
		}
	}
}
