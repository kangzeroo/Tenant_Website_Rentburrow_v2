// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
  Card,
  Button,
} from 'semantic-ui-react'
import {
  getSuiteInfo,
  getAmenitiesForSuite,
  getRoomPage,
  getRoomsForSuite,
  getRoomAmenities,
} from '../../../api/building/building_api'
import FavoriteIcon from '../../tenant/favorites/FavoriteIcon'
import SingularImageGallery from '../../image/SingularImageGallery'
import { xGreyText, xBootstrapRed } from '../../../styles/base_colors'
import { calculateComplexSuiteBaths, calculateRoomsSummary, calculateSuiteCommonAreasSummary, calculateFreeUtilitiesForSuite, } from '../../../api/amenities/amenity_calculations'
import SuiteBathSummary from '../../home_explorer/canvases/summary/SuiteBathSummary'
import SuiteBedSummary from '../../home_explorer/canvases/summary/SuiteBedSummary'
import SuiteCommonAreaSummary from '../../home_explorer/canvases/summary/SuiteCommonAreaSummary'
import SuiteFreeUtilitiesSummary from '../../home_explorer/canvases/summary/SuiteFreeUtilitiesSummary'
import { renameSuite } from '../../../api/general/renaming_api'
import { collectIntel } from '../../../actions/intel/intel_actions'
import { SUITE_INTERACTIONS } from '../../../api/intel/dynamodb_tablenames'


class SuiteOverviewRow extends Component {

  constructor() {
    super()
    this.state = {
      suite_amenities: [],
      common_areas_summary: {
        kitchen: 0,
        living_room: 0,
        study_den: 0,
        patio: 0,
        balcony: 0,
        ensuite_laundry: false,
        spare_rooms: 0,
        common_storage_closets: 0,
      },
      free_utilities_summary: {
        water: false,
        electric: false,
        heating: false,
        internet: false,
      },
      baths_summary: {
        full_baths: 0,
        half_baths: 0,
        shared_baths: 0,
      },
      rooms_with_amenities: [],
      rooms_summary: {
        total_rooms: 0,
        total_ensuite_baths: 0,
        standard_price: 0,
        min_price: 0,
        max_price: 0,
      },
    }
  }

  componentWillMount() {
    this.summarizeSuite()
  }

  summarizeSuite() {
    // summarize the amenities for this suite, such as the bathrooms and common areas
    getAmenitiesForSuite({
      building_id: this.props.building.building_id,
      suite_id: this.props.suite.suite_id,
    }).then((data) => {
      const suite_amenities = data
      //  data.map((am) => {
      //   return JSON.parse(am)
      // })
      this.setState({
        suite_amenities: suite_amenities,
        common_areas_summary: calculateSuiteCommonAreasSummary(suite_amenities),
        baths_summary: calculateComplexSuiteBaths(this.props.suite, data), //.map((am) => {
        //   return JSON.parse(am)
        // })),
        free_utilities_summary: calculateFreeUtilitiesForSuite(suite_amenities),
      })
    })
    // summarize the rooms and their amenities, details such as price and room amenities
    getRoomsForSuite({
      building_id: this.props.building.building_id,
      suite_id: this.props.suite.suite_id,
    }).then((data) => {
      const rooms = data
      // .map((r) => {
      //   return JSON.parse(r)
      // })
      const promises = rooms.map((room) => {
        let getRoomPage_results
        let getRoomAmenities_results
        return getRoomPage({
    			building_id: this.props.building.building_id,
    			suite_id: this.props.suite.suite_id,
    			room_id: room.room_id,
        })
        .then((data) => {
          getRoomPage_results = data[0] //.map(result => JSON.parse(result))[0]
          return getRoomAmenities({
      			building_id: this.props.building.building_id,
      			suite_id: this.props.suite.suite_id,
      			room_id: room.room_id,
      		})
        }).then((data) => {
          getRoomAmenities_results = data
          // .map((am) => {
            // return JSON.parse(am)
          // })
          return Promise.resolve({
            getRoomPage_results,
            getRoomAmenities_results,
          })
        })
      })
      Promise.all(promises).then((results) => {
        this.setState({
          rooms_with_amenities: results,
          rooms_summary: calculateRoomsSummary(results)
        })
      })
    })
  }

  generateBathsSummary() {
    return (<SuiteBathSummary baths_summary={this.state.baths_summary} />)
  }

  generateBedsSummary() {
    return (
      <SuiteBedSummary rooms_summary={this.state.rooms_summary} />
    )
  }

  generateSuiteCommonAreasSummary() {
    return (
      <SuiteCommonAreaSummary common_areas_summary={this.state.common_areas_summary} />
    )
  }

  generateFreeUtilities() {
    return (
      <SuiteFreeUtilitiesSummary free_utilities_summary={this.state.free_utilities_summary} />
    )
  }

