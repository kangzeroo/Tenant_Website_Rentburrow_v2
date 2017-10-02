// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
	Button,
} from 'semantic-ui-react'
import { collectIntel } from '../../actions/intel/intel_actions'


class Feature extends Component {

	track() {
		console.log('tracking...')
		this.props.collectIntel({ tableName: 'TEST', item: new Date() })
	}

	render() {
		return (
			<div style={comStyles().container}>
				FEATURE X Y Z
				<Button onClick={() => this.track()} content='track this click' />
			</div>
		)
	}
}

// defines the types of variables in this.props
Feature.propTypes = {
	history: PropTypes.object.isRequired,
	collectIntel: PropTypes.func.isRequired,
}

// for all optional props, define a default value
Feature.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(Feature)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {

	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
		collectIntel,
	})(RadiumHOC)
)

// ===============================

// the JS function that returns Radium JS styling
const comStyles = () => {
	return {
		container: {
      display: 'flex',
      flexDirection: 'column',
		}
	}
}
