// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import uuid from 'uuid'
import MetaTags from 'react-meta-tags'
import moment from 'moment'
import { withRouter } from 'react-router-dom'
import {
	Image,
	Modal,
	Card,
	Loader,
	Dimmer,
	Icon,
	Segment,
	Header,
	Button,
} from 'semantic-ui-react'
import { searchForSpecificBuildingByAlias, getSpecificLandlord, getLandlordInfo } from '../../api/search/search_api'
import {
	URLToAlias,
	renderProcessedImage,
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
import MapComponent from '../map/MapComponent'
import AmenityBrowser from '../amenities/AmenityBrowser'
import HomeOverview from '../home_overview/HomeOverview'
import BuildingQuickAmenitiesBar from '../amenities/BuildingQuickAmenitiesBar'
import ApplyBox from '../instructions/ApplyBox'
import SingularImageGallery from '../image/SingularImageGallery'
import DescriptionBox from './DescriptionBox'
import SimpleTempForm from '../contracts/simple_temp_form/SimpleTempForm'
import RibbonLabel from '../instructions/RibbonLabel'
import AnalyticsSummary from './Components/AnalyticsSummary'
import MessageLandlordForm from '../contracts/simple_temp_form/MessageLandlordForm'
import BuildingViews from '../analytics/BuildingViews'
import LandlordResponsiveness from '../analytics/LandlordResponsiveness'
import BuildingToursContainer from './Components/BuildingToursContainer'
import { BUILDING_INTERACTIONS, } from '../../api/intel/dynamodb_tablenames'
import { collectIntel } from '../../actions/intel/intel_actions'
import { triggerForcedSigninFavorite, } from '../../actions/auth/auth_actions'
import { changeHTMLTitle } from '../../actions/app/app_actions'
import { getToursForBuilding } from '../../api/tour/tour_api'
import { checkLandlordResponsiveness } from '../../api/landlord/landlord_api'


class BuildingPage extends Component {
	constructor() {
		super()
		this.state = {
			building: {},
			images: [],
			amenities: [],

			mapped_landlord: {},
			suites: [],
			promise_array_of_suite_amenities_with_id: [],
			responsivenessStats: {},
			sublets: [],

			toggle_modal: false,
      modal_name: '',
      context: {},

			expand_amenities: true,

			// favorited: [],
			// favorites_loaded: false,
			loading: true,


			tours: [],
		}
	}

	componentWillMount() {
		this.checkIfGiftModalShouldAppear()

    let building_alias = URLToAlias(this.props.location.pathname)
    if (building_alias[building_alias.length - 1] === '/') {
      building_alias = building_alias.slice(0, -1)
		}

		this.props.changeHTMLTitle(`${this.convertToNameCase(building_alias.slice(1))}, Waterloo -- Student Housing for Rent on RentHero`)
		searchForSpecificBuildingByAlias(building_alias)
			.then((data) => {
				this.setState({
					building: data,
				})
				this.props.changeHTMLTitle(`${this.convertToNameCase(data.building_address)} -- Student Housing for Rent on RentHero`)
				return this.getImagesForBuilding()
			})
			.then(() => {
				return this.getAmenitiesForBuilding()
			})
			.then(() => {
				return this.getToursForBuilding()
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
				// console.log('matchSubletsByPlaceId')
				return matchSubletsByPlaceId({ place_id: this.state.building.place_id })
			})
			.then((sublets) => {
				// console.log('matchSubletsByPlaceId DONE')
				// console.log(sublets)
				this.setState({
					sublets: sublets,
					loading: false,
				})
				// console.log('getSpecificLandlord', this.state.building.building_id)
				return getSpecificLandlord(this.state.building.building_id)
			})
			.then((corporation) => {
				this.props.collectIntel({
				  'TableName': BUILDING_INTERACTIONS,
				  'Item': {
				    'ACTION': 'BUILDING_PAGE_LOADED',
				    'DATE': new Date().getTime(),
				    'BUILDING_ID': this.state.building.building_id,
				    'ADDRESS': this.state.building.building_address,
				    'USER_ID': this.props.tenant_profile.tenant_id || 'NONE',
				    'FINGERPRINT': this.props.fingerprint,
				  }
				})
				return getLandlordInfo(this.state.building.building_id)
			})
			.then((actualLandlord) => {
				this.setState({
	        mapped_landlord: actualLandlord,
	      })
				this.props.selectCorporation(actualLandlord)
				return checkLandlordResponsiveness(actualLandlord.corporation_id)
			})
			.then((stats) => {
				this.setState({
					responsivenessStats: stats
				})
			})
	}

	convertToNameCase(str) {
		return str.replace(/\w\S*/g, (txt) => { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase() })
	}

	checkIfGiftModalShouldAppear() {
		const redeem_prize_popup_date = localStorage.getItem('redeem_prize_popup_date', moment().valueOf())
		if ((parseInt(redeem_prize_popup_date) + (1000 * 60 * 60 * 24)) < moment().valueOf()) {
    	this.toggleModal(true, 'redeem_prize')
		}
	}
	// componentWillReceiveProps(nextProps) {
	// 	if (this.props.tenant_profile !== nextProps.tenant_profile) {
	// 		getTenantFavoriteForBuilding(nextProps.tenant_profile.tenant_id, this.state.building.building_id)
	// 		.then((data) => {
	// 			this.setState({
	// 				favorited: data,
	// 				favorites_loaded: true,
	// 			})
	// 		})
	// 	}
	// }

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

	getToursForBuilding() {
		getToursForBuilding(this.state.building.building_id)
		.then((data) => {
			this.setState({
				tours: data,
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
						<SingularImageGallery
							list_of_images={this.state.images.map(img => img.image_url)}
							image_size='hd'
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
							<MessageLandlordForm
								building={this.state.building}
								landlord={this.props.selected_landlord}
								title={this.state.building.label}
								header={context}
								closeModal={() => this.toggleModal(false)}
							/>
							{/*<PhoneTestForm
								building={this.state.building}
								landlord={this.props.selected_landlord}
								title={this.state.building.label}
								closeModal={() => this.toggleModal(false)}
							/>*/}
		        </Modal.Content>
		      </Modal>
		    )
		} else if (modal_name === 'redeem_prize') {
			localStorage.setItem('redeem_prize_popup_date', moment().valueOf())
			return (
				<Modal
					dimmer
					open={this.state.toggle_modal}
					onClose={() => this.toggleModal(false)}
					closeIcon
					size='large'
				>
					<Modal.Content>
						<div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
							<Header as='h2' content='Get Your House Warming Gift!' subheader='Every roommate gets a gift after signing a lease. Remember to claim yours!' />
						</div>
						<br /><br />
						<div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
							<Icon name='gift' size='huge' />
							<br /><br />
							<Button primary onClick={() => this.props.history.push('/claimprize')} style={{ width: '100%' }}>Redeem Gift</Button>
							<div style={{ width: '100%', height: '10px' }} />
							<Button onClick={() => this.toggleModal(false)} style={{ width: '100%' }}>Close</Button>
						</div>
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

	showMessagePopup(header) {
		if (!this.props.authenticated || !this.props.tenant_profile || !this.props.tenant_profile.tenant_id) {
			// this.props.triggerForcedSigninFavorite({
			// 	building_id: this.state.building.building_id,
			// })
			this.toggleModal(true, 'phone', header)
		} else {
			this.toggleModal(true, 'phone', header)
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
		    'FINGERPRINT': this.props.fingerprint,
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
						{
							this.state.building && !this.state.loading
							?
							<Card fluid raised style={comStyles().building_header}>
								<div style={comStyles().welcome_banner}>
									<h1 style={comStyles().welcome_message}>{this.state.building.building_alias}, Waterloo</h1>
									{
										this.state.building.label
										?
										<div onClick={() => this.showMessagePopup('Apply Now')} style={comStyles().welcome_ribbon}>
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
							:
							<Segment style={comStyles().loadingContainer}>
								<Dimmer active inverted>
									<Loader inverted />
								</Dimmer>
							</Segment>
						}
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
						{
							this.state.tours && this.state.tours.length > 0
							?
							<div style={comStyles().analyticsSummary} >
								<BuildingToursContainer
									building={this.state.building}
									tours={this.state.tours}
								/>
							</div>
							:
							null
						}

					</div>
					<div style={comStyles().content_right} >
						{
							this.state.building && !this.state.loading
							?
							<ApplyBox
								building={this.state.building}
								all_suites={this.state.suites}
								toggleTemporaryCollectionFrom={() => this.toggleModal(true, 'collection')}
								togglePhoneCallForm={(e) => this.showMessagePopup(e)}
								sublets={this.state.sublets}
							/>
							:
							<Segment style={comStyles().loadingContainer}>
								<Dimmer active inverted>
									<Loader inverted />
								</Dimmer>
							</Segment>
						}
						{
							this.state.responsivenessStats && (parseInt(this.state.responsivenessStats.avg_time) || parseInt(this.state.responsivenessStats.last_active) || parseInt(this.state.responsivenessStats.percent_responded)) && this.state.mapped_landlord && this.state.mapped_landlord.corporation_name && this.state.mapped_landlord.corporation_name.toLowerCase().indexOf('rentburrow') === -1
							?
							<LandlordResponsiveness
								avg_time={parseInt(this.state.responsivenessStats.avg_time)}
								last_active={parseInt(this.state.responsivenessStats.last_active)}
								percent_responded={parseInt(this.state.responsivenessStats.percent_responded)}
							/>
							:
							null
						}
						{
							this.state.building.building_id
							?
							<BuildingViews
								building={this.state.building}
							/>
							:
							null
						}
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
						this.state.building && !this.state.loading
						?
						<HomeOverview
							building={this.state.building}
							suites={this.state.suites}
							promise_array_of_suite_amenities_with_id={this.state.promise_array_of_suite_amenities_with_id}
							toggleTemporaryCollectionFrom={() => this.toggleModal(true, 'collection')}
						/>
						:
						<Segment style={comStyles().loadingContainer}>
							<Dimmer active inverted>
								<Loader inverted />
							</Dimmer>
						</Segment>
					}
				</div>
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
	authenticated: PropTypes.bool.isRequired,
	selectBuilding: PropTypes.func.isRequired,
	selectCorporation: PropTypes.func.isRequired,
	selectChatThread: PropTypes.func.isRequired,
	tenant_profile: PropTypes.object.isRequired,
	selected_landlord: PropTypes.object.isRequired,
  collectIntel: PropTypes.func.isRequired,
  tenant_profile: PropTypes.object.isRequired,
  fingerprint: PropTypes.string.isRequired,
	triggerForcedSigninFavorite: PropTypes.func.isRequired,
	changeHTMLTitle: PropTypes.func.isRequired,
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
		authenticated: redux.auth.authenticated,
		tenant_profile: redux.auth.tenant_profile,
		selected_landlord: redux.selection.selected_landlord,
    fingerprint: redux.auth.browser_fingerprint,
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
		selectBuilding,
		selectChatThread,
		selectCorporation,
		collectIntel,
		triggerForcedSigninFavorite,
		changeHTMLTitle,
	})(RadiumHOC)
)

// ===============================

// the JS function that returns Radium JS styling
const loadStyles = (img) => {
	return {
		cover_photo: {
			minHeight: '70vh',
			maxHeight: 'auto',
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
			margin: '10px 0px 10px 0px'
		},
		loadingContainer: {
			minHeight: '270px',
      maxHeight: '270px',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
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
