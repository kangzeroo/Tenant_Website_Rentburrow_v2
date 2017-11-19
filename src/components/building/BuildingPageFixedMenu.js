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


class BuildingPageFixedMenu extends Component {

	render() {
		return (
			<div id='BuildingPageFixedMenu' style={comStyles(this.props.positionStyle).container}>
				<Button
					onClick={() => this.props.goToSection('description')}
					content='Description'
				/>
				<Button
					onClick={() => this.props.goToSection('amenities')}
					content='Amenities'
				/>
				<Button
					onClick={() => this.props.goToSection('rooms')}
					content='Rooms'
				/>
				<Button
					onClick={() => this.props.goToSection('location')}
					content='Location'
				/>
			</div>
		)
	}
}

// defines the types of variables in this.props
BuildingPageFixedMenu.propTypes = {
	history: PropTypes.object.isRequired,
	goToSection: PropTypes.func.isRequired,	// passed in
	positionStyle: PropTypes.string.isRequired,	// passed in
}

// for all optional props, define a default value
BuildingPageFixedMenu.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(BuildingPageFixedMenu)

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
const comStyles = (positionStyle) => {
	return {
		container: {
      display: 'flex',
      flexDirection: 'row',
			width: '100%',
			position: positionStyle,
			backgroundColor: 'gray',
		}
	}
}
