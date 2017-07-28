// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import { selectLocal } from '../../actions/community/community_actions'
import {
	Button,
} from 'semantic-ui-react'


class LocalsView extends Component {

	render() {
		return (
			<div style={comStyles().container}>
				<Button onClick={() => this.props.selectLocal(null)} style={comStyles().backButton}>BACK</Button>
      	<iframe className='_virtualtour' src='https://beta.babylonvr.ca/vr/239939' width='100%' height='1000px'></iframe>
			</div>
		)
	}
}

// defines the types of variables in this.props
LocalsView.propTypes = {
	history: PropTypes.object.isRequired,
	selectLocal: PropTypes.func.isRequired,
}

// for all optional props, define a default value
LocalsView.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(LocalsView)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {

	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
		selectLocal,
	})(RadiumHOC)
)

// ===============================

// the JS function that returns Radium JS styling
const comStyles = () => {
	return {
		container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      width: '100%',
		},
		backButton: {
			position: 'absolute',
			top: '20px',
			left: '20px',
		}
	}
}