  rowOnHover(suite) {
    this.props.collectIntel({
      'TableName': SUITE_INTERACTIONS,
      'Item': {
        'ACTION': 'SUITE_OVERVIEW_HOVER',
        'DATE': new Date().getTime(),
        'SUITE_ID': suite.suite_id,
        'SUITE_NAME': suite.suite_alias,
        'USER_ID': this.props.tenant_profile.tenant_id || 'NONE',
        'BUILDING_ID': this.props.building.building_id,
        'BUILDING_NAME': this.props.building.building_address,
        'FINGERPRINT': this.props.fingerprint,
      }
    })
  }

  signAndPayOnline(suite) {
    // localStorage.removeItem('leasing_group_id')
    // window.open(`${window.location.origin}/signing/lease/${this.props.building.building_id}`, '_blank')
    this.props.openMessageForm(suite)
    this.props.collectIntel({
      'TableName': SUITE_INTERACTIONS,
      'Item': {
        'ACTION': 'APPLY_NOW_BUTTON_SUITE',
        'DATE': new Date().getTime(),
        'SUITE_ID': suite.suite_id,
        'SUITE_NAME': suite.suite_alias,
        'USER_ID': this.props.tenant_profile.tenant_id || 'NONE',
        'BUILDING_ID': this.props.building.building_id,
        'BUILDING_NAME': this.props.building.building_address,
        'FINGERPRINT': this.props.fingerprint,
      }
    })
  }

  viewVirtualTour(suite) {
    this.props.toggleModal(true, 'suite', suite)
    this.props.collectIntel({
      'TableName': SUITE_INTERACTIONS,
      'Item': {
        'ACTION': 'EXPLORE_SUITE_BUTTON_CLICKED',
        'DATE': new Date().getTime(),
        'SUITE_ID': suite.suite_id,
        'SUITE_NAME': suite.suite_alias,
        'USER_ID': this.props.tenant_profile.tenant_id || 'NONE',
        'BUILDING_ID': this.props.building.building_id,
        'BUILDING_NAME': this.props.building.building_address,
        'FINGERPRINT': this.props.fingerprint,
      }
    })
  }

	render() {
    const suite = this.props.suite
		return (
      <Card
        id='SuiteOverviewRow'
				key={suite.suite_id}
				raised
        onMouseEnter={() => this.rowOnHover(this.props.suite)}
				style={comStyles().hardCard}
			>
				<div style={comStyles().left}>
					<div id='infobar' style={comStyles().left_top} >
						{ renameSuite(suite.suite_alias) }
            <FavoriteIcon fav_type='suite' suite={suite} size='large' building={this.props.building} />
					</div>
					<div id='infobar' style={comStyles().left_middle} >

            {
              this.generateBedsSummary()
            }
            {
              this.generateBathsSummary()
            }
            {
              // this.generateFreeUtilities()
            }
					</div>
					<div style={comStyles().left_bottom}>
            <Button
              onClick={() => this.signAndPayOnline(this.props.suite)}
              color='blue'
              content='Inquire'
              style={comStyles().explore_button}
            />
						<Button
              basic
              icon='slideshare'
							onClick={() => this.viewVirtualTour(suite)}
							color='blue'
							content='Virtual Tour'
							style={comStyles().explore_button}
						/>
					</div>
				</div>

				<div style={comStyles().center} >
					<div style={comStyles().ImageGallery} >
						<SingularImageGallery
							list_of_images={[suite.cover_photo].concat(suite.imgs)}
							image_size='hd'
              intel_action='SUITE_PHOTO_VIEWED'
              intel_id={suite.suite_id}
						/>
					</div>
				</div>
			</Card>
		)
	}
}

// defines the types of variables in this.props
SuiteOverviewRow.propTypes = {
	history: PropTypes.object.isRequired,
  building: PropTypes.object.isRequired,  // passed in
  suite: PropTypes.object.isRequired,    // passed in
  toggleModal: PropTypes.func.isRequired,   // passed in
  openMessageForm: PropTypes.func.isRequired,   // passed in
  collectIntel: PropTypes.func.isRequired,
  fingerprint: PropTypes.string.isRequired,
  tenant_profile: PropTypes.object.isRequired,
  toggleTemporaryCollectionFrom: PropTypes.func.isRequired,     // passed in
}

// for all optional props, define a default value
SuiteOverviewRow.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(SuiteOverviewRow)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
    tenant_profile: redux.auth.tenant_profile,
    fingerprint: redux.auth.browser_fingerprint,
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
    collectIntel,
	})(RadiumHOC)
)

// ===============================

