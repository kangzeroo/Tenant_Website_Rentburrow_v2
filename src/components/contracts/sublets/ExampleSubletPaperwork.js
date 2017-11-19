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


class ExampleSubletPaperwork extends Component {

	render() {
		return (
			<div id='ExampleSubletPaperwork' style={comStyles().container}>
				<embed src='https://s3.amazonaws.com/sublet-agreement/Bytenectar+Sublet+Agreement.pdf' width='100%' height='100%' />
			</div>
		)
	}
}

// defines the types of variables in this.props
ExampleSubletPaperwork.propTypes = {
	history: PropTypes.object.isRequired,
}

// for all optional props, define a default value
ExampleSubletPaperwork.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(ExampleSubletPaperwork)

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
			width: '100vw',
			height: '93vh',
		}
	}
}
