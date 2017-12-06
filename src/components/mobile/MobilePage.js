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
	Card,
	Header,
} from 'semantic-ui-react'
import MobileBuildingsList from './components/buildings/MobileBuildingsList'
import MobileMapComponent from './components/others/MobileMapComponent'
import SingularImageGallery from '../image/SingularImageGallery'
import MobileLeaseFilterCard from './components/others/MobileLeaseFilterCard'
import MobileBuildingCard from './components/cards/MobileBuildingCard'
import { queryBuildingsInArea, } from '../../api/search/search_api'
import { check_if_building_accessible } from '../../api/label/building_label_api'
import { saveBuildingsToRedux, } from '../../actions/search/search_actions'
import { aliasToURL, } from '../../api/general/general_api'

class MobilePage extends Component {

	constructor() {
    super()
    this.state = {
      buildings: [],

			search_style: 'list'
    }
  }

  componentWillMount() {
    queryBuildingsInArea()
    .then((data) => {
      const buildings = data
			// Sort the buildings randomly
			this.props.saveBuildingsToRedux(buildings.sort((a, b) => { return 0.5 - Math.random() }))
			this.setState({
				buildings,
			})
    })
  }

	selectThisBuilding(building) {
    // console.log(`${window.location.origin}/${aliasToURL(building.building_alias)}`)
    if (check_if_building_accessible(building.label)) {
      window.open(`${window.location.origin}/${aliasToURL(building.building_alias)}`, '_blank')
    } else {
      // do nothing
    }
    this.props.collectIntel({
      'TableName': BUILDING_INTERACTIONS,
      'Item': {
        'ACTION': 'BUILDING_CARD_CLICKED',
        'DATE': new Date().getTime(),
        'BUILDING_ID': building.building_id,
        'ADDRESS': building.building_address,
        'USER_ID': this.props.tenant_profile.tenant_id || 'NONE',
        'CORP_ID': building.corporation_id,
      }
    })
  }

	renderBuildingPreview(buildings) {
		const building = buildings[0]
		if (building) {
			return (
				<MobileBuildingCard
					key={building.building_id}
					building={building}
				/>
			)
		} else {
			return null
		}
	}

	renderMapView() {
		return (
			<div style={comStyles().mapContainer}>
				<MobileMapComponent
					listOfResults={this.props.building_search_results}
					selected_pin={this.props.selected_pin}
					style={comStyles().map}
				/>
				<div style={comStyles().buildingPreviewContainer}>
					{
						this.renderBuildingPreview(this.props.building_search_results.filter((building) => {
							return building.building_id === this.props.selected_pin
						}))
					}
				</div>
			</div>
		)
	}

	renderView() {
		if (this.state.search_style === 'filter') {
			return (
				<MobileLeaseFilterCard
					closeFilterCard={() => this.setState({ search_style: 'map' })}
					buildings={this.props.building_search_results}
				/>
			)
		} else if (this.state.search_style === 'list') {
			return (
				<MobileBuildingsList
					buildings={this.state.buildings}
				/>
			)
		} else if (this.state.search_style === 'map') {
			return this.renderMapView()
		} else {
			return null
		}
	}

	render() {
		return (
			<div id='MobilePage' style={comStyles().container}>
				<Button.Group>
					<Button
						basic
						primary={this.state.search_style !== 'filter'}
						color='white'
						icon='filter'
						content='Filter'
						onClick={() => this.setState({ search_style: 'filter' })}
						style={comStyles().button}
					/>
					<Button
						basic
						primary={this.state.search_style !== 'list'}
						color='white'
						icon='list'
						content='List View'
						onClick={() => this.setState({ search_style: 'list' })}
						style={comStyles().button}
					/>
					<Button
						basic
						primary={this.state.search_style !== 'map'}
						color='white'
						icon='map'
						content='Map View'
						onClick={() => this.setState({ search_style: 'map' })}
						style={comStyles().button}
					/>
				</Button.Group>
				{
					this.renderView()
				}
			</div>
		)
	}
}

// defines the types of variables in this.props
MobilePage.propTypes = {
	history: PropTypes.object.isRequired,
	saveBuildingsToRedux: PropTypes.func.isRequired,
	building_search_results: PropTypes.array,
	selected_pin: PropTypes.string,
}

// for all optional props, define a default value
MobilePage.defaultProps = {
	building_search_results: [],
	selected_pin: null,
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(MobilePage)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
		building_search_results: redux.search.building_search_results,
		selected_pin: redux.search.selected_pin,
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
      flexDirection: 'column',
      width: '100vw',
			height: '100%'
		},
		buttonsContainer: {
			display: 'flex',
			flexDirection: 'row',
			width: '100%'
		},
		mapContainer: {
			width: '100vw',
			height: '90vh',
		},
		button: {
			fontSize: '2rem'
		},
		buildingPreviewContainer: {
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			width: '100vw',
			height: 'auto',
			position: 'absolute',
			bottom: '0px',
		},
		buildingPreview: {
			width: '100%',
			height: '100%',
			display: 'flex',
			flexDirection: 'column',
		},
		buildingPreviewInfo: {
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
		},
		select_a_pin: {
			padding: '50px',
		}
	}
}
