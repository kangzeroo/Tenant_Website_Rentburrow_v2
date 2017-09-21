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
	Container,
	Button,
} from 'semantic-ui-react'
import { searchForSpecificBuildingByAlias, getSpecificLandlord } from '../../api/search/search_api'
import {
	URLToAlias,
	renderProcessedImage,
	shortenAddress,
	renderProcessedThumbnail,
} from '../../api/general/general_api'
import { selectBuilding, selectCorporation } from '../../actions/selection/selection_actions'
import { selectChatThread } from '../../actions/messaging/messaging_actions'
import {
	getAmenitiesForSpecificBuilding,
	getImagesForSpecificBuilding,
	getAvailableSuites,
	getAmenitiesForSuite,
} from '../../api/building/building_api'
import {
	matchSubletsByPlaceId,
} from '../../api/search/sublet_api'
import ImageGallery from '../image/ImageGallery'
import MapComponent from '../map/MapComponent'
import {
  xMidBlue,
  xLightBlue,
  xDeepBlue,
} from '../../styles/base_colors'
import AmenityBrowser from '../amenities/AmenityBrowser'
import BuildingPageFixedMenu from './BuildingPageFixedMenu'
import AvailableSuites from '../home_explorer/AvailableSuites'
import BuildingQuickAmenitiesBar from '../amenities/BuildingQuickAmenitiesBar'
import StepByStepCard from '../instructions/StepByStepCard'
import AllLandlords from '../landlord/AllLandlords'
import VirtualTourCanvas from '../home_explorer/canvases/VirtualTourCanvas'
import SingularImageGallery from '../image/SingularImageGallery'
// import SubletsList from '../sublets/SubletsList'

