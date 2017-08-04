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
import { searchForSpecificBuilding } from '../../api/search/search_api'
import { selectBuilding } from '../../actions/selection/selection_actions'


class BuildingPage extends Component {

	componentWillMount() {
		console.log(this.props.building)
		if (!this.props.building) {
			searchForSpecificBuilding(this.props.building.building_id).then((building) => {
				this.props.selectBuilding(building)
			})
		}
	}

	render() {
		return (
			<div style={comStyles().container}>
				BuildingPage
				<h2>{ this.props.building.building_address }</h2>
			</div>
		)
	}
}

// defines the types of variables in this.props
BuildingPage.propTypes = {
	history: PropTypes.object.isRequired,
	building: PropTypes.object.isRequired,
	selectBuilding: PropTypes.func.isRequired,
}

// for all optional props, define a default value
BuildingPage.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(BuildingPage)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
		building: redux.selection.selected_building,
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
		selectBuilding,
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
