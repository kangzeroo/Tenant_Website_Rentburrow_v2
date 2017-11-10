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
import SubletDetailed from './SubletDetailed'
import { xGreyText, xBootstrapRed } from '../../styles/base_colors'
import MapComponent from '../map/MapComponent'
import { searchBuildingByPlaceID, searchBuildingByAddress, } from '../../api/search/search_api'
import { aliasToURL, shortenAddress, } from '../../api/general/general_api'
import SingularImageGallery from '../image/SingularImageGallery'

class SubletsList extends Component {

	constructor() {
		super()
		this.state = {
			building: {},
			exists: false
		}
	}

	componentWillMount() {
		const sublet_id_loc = this.props.location.pathname.indexOf('sublet/')
    let place_id = this.props.location.pathname.slice(sublet_id_loc + 7)
    if (place_id[place_id.length - 1] === '/') {
      place_id = place_id.slice(0, -1)
    }
		this.getBuilding(place_id)
	}

	getBuilding(place_id) {
		const geocoder = new google.maps.Geocoder()
		geocoder.geocode({ 'placeId': place_id }, (results, status) => {
			const addr = results[0]
			// console.log(addr)
			let addrObj
			if (addr.address_components.length === 7) {
				addrObj = {
					street_code: addr.address_components[0].long_name,
					street_name: addr.address_components[1].long_name,
					city: addr.address_components[2].long_name,
					province: addr.address_components[4].long_name,
					country: addr.address_components[5].long_name,
					postal_code: addr.address_components[6].long_name,
				}
			} else if (addr.address_components.length === 8) {
				addrObj = {
					street_code: addr.address_components[1].long_name,
					street_name: addr.address_components[2].long_name,
					city: addr.address_components[3].long_name,
					province: addr.address_components[5].long_name,
					country: addr.address_components[6].long_name,
					postal_code: addr.address_components[7].long_name,
				}
			}
			searchBuildingByAddress(addrObj)
			.then((building) => {
				if (building) {
					this.setState({
						building: building,
						exists: true,
					})
				}
				// console.log(this.state.building)
			})
		})
	}

	selectThisBuilding(building) {
    // console.log(`${window.location.origin}/${aliasToURL(building.building_alias)}`)
    window.open(`${window.location.origin}/${aliasToURL(building.building_alias)}`, '_blank')
  }

	viewBuilding() {
		this.selectThisBuilding(this.state.building)
	}

	generateAllImages(sublets) {
		let all_images = []
		sublets.forEach((sublet) => {
			all_images = all_images.concat(JSON.parse(sublet.images))
		})
		return all_images
	}

	render() {
		return (
			<div style={comStyles().container}>
				<div style={comStyles().header_container} >
					<div style={comStyles().header}>
						{
							this.props.sublets.length > 0
							?
							'Sublets Available For ' + shortenAddress(this.props.sublets[0].address)
							:
							'Facebook Sublets'
						}
					</div>
					{
						this.state.exists
						?
						<Button
							primary
							content='View More Building Pictures'
							style={comStyles().view_button}
							onClick={() => this.viewBuilding()}
						/>
						:
						null
					}
				</div>
				{
					this.props.sublets.length > 0
					?
					<div style={comStyles().map_image_row}>
						<div style={comStyles().map_gallery}>
							<MapComponent
								listOfResults={this.props.sublets}
								selected_pin={this.props.sublets[0].post_id}
								CSS_mapWidth='100%'
								CSS_mapHeight='300px'
							/>
						</div>
						<div onClick={() => this.props.openImages(this.generateAllImages(this.props.sublets))} style={comStyles().image_gallery}>
							<SingularImageGallery
		            list_of_images={this.generateAllImages(this.props.sublets)}
		            image_size='none'
		          />
						</div>
					</div>
					:
					null
				}
				<div style={comStyles().scroll}>
					{
						this.props.sublets.sort((a, b) => {
		          return b.posted_date - a.posted_date
		        }).map((sublet) => {
							return (
								<SubletDetailed
									key={sublet.post_id}
									sublet={sublet}
								/>
							)
						})
					}
				</div>
			</div>
		)
	}
}

// defines the types of variables in this.props
SubletsList.propTypes = {
	history: PropTypes.object.isRequired,
	sublets: PropTypes.array,		// passed in
	location: PropTypes.object.isRequired,
	openImages: PropTypes.func.isRequired,	// passed in
}

// for all optional props, define a default value
SubletsList.defaultProps = {
	sublets: [],
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(SubletsList)

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
const comStyles = () => {
	return {
		container: {
      display: 'flex',
      flexDirection: 'column',
			maxWidth: '100%',
			minWidth: '100%',
			height: '100%',
			maxHeight: '100%',
			padding: '20px',
		},
		header_container: {
			width: '100%',
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'space-between',
		},
		header: {
			height: '50px',
			width: '100%',
			padding: '10px',
			color: xGreyText,
			display: 'flex',
			flexDirection: 'column',
			fontSize: '2.0rem',
			fontWeight: 'bold',
		},
		title: {
			fontSize: '2.2rem',
			fontWeight: 'bold',
			height: '70%',
		},
		subtitle: {
			fontSize: '1.4rem',
			fontWeight: 'bold',
			height: '30%',
		},
		view_button: {
			width: '200px',
			margin: '0px 0px 20px 0px',
		},
		scroll: {
			overflowY: 'scroll',
      display: 'flex',
      flexDirection: 'column',
		},
		map_image_row: {
      display: 'flex',
      flexDirection: 'row',
			maxHeight: '300px',
			width: '100%',
		},
		map_gallery: {
			minWidth: '50%',
			minHeight: '50%',
			maxWidth: '100%',
			maxHeight: '100%',
		},
		image_gallery: {
			minWidth: '50%',
			minHeight: '50%',
			maxWidth: '100%',
			maxHeight: '100%',
		}
	}
}