class BuildingPage extends Component {
	constructor() {
		super()
		this.state = {
			building: {},
			images: [],
			amenities: [],

			suites: [],
			promise_array_of_suite_amenities_with_id: [],

			sublets: [],

			toggle_modal: false,
      modal_name: '',
      context: {},

			expand_amenities: false,
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
			return this.getAmenitiesForBuilding()
		})
		.then(() => {
			return getAvailableSuites({
	      building_id: this.state.building.building_id,
	    })
		})
		.then((data) => {
			const suites = data.map((s) => JSON.parse(s))
			this.setState({
				suites: suites,
				promise_array_of_suite_amenities_with_id: suites.map((suite) => {
					return getAmenitiesForSuite({
						building_id: this.state.building.building_id,
						suite_id: suite.suite_id,
					}).then((data) => {
						return Promise.resolve({
							suite_id: suite.suite_id,
							amenities: data,
						})
					})
				})
			})
			return matchSubletsByPlaceId({ place_id: this.state.building.place_id })
		})
		.then((sublets) => {
			this.setState({
				sublets: sublets,
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
					size='large'
				>
	        <Modal.Content>
						<ImageGallery
							list_of_images={this.state.images}
						/>
	        </Modal.Content>
	      </Modal>
	    )
		}
  }

	photo_or_vr(building) {
		if (building.istaging_url !== '') {
			console.log(building.istaging_url)
			return (
				<iframe
					width='100%'
					height={`600px`}
					src={building.istaging_url}
					frameBorder='0'
					allowFullScreen
				/>
			)
		} else {
			return (
				<Image
					src={renderProcessedImage(this.state.building.cover_photo)}
					fluid
					onClick={() => { this.toggleModal(true, 'images') }}
				/>
			)
		}
	}

	expandAmenities() {
		this.setState({
			expand_amenities: true,
		})
	}

	render() {
		return (
			<div style={comStyles().container}>
				<div style={loadStyles(renderProcessedImage(this.state.building.cover_photo)).cover_photo}>
					{/*<Image
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

					</div>*/}
					{
						this.photo_or_vr(this.state.building)
					}
					{/*}<div style={comStyles().title_address} >
						{ shortenAddress(this.state.building.building_address) }
					</div>*/}
				</div>
				<div style={comStyles().content_top} >
					<div style={comStyles().content_left} >
						<div style={comStyles().building_header} >
							<h1>Welcome to {this.state.building.building_alias}!</h1>
							<div style={comStyles().description} >
								<div
									dangerouslySetInnerHTML={this.createMarkup(this.state.building.building_desc)}
									style={comStyles().textMarkup}
								/>
							</div>
						</div>
						<div style={comStyles().amenities} >
							{
								this.state.amenities && this.state.amenities.length > 0 && this.state.building && this.state.building.building_id && this.state.suites && this.state.suites.length > 0
								?
								<BuildingQuickAmenitiesBar
									building={this.state.building}
									building_amenities={this.state.amenities}
									all_suites={this.state.suites}
									promise_array_of_suite_amenities_with_id={this.state.promise_array_of_suite_amenities_with_id}
									expandAmenities={() => this.expandAmenities()}
									expand_amenities={this.state.expand_amenities}
								/>
								:
								null
							}
						</div>
						{
							this.state.expand_amenities
							?
							<div style={comStyles().expanded_amenities} >
								<Icon
									name='close'
									size='large'
									style={comStyles().close_amenities}
									onClick={() => this.setState({ expand_amenities: false, })}
								/>
								<AmenityBrowser
									building={this.state.building}
									amenities={this.state.amenities}
								/>
							</div>
							:
							null
						}
						<div style={comStyles().images_container}>
							<SingularImageGallery
								list_of_images={[this.state.building.cover_photo].concat(this.state.building.imgs)}
								image_size='hd'
							/>
						</div>
						<div style={comStyles().suites_table}>
							{
								this.state.suites && this.state.suites.length > 0
								?
								<AvailableSuites
									building={this.state.building}
									suites={this.state.suites}
									promise_array_of_suite_amenities_with_id={this.state.promise_array_of_suite_amenities_with_id}
								/>
								:
								null
							}
						</div>
					</div>
					<div style={comStyles().content_right} >
						<StepByStepCard
							building={this.state.building}
							all_suites={this.state.suites}
						/>
						{
							this.state.building.building_id
							?
							<div style={comStyles().map}>
								<MapComponent
									listOfResults={[this.state.building]}
									selected_pin={this.state.building.building_id}
									CSS_mapWidth='100%'
									CSS_mapHeight='100%'
								/>
							</div>
							:
							null
						}
					</div>
				</div>

				{/*<div style={comStyles().images_container}>
					<SingularImageGallery
						list_of_images={[this.state.building.cover_photo].concat(this.state.building.imgs)}
						image_size='hd'
					/>
				</div>*/}
				{/*<div style={comStyles().content_bottom}>
					<AllLandlords />
				</div>*/}

				{/*<SubletsList
					sublets={this.state.sublets}
				/>*/}

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
const loadStyles = (img) => {
	return {
		cover_photo: {
			minHeight: '600px',
			maxHeight: '600px',
			minWidth: '100%',
			maxWidth: '100%',
			overflow: 'hidden',
      position: 'relative',
			background: `url('${img}') center center no-repeat`,
			backgroundSize: 'cover',
		},
	}
}

const comStyles = () => {
	return {
		container: {
      display: 'flex',
      flexDirection: 'column',
		},
		cover_photo: {
			minHeight: '500px',
			maxHeight: '500px',
			minWidth: '100%',
			maxWidth: '100%',
			overflow: 'hidden',
      position: 'relative',
			//background: `transparent url('${this.state.building.istaging_url}') center no-repeat`,
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
		title_address: {
			position: 'absolute',
      bottom: '40px',
      left: '0px',
			height: '100px',
      fontSize: '2.8rem',
			fontWeight: 'bold',
			color: 'white',
			backgroundColor: 'rgba(0,0,0,0.6)',
			padding: '30px',
			display: 'flex',
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'flex-start',
		},
		content_top: {
			display: 'flex',
			flexDirection: 'row',
			backgroundColor: 'rgba(153,204,255,0.2)',
		},
		content_bottom: {
			display: 'flex',
			flexDirection: 'row',
			backgroundColor: 'rgba(153,204,255,0.2)',
			height: '500px',
			width: '100%',
		},
		content_left: {
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
			flex: '1',
			margin: '20px 50px 20px 20px',
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
			margin: '10px 0px 10px 0px',
			backgroundColor: 'white',
		},
		expanded_amenities: {
			margin: '10px 0px 10px 0px',
			backgroundColor: 'white',
			display: 'flex',
		},
		map: {
			margin: '30px 0px 0px 0px',
			width: '100%',
			height: '480px',
		},
		building_header: {
			backgroundColor: 'white',
			display: 'flex',
			flexDirection: 'column',
			borderRadius: '2px',
			padding: '10px',
		},
		description: {
			backgroundColor: 'white',
			margin: '10px 0px 10px 0px',
			borderRadius: '2px',
			padding: '10px',
			borderTop: 'gray solid thin'
		},
		suites_table: {
			backgroundColor: 'white',
			margin: '10px 0px 10px 0px',
			borderRadius: '2px',
			padding: '10px',
		},
		images_container: {
			margin: '20px 0px 10px 0px'
		},
		close_amenities: {
			position: 'relative',
			top: '10px',
			left: '10px',
			height: '20px',
			width: '20px',
		}
	}
}
