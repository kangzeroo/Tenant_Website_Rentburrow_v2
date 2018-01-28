// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
// import {
//
// } from 'antd-mobile'
import TermsOfUseCard from './TermsOfUseCard'


class TermsOfUsePage extends Component {

	render() {
		return (
			<div id='TermsOfUsePage' style={comStyles().container}>
				<TermsOfUseCard />
			</div>
		)
	}
}

// defines the types of variables in this.props
TermsOfUsePage.propTypes = {
	history: PropTypes.object.isRequired,
}

// for all optional props, define a default value
TermsOfUsePage.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(TermsOfUsePage)

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
      background: 'linear-gradient(269deg, #0bacbd, #1a76c1)',
      backgroundSize: 'cover',
      maxHeight: '100vh',
      padding: '30px',
      overflowY: 'scroll',
		}
	}
}
