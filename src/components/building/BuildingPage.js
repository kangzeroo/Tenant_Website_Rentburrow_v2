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
	Modal,
	Item,
	Icon,
	Header,
	Button,
} from 'semantic-ui-react'
import { searchForSpecificBuildingByAlias, getSpecificLandlord } from '../../api/search/search_api'
import { URLToAlias, renderProcessedImage, } from '../../api/general/general_api'
import { selectBuilding, selectCorporation } from '../../actions/selection/selection_actions'
import { selectChatThread } from '../../actions/messaging/messaging_actions'
import { getAmenitiesForSpecificBuilding,
				 getImagesForSpecificBuilding,
				 getAvailableSuites,
			 } from '../../api/building/building_api'
import ImageGallery from '../image/ImageGallery'
import MapComponent from '../map/MapComponent'
import {
  xMidBlue,
  xLightBlue,
  xDeepBlue,
} from '../../styles/base_colors'
import AmenityBrowser from '../amenities/AmenityBrowser'
import BuildingPageFixedMenu from './BuildingPageFixedMenu'
import AvailableSuites from './AvailableSuites'


class BuildingPage extends Component {
	constructor() {
		super()
		this.state = {
			building: {},
			suites: [],

			images: [],
			amenities: [],

			toggle_modal: false,
      modal_name: '',
      context: {},
		}
	}

	componentWillMount() {
		// this.props.selectChatThread([
		// 	{
		// 		message_id: uuid.v4(),
		// 		sender_id: this.props.building.corporation_id,
		// 		receiver_id: this.props.tenant.id,
		// 		tenant_id: this.props.tenant.id,
		// 		tenant_name: this.props.tenant.name,
		// 		staff_id: '',
		// 		building_id: this.props.building.building_id,
		// 		building_thumbnail: this.props.building.thumbnail,
		// 		building_alias: this.props.building.building_name,
		// 		corporation_id: this.props.building.corporation_id,
		// 		corporation_name: this.props.building.corporation_name,
		// 		channel_id: `${this.props.building.corporation_id}_${this.props.tenant.id}`,
		// 		contents: `Welcome to ${this.props.building.building_address}! Ask me any questions live!`,
		// 	}
		// ])
    let building_alias = URLToAlias(this.props.location.pathname)
    if (building_alias[building_alias.length - 1] === '/') {
      building_alias = building_alias.slice(0, -1)
    }
		searchForSpecificBuildingByAlias(building_alias)
		.then((data) => {
			this.setState({
				building: data
			})
			return this.getImagesForBuilding()
		})
		.then(() => {
			console.log(this.state.building)
			return this.getAmenitiesForBuilding()
		})
		.then(() => {
			return getAvailableSuites({
	      building_id: this.state.building.building_id,
	    })
		})
		.then((data) => {
			this.setState({
				suites: data.map((s) => JSON.parse(s))
			})
		})
	}

	getImagesForBuilding() {
		getImagesForSpecificBuilding({
			building_id: this.state.building.building_id,
		}).then((images) => {
			this.setState({
				images: images.map((s) => JSON.parse(s))
			})
		})
	}

	getAmenitiesForBuilding() {
		getAmenitiesForSpecificBuilding({
			building_id: this.state.building.building_id,
		}).then((amenities) => {
			this.setState({
				amenities: amenities.map((s) => JSON.parse(s))
			})
		})
	}


	createMarkup(string) {
		return {
			__html: string,
		}
	}

	toggleModal(bool, attr, context) {
		this.setState({
      toggle_modal: bool,
      modal_name: attr,
      context,
    })
  }

	renderAppropriateModal(modal_name, context) {
		if (modal_name === 'images') {
	    return (
	      <Modal
					dimmer
					open={this.state.toggle_modal}
					onClose={() => this.toggleModal(false)}
					closeIcon
					size='fullscreen'
				>
					<Header>
						Images for {this.state.building.building_address}
					</Header>
	        <Modal.Content>
						<ImageGallery
							list_of_images={this.state.images}
						/>
	        </Modal.Content>
	      </Modal>
	    )
		}
  }

