// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {

} from 'semantic-ui-react'
import Header from './components/MobileHeader'
import MobileBuildingsList from './components/buildings/MobileBuildingsList'

class MobilePage extends Component {

	render() {
		return (
			<div id='MobilePage' style={comStyles().container}>
        <MobileBuildingsList

        />
			</div>
		)
	}
}

// defines the types of variables in this.props
MobilePage.propTypes = {
	history: PropTypes.object.isRequired,
}

// for all optional props, define a default value
MobilePage.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(MobilePage)

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
      width: '100vw'
		}
	}
}
