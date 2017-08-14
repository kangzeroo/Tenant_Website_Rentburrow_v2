// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import uuid from 'uuid'
import { withRouter } from 'react-router-dom'
import {

} from 'semantic-ui-react'
import { searchForSpecificBuilding, getSpecificLandlord } from '../../api/search/search_api'
import { selectBuilding, selectCorporation } from '../../actions/selection/selection_actions'
import { selectChatThread } from '../../actions/messaging/messaging_actions'


class BuildingPage extends Component {

	componentWillMount() {
		console.log(this.props.building)
		this.props.selectChatThread([
			{
				message_id: uuid.v4(),
				sender_id: this.props.building.corporation_id,
				receiver_id: 'ME',
				tenant_id: 'ME',
				tenant_name: 'ME',
				staff_id: '',
				building_id: this.props.building.building_id,
				building_thumbnail: this.props.building.thumbnail,
				building_alias: this.props.building.building_name,
				corporation_id: this.props.building.corporation_id,
				corporation_name: this.props.building.corporation_name,
				channel_id: `${this.props.building.corporation_id}_${'ME'}`,
				contents: `Welcome to ${this.props.building.building_address}! Ask me any questions live!`,
			}
		])
		if (!this.props.building) {
			searchForSpecificBuilding(this.props.building.building_id).then((building) => {
				this.props.selectBuilding(building)
				return getSpecificLandlord({ corporation_id: this.props.building.corporation_id })
			}).then((corp) => {
				this.props.selectCorporation(corp)
			})
		} else {
			getSpecificLandlord({ corporation_id: this.props.building.corporation_id }).then((corp) => {
				this.props.selectCorporation(corp)
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
	selectCorporation: PropTypes.func.isRequired,
	selectChatThread: PropTypes.func.isRequired,
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
		selectChatThread,
		selectCorporation,
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
