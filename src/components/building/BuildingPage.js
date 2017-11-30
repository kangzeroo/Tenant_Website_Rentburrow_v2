// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import uuid from 'uuid'
import { withRouter, Route } from 'react-router-dom'
import {
	Image,
	Modal,
	Item,
	Icon,
	Header,
	Container,
	Label,
	Button,
	Form,
	Card,
	Input,
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
	calculateCheapestSublet,
} from '../../api/search/sublet_api'
import ImageGallery from '../image/ImageGallery'
import MapComponent from '../map/MapComponent'
import {
  xMidBlue,
  xLightBlue,
  xDeepBlue,
} from '../../styles/base_colors'
import PrizeBlowup from '../instructions/PrizeBlowup'
import AmenityBrowser from '../amenities/AmenityBrowser'
import BuildingPageFixedMenu from './BuildingPageFixedMenu'
import HomeOverview from '../home_overview/HomeOverview'
import BuildingQuickAmenitiesBar from '../amenities/BuildingQuickAmenitiesBar'
import StepByStepCard from '../instructions/StepByStepCard'
import ApplyBox from '../instructions/ApplyBox'
import AllLandlords from '../landlord/AllLandlords'
import VirtualTourCanvas from '../home_explorer/canvases/VirtualTourCanvas'
import SingularImageGallery from '../image/SingularImageGallery'
import SubletsList from '../sublets/SubletsList'
import DescriptionBox from './DescriptionBox'
import SimpleTempForm from '../contracts/simple_temp_form/SimpleTempForm'
import RibbonLabel from '../instructions/RibbonLabel'
import AnalyticsSummary from './Components/AnalyticsSummary'
import PhoneCallForm from '../contracts/simple_temp_form/PhoneCallForm'
import { BUILDING_INTERACTIONS, IMAGE_INTERACTIONS } from '../../api/intel/dynamodb_tablenames'
import { collectIntel } from '../../actions/intel/intel_actions'

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

			expand_amenities: true,
		}
	}

	componentWillMount() {
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
				const suites = data
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
				// console.log('getSpecificLandlord', this.state.building.building_id)
				return getSpecificLandlord({ building_id: this.state.building.building_id })
			})
			.then((corporation) => {
				// console.log(corporation)
				this.props.selectCorporation(corporation)
				this.props.collectIntel({
				  'TableName': BUILDING_INTERACTIONS,
				  'Item': {
				    'ACTION': 'BUILDING_PAGE_LOADED',
				    'DATE': new Date().getTime(),
				    'BUILDING_ID': this.state.building.building_id,
				    'ADDRESS': this.state.building.building_address,
				    'USER_ID': this.props.tenant_profile.tenant_id || 'NONE',
				  }
				})
			})
	}

	getImagesForBuilding() {
		getImagesForSpecificBuilding({
			building_id: this.state.building.building_id,
		}).then((images) => {
			this.setState({
				images: images
			})
		})
	}

	getAmenitiesForBuilding() {
		getAmenitiesForSpecificBuilding({
			building_id: this.state.building.building_id,
		}).then((amenities) => {
			this.setState({
				amenities: amenities
			})
		})
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
		} else if (modal_name === 'collection') {
			return (
	      <Modal
					dimmer
					open={this.state.toggle_modal}
					onClose={() => this.toggleModal(false)}
					closeIcon
					size='large'
				>
	        <Modal.Content>
						<SimpleTempForm
							building={this.state.building}
							landlord={this.props.selected_landlord}
							suites={this.state.suites}
							closeModal={() => this.toggleModal(false)}
							title={this.state.building.label}
						/>
	        </Modal.Content>
	      </Modal>
	    )
		} else if (modal_name === 'phone') {
			return (
	      <Modal
					dimmer
					open={this.state.toggle_modal}
					onClose={() => this.toggleModal(false)}
					closeIcon
					size='large'
				>
	        <Modal.Content>
						<PhoneCallForm
							building={this.state.building}
							landlord={this.props.selected_landlord}
							landlord={this.props.selected_landlord}
							title={this.state.building.label}
							closeModal={() => this.toggleModal(false)}
						/>
	        </Modal.Content>
	      </Modal>
	    )
		}
  }

	photo_or_vr(building) {
		if (building.istaging_url) {
			// console.log(building.istaging_url)
			return (
				<iframe
					width='100%'
					height={`100%`}
					src={building.istaging_url}
					frameBorder='0'
					allowFullScreen
					scrolling='no'
					style={comStyles().iframe_container}
				/>
			)
		} else if (building.iguide_url) {
			return (
				<iframe
					width='100%'
					height={`100%`}
					src={building.iguide_url}
					frameBorder='0'
					allowFullScreen
				/>
			)
		} else if (building.video_url) {
			const video_id = building.video_url.split('/watch?v=')[1]
			const embedded_url = `https://www.youtube.com/embed/${video_id}?autoplay=1`
			return (
				<iframe
					width='100%'
					height={`100%`}
					type='text/html'
					src={embedded_url}
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

	selectThisPost(sublet) {
    window.open(`${window.location.origin}/sublet/${sublet.place_id}`, '_blank')
  }

	checkOutSublet() {
		this.selectThisPost(this.state.sublets[0])
		this.props.collectIntel({
	    'TableName': BUILDING_INTERACTIONS,
	    'Item': {
	      'ACTION': 'BUILDING_CHECK_SUBLETS',
	      'DATE': new Date().getTime(),
	      'BUILDING_ID': this.state.building.building_id,
	      'ADDRESS': this.state.building.building_address,
	      'USER_ID': this.props.tenant_profile.tenant_id || 'NONE',
				'SUBLET_COUNT': this.state.sublets.length,
	    }
	  })
	}

	render() {
		return (
			<div id='BuildingPage' style={comStyles().container}>
				<div style={loadStyles(renderProcessedImage(this.state.building.cover_photo)).cover_photo}>
					{
						this.state.building.istaging_url || this.state.building.iguide_url
						?
						<div style={comStyles().hidden_loading}>
							<img src='https://s3.amazonaws.com/rentburrow-static-assets/Loading+Icons/loading-blue-clock.gif' width='50px' height='auto' />
						</div>
						:
						null
					}
					<div style={comStyles().visible_virtual_tour}>
						{
							this.photo_or_vr(this.state.building)
						}
					</div>
				</div>
				<div style={comStyles().content_top}>
					<div style={comStyles().content_left}>
						<Card fluid raised style={comStyles().building_header}>
							<div style={comStyles().welcome_banner}>
								<div style={comStyles().welcome_message}>Welcome to {this.state.building.building_alias}</div>
								{
									this.state.building.label
									?
									<div onClick={() => this.toggleModal(true, 'collection')} style={comStyles().welcome_ribbon}>
			              <RibbonLabel label={this.state.building.label} size='massive' />
									</div>
									:
									null
								}
							</div>
							<div style={comStyles().description} >
								{
									this.state.building.building_desc
									?
									<DescriptionBox description={this.state.building.building_desc} />
									:
									null
								}
							</div>
						</Card>
						{
							this.state.amenities && this.state.amenities.length > 0 && this.state.building && this.state.building.building_id && this.state.promise_array_of_suite_amenities_with_id.length > 0
							?
							<Card fluid raised style={comStyles().amenities} >
								<BuildingQuickAmenitiesBar
									building={this.state.building}
									building_amenities={this.state.amenities}
									all_suites={this.state.suites}
									promise_array_of_suite_amenities_with_id={this.state.promise_array_of_suite_amenities_with_id}
									expandAmenities={() => this.expandAmenities()}
									expand_amenities={this.state.expand_amenities}
								/>
							</Card>
							:
							null
						}
						{/*
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
						*/}
						{/*<div style={comStyles().images_container}>
							<SingularImageGallery
								list_of_images={[this.state.building.cover_photo].concat(this.state.building.imgs)}
								image_size='hd'
							/>
						</div>*/}
						{
							this.state.building.building_id
							?
							<div style={comStyles().analyticsSummary} >
								<AnalyticsSummary
									building={this.state.building}
								/>
							</div>
							:
							null
						}
					</div>
					<div style={comStyles().content_right} >
						{/*}<StepByStepCard
							building={this.state.building}
							all_suites={this.state.suites}
							toggleTemporaryCollectionFrom={() => this.toggleModal(true, 'collection')}
						/>*/}
						<ApplyBox
							building={this.state.building}
							all_suites={this.state.suites}
							toggleTemporaryCollectionFrom={() => this.toggleModal(true, 'collection')}
							togglePhoneCallForm={() => this.toggleModal(true, 'phone')}
							sublets={this.state.sublets}
						/>
						{
							this.state.building.building_id
							?
							<Card fluid raised style={comStyles().mapContainer} >
								<Card fluid raised style={comStyles().map}>
									<MapComponent
										listOfResults={[this.state.building]}
										selected_pin={this.state.building.building_id}
										CSS_mapWidth='100%'
										CSS_mapHeight='100%'
									/>
								</Card>
								<div style={comStyles().addressFont} >
									{ this.state.building.building_address }
								</div>
							</Card>
							:
							null
						}
						{/*
							this.state.sublets.length > 0
							?
							<div style={comStyles().four_month_sublet}>
								<h3>Prefer a 4 month lease?</h3>
								<Button onClick={() => this.checkOutSublet()} basic fluid primary style={comStyles().facebook_sublets}>
									View {this.state.sublets.length} sublets from Facebook <br />
									{
										calculateCheapestSublet(this.state.sublets)
										?
										`Prices starting from $${calculateCheapestSublet(this.state.sublets)}`
										:
										null
									}
								</Button>
							</div>
							:
							<div style={comStyles().four_month_sublet}>
								<h3>No 4 month sublets available</h3>
							</div>
						*/}
					</div>
				</div>

				<div style={comStyles().suites_table}>
					{
						this.state.amenities && this.state.amenities.length > 0
						?
						<AmenityBrowser
							building={this.state.building}
							amenities={this.state.amenities}
							intel_action='BUILDING_AMENITY_CLICKED'
							intel_id={this.state.building.building_id}
						/>
						:
						null
					}
					{
						this.state.building
						?
						<HomeOverview
							building={this.state.building}
							suites={this.state.suites}
							promise_array_of_suite_amenities_with_id={this.state.promise_array_of_suite_amenities_with_id}
							toggleTemporaryCollectionFrom={() => this.toggleModal(true, 'collection')}
						/>
						:
						null
					}
				</div>

				{/*<div style={comStyles().images_container}>
					<SingularImageGallery
						list_of_images={[this.state.building.cover_photo].concat(this.state.building.imgs)}
						image_size='hd'
					/>
				</div>*/}
				{/*<div style={prizeStyles().popup_icon}>
					<PrizeBlowup />
				</div>*/}

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
	tenant_profile: PropTypes.object.isRequired,
	selected_landlord: PropTypes.object.isRequired,
  collectIntel: PropTypes.func.isRequired,
  tenant_profile: PropTypes.object.isRequired,
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
		tenant_profile: redux.auth.tenant_profile,
		selected_landlord: redux.selection.selected_landlord,
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
		selectBuilding,
		selectChatThread,
		selectCorporation,
		collectIntel,
	})(RadiumHOC)
)

// ===============================

// the JS function that returns Radium JS styling
const loadStyles = (img) => {
	return {
		cover_photo: {
			minHeight: '70vh',
			maxHeight: '70vh',
			minWidth: '100vw',
			maxWidth: '100vw',
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
			backgroundColor: 'rgba(153,204,255,0.1)',
		},
    hidden_loading: {
      position: 'absolute',
      // zIndex: 5,
      minWidth: '100%',
      minHeight: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    visible_virtual_tour: {
      position: 'absolute',
      zIndex: 10,
      width: '100%',
      height: '100%',
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
		},
		content_bottom: {
			display: 'flex',
			flexDirection: 'row',
			height: '800px',
			width: '100%',
		},
		content_left: {
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'flex-start',
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
			padding: '10px',
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
		mapContainer: {
			display: 'flex',
			flexDirection: 'column',
			height: '400px',
		},
		map: {
			width: '100%',
			height: '300px',
		},
		addressFont: {
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			fontSize: '1.5rem',
			fontWeight: 'bold',
			margin: '20px 0px 0px 0px'
		},
		building_header: {
			backgroundColor: 'white',
			display: 'flex',
			flexDirection: 'column',
			borderRadius: '2px',
			padding: '20px',
		},
		welcome_banner: {
			display: 'flex',
			flexDirection: 'row',
		},
		welcome_message: {
			width: '80%',
			fontSize: '2rem',
			fontWeight: 'bold',
		},
		welcome_ribbon: {
			width: '20%',
			fontSize: '1.5rem',
			fontWeight: 'bold',
		},
		description: {
			backgroundColor: 'white',
			margin: '10px 0px 10px 0px',
			borderRadius: '2px',
			padding: '10px',
			borderTop: 'gray solid thin'
		},
		suites_table: {
			borderRadius: '3px',
			padding: '50px',
			display: 'flex',
			flexDirection: 'column',
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
		},
		four_month_sublet: {
			padding: '20px',
			display: 'flex',
			flexDirection: 'column',
		},
		facebook_sublets: {
			height: '100px',
			fontSize: '1.3rem',
			lineHeight: '30px',
		},
		iframe_container: {
			zoom: '0.5'
		},
		analyticsSummary: {
			margin: '10px 0px 0px 0px'
		}
	}
}

const prizeStyles = () => {
	return {
		popup_icon: {
			position: 'fixed',
			bottom: '0px',
			zIndex: 30,
		}
	}
}
