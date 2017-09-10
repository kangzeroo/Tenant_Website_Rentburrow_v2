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
	Image,
} from 'semantic-ui-react'
import { searchForSpecificBuildingByAlias, getSpecificLandlord } from '../../api/search/search_api'
import { URLToAlias, renderProcessedImage, } from '../../api/general/general_api'
import { selectBuilding, selectCorporation } from '../../actions/selection/selection_actions'
import { selectChatThread } from '../../actions/messaging/messaging_actions'


class BuildingPage extends Component {
	constructor() {
		super()
		this.state = {
			building: {}
		}
	}

	componentWillMount() {
		/*
		console.log(this.props.building)
		this.props.selectChatThread([
			{
				message_id: uuid.v4(),
				sender_id: this.props.building.corporation_id,
				receiver_id: this.props.tenant.id,
				tenant_id: this.props.tenant.id,
				tenant_name: this.props.tenant.name,
				staff_id: '',
				building_id: this.props.building.building_id,
				building_thumbnail: this.props.building.thumbnail,
				building_alias: this.props.building.building_name,
				corporation_id: this.props.building.corporation_id,
				corporation_name: this.props.building.corporation_name,
				channel_id: `${this.props.building.corporation_id}_${this.props.tenant.id}`,
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
		} */
    let building_alias = URLToAlias(this.props.location.pathname)
    if (building_alias[building_alias.length - 1] === '/') {
      building_alias = building_alias.slice(0, -1)
    }
		searchForSpecificBuildingByAlias(building_alias)
		.then((data) => {
			this.setState({
				building: data
			})
		})
	}

	createMarkup(string) {
		return {
			__html: string,
		}
	}

	render() {
		return (
			<div style={comStyles().container}>
				<div style={comStyles().cover_photo} >
					<Image
						src={renderProcessedImage(this.state.building.cover_photo)}
						fluid
					/>
				</div>
				<div style={comStyles().building_conatiner}>
					<h1>{ this.state.building.building_alias }</h1>
					<h2>{ this.state.building.building_address }</h2>
					<div style={comStyles().about}>About This Building</div>
					<div
						dangerouslySetInnerHTML={this.createMarkup(this.state.building.building_desc)}
						style={comStyles().textMarkup}
					/>
				</div>
			</div>
		)
	}
}

// defines the types of variables in this.props
BuildingPage.propTypes = {
	history: PropTypes.object.isRequired,
	// building: PropTypes.object.isRequired,
	selectBuilding: PropTypes.func.isRequired,
	selectCorporation: PropTypes.func.isRequired,
	selectChatThread: PropTypes.func.isRequired,
	tenant: PropTypes.object.isRequired,
}

// for all optional props, define a default value
BuildingPage.defaultProps = {
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(BuildingPage)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
		// building: redux.selection.selected_building,
		tenant: redux.auth.tenant_profile,
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
		},
		cover_photo: {
			minHeight: '350px',
			maxHeight: '350px',
			minWidth: '100%',
			maxWidth: '100%',
			overflow: 'hidden',
      position: 'relative',
		},
		textMarkup: {
			fontSize: '1rem',
			lineHeight: '2rem',
		},
	}
}
