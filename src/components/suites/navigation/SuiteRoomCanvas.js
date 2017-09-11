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


class SuiteRoomCanvas extends Component {

	render() {
		return (
			<div style={comStyles().container}>
				SuiteRoomCanvas
			</div>
		)
	}
}

// defines the types of variables in this.props
SuiteRoomCanvas.propTypes = {
	history: PropTypes.object.isRequired,
	topContextValue: PropTypes.string.isRequired,				// passed in
	bottomContextValue: PropTypes.string.isRequired,		// passed in
  topContextText: PropTypes.string,
  bottomContextText: PropTypes.string,
}

// for all optional props, define a default value
SuiteRoomCanvas.defaultProps = {
  topContext: {},
  bottomContext: {},
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(SuiteRoomCanvas)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
    topContextText: redux.selection.nav_top_context,
    bottomContextText: redux.selection.nav_bottom_context,
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
      width: '80%',
		}
	}
}