	render() {
		return (
			<div style={comStyles().container}>
				<div style={comStyles().cover_photo} >
					<Image
						src={renderProcessedImage(this.state.building.cover_photo)}
						fluid
						onClick={() => { this.toggleModal(true, 'images') }}
					/>
					<div style={comStyles().action_sticker} >
						<Button
							fluid
							primary
							onClick={() => { this.toggleModal(true, 'images') }}
							content='View Photos'
							size='large'
							style={comStyles().viewPhoto}
						/>
					</div>
				</div>
				{/*<BuildingPageFixedMenu
					goToSection={(section) => console.log(`Going to the ${section} section!`)}
					positionStyle={'relative'}
				/>*/}
				<div style={comStyles().content} >

					<div style={comStyles().building_container} >
						<div style={comStyles().building_header} >
							<h1>{ this.state.building.building_alias }</h1>
							<h2>{ this.state.building.building_address }</h2>
						</div>
						<div style={comStyles().description} >
							<div style={comStyles().about}>About This Building</div>
							<div
								dangerouslySetInnerHTML={this.createMarkup(this.state.building.building_desc)}
								style={comStyles().textMarkup}
							/>
						</div>
						<AmenityBrowser
							amenities={this.state.amenities}
							building={this.state.building}
						/>
						<div style={comStyles().suites_table} >
							<AvailableSuites
								suites={this.state.suites}
							/>
						</div>
					</div>
					<div style={comStyles().content_right} >
					</div>
				</div>
				{
					this.state.building.building_id
					?
					<MapComponent
						listOfResults={[this.state.building]}
						selected_pin={this.state.building.building_id}
						CSS_mapWidth='100vw'
						CSS_mapHeight='40vh'
						style={comStyles().map}
					/>
					:
					null
				}
				{
          this.renderAppropriateModal(this.state.modal_name, this.state.context)
        }
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
			background: "transparent url('https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif') center no-repeat",
		},
		action_sticker: {
      position: 'absolute',
      bottom: '40px',
      right: '20px',
			height: '50px',
      width: '200px',
      fontSize: '3rem',
			color: 'white'
    },
		content: {
			display: 'flex',
			flexDirection: 'row',
			backgroundColor: 'rgba(153,204,255,0.2)',
		},
		building_container: {
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'space-between',
			flex: '2',
			margin: '20px 20px 20px 50px',
			backgroundColor: 'rgba(153,204,255,0)',
			padding: '10px'
		},
		content_right: {
			display: 'flex',
			flexDirection: 'column',
			flex: '1'
		},
		textMarkup: {
			fontSize: '1rem',
			lineHeight: '2rem',
		},
		about: {
			fontSize: '2.5rem',
			lineHeight: '2.5rem',
			fontWeight: 'bold',
			margin: '10px 0px 10px 0px',
			padding: '5px 0px 5px 0px',
		},
		amenities: {
			fontSize: '2.5rem',
			lineHeight: '2.5rem',
			fontWeight: 'bold',
			margin: '10px 0px 10px 0px',
			padding: '5px 0px 5px 0px',
		},
		amenity: {
			fontSize: '1.5rem',
			lineHeight: '1.5rem',
			display: 'flex',
			flexDirection: 'row',
		},
		map: {
			width: '100vw',
		},
		building_header: {
			backgroundColor: 'white',
			margin: '10px 0px 10px 0px',
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			borderRadius: '2px',
		},
		description: {
			backgroundColor: 'white',
			margin: '10px 0px 10px 0px',
			borderRadius: '2px',
			padding: '5px',
		},
		suites_table: {
			backgroundColor: 'white',
			margin: '10px 0px 10px 0px',
			borderRadius: '2px',
			padding: '10px',
		}
	}
}
