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
import HousingPanel from './panel/HousingPanel'
import MapComponent from '../map/MapComponent'
import {
	getBuildingsInArea,
} from '../../api/search/search_api'
import {
	saveBuildingsToRedux,
} from '../../actions/search/search_actions'
import PopupPanel from './panel/PopupPanel'

class HousingPage extends Component {

	componentWillMount() {
		getBuildingsInArea({
			lat: 23,
			long: 54,
		}).then((buildings) => {
			this.props.saveBuildingsToRedux(buildings)
		})
	}

	render() {
		return (
			<div style={comStyles().container}>
				{
					this.props.popup_building
					?
					<PopupPanel
						building={this.props.popup_building}
						style={comStyles().popupPanel}
					/>
					:
					null
				}
				<HousingPanel />
				<MapComponent
					listOfResults={this.props.buildings}
					selected_pin={this.props.selected_pin}
					style={comStyles().map} />
			</div>
		)
	}
}

// defines the types of variables in this.props
HousingPage.propTypes = {
	history: PropTypes.object.isRequired,
	saveBuildingsToRedux: PropTypes.func.isRequired,
	buildings: PropTypes.array,
	selected_pin: PropTypes.string,
	popup_building: PropTypes.object,
}

// for all optional props, define a default value
HousingPage.defaultProps = {
	buildings: [],
	selected_pin: null,
	popup_building: null,
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(HousingPage)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
		buildings: redux.search.search_results,
		selected_pin: redux.search.selected_pin,
		popup_building: redux.selection.popup_building,
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
		saveBuildingsToRedux,
	})(RadiumHOC)
)

// ===============================

// the JS function that returns Radium JS styling
const comStyles = () => {
	return {
		container: {
      display: 'flex',
      flexDirection: 'row',
			height: '93vh',
			width: '100%',
			position: 'relative',
		},
		map: {
			width: '50vw',
		},
		popupPanel: {
			position: 'absolute',
			zIndex: 100,
			left: 0,
		}
	}
}
