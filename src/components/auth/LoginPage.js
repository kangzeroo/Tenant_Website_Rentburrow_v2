// Compt for copying as a LoginPage
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
	Header,
} from 'semantic-ui-react'
import Login from './Login'


class LoginPage extends Component {

	render() {
		return (
			<div id='LoginPage' style={comStyles().container}>
				<Header as='h2' content='Login to RentHero' />
				<Login />
			</div>
		)
	}
}

// defines the types of variables in this.props
LoginPage.propTypes = {
	history: PropTypes.object.isRequired,
}

// for all optional props, define a default value
LoginPage.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(LoginPage)

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
      height: '80vh',
      justifyContent: 'center',
      alignItems: 'center',
			padding: '50px',
		}
	}
}