// the JS function that returns Radium JS styling
const comStyles = () => {
	return {
		container: {
			width: '100%',
			height: '100%',
		},
		images_gallery: {
			width: 'auto',
			height: '100%'
		},
		hardCard: {
      width: '100%',
      minHeight: '225px',
      margin: '20px auto',
      display: 'flex',
      flexDirection: 'row',
    },
    info: {
      backgroundColor: 'rgba(0,0,0,0)',
      display: 'flex',
      flexDirection: 'column',
      // padding: '30px 10px 10px 10px',
    },
    more_info: {
      display: 'flex',
      flexDirection: 'row',
    },
    user_container: {
      display: 'flex',
      flexDirection: 'row',
      right: '5px',
      top: '5px',
      position: 'absolute',
      maxHeight: '45px',
      maxWidth: '45px',
      cursor: 'pointer',
    },
		infobar: {
			width: '100%',
			display: '-webkit-box', display: '-webkit-flex', display: 'flexbox', display: 'box', display: 'flex',
			justifyContent: 'flex-start',
			alignItems: 'flex-start',
			WebkitBoxOrient: 'horizontal', WebkitBoxDirection: 'normal', flexDirection: 'row',
			padding: '10px',
      maxHeight: '150px',
		},
		price: {
			fontSize: '2.5rem',
			fontWeight: 'bold',
			color: xGreyText,
		},
		imageTile: {
			position: 'absolute',
			right: '0px',
			margin: '0 auto',
		},
		imageTileIcon: {
			fontSize: '1.7rem',
			margin: '0 auto',
			cursor: 'pointer',
			':hover': {
				color: xBootstrapRed
			}
		},
		iconbar: {
			width: '100%',
			display: '-webkit-box', display: '-webkit-flex', display: 'flexbox', display: 'box', display: 'flex',
			WebkitBoxPack: 'justify', WebkitJustifyContent: 'center', justifyContent: 'center',
			fontSize: '1rem',
			color: xGreyText,
			flexWrap: 'wrap'
		},
		buttonsBar: {
			display: '-webkit-box', display: '-webkit-flex', display: 'flexbox', display: 'box', display: 'flex',
			WebkitBoxPack: 'justify', WebkitJustifyContent: 'center', justifyContent: 'center',
			width: '100%',
			margin: 'auto',
			fontSize: '1.1rem',
			fontWeight: 'bold'
		},
    desc: {
      height: '80%',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
		seeOriginalAhref: {
			flexGrow: 3
		},
		seeOriginal: {
			borderRadius: '0px',
			width: '100%'
		},
		map: {
			borderRadius: '0px',
			flexGrow: 1
		},
		heartIcon: {
			fontSize: '2rem',
			fontWeight: 'bold',
			right: '0px',
			width: '10%',
			color: xBootstrapRed,
			cursor: 'pointer'
		},
		thumbnailBar: {
			display: '-webkit-box', display: '-webkit-flex', display: 'flexbox', display: 'box', display: 'flex',
			WebkitBoxOrient: 'horizontal', WebkitBoxDirection: 'normal', flexDirection: 'row',
			WebkitBoxPack: 'justify', WebkitJustifyContent: 'center', justifyContent: 'center',
			maxHeight: '30px',
			margin: '10px 0px 0px 0px',
			overflowX: 'scroll'
		},
		thumbnail: {
			height: '30px',
			width: 'auto',
			opacity: '0.3',
			':hover': {
				opacity: '1'
			},
		},
		blankPlaceholderImage: {
			height: '30px',
			width: '100%'
		},
    amenity_icon: {
      display: 'flex',
      flexDirection: 'column',
      margin: '10px',
      justifyContent: 'center',
      alignItems: 'center',
    },
    amenity_caption: {
      margin: '5px auto',
    },
		left: {
      width: '40%',
      minHeight: '100%',
      maxHeight: '100%',
      minWidth: '360px',
			padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    },
		left_top: {
			height: 'auto',
			width: '100%',
			color: xGreyText,
			fontSize: '2.2rem',
			fontWeight: 'bold',
			margin: '5px 0px 0px 0px',
			textAlign: 'center',
			padding: '15px',
			lineHeight: '35px',
		},
		left_middle: {
			height: 'auto',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'space-between',
			alignItems: 'space-between',
		},
		left_bottom: {
			height: 'auto',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
		},
		explore_button: {
		// 	height: '100%',
		// 	width: '100%',
			fontSize: '1.5rem',
		},
    center: {
      width: '60%',
      minWidth: '360px',
      minHeight: '100%',
    },
    imageGallery: {
      height: '100%',
      minHeight: '250px',
      maxHeight: '250px',
    },
    right: {
      width: '40%',
      color: xGreyText,
      minHeight: '100%',
      maxHeight: '100%',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      justifyContent: 'center',
      padding: '20px',
      minWidth: '360px',
    },
		ImageGallery: {
			height: '100%',
			maxHeight: '100%',
		}
	}
}
