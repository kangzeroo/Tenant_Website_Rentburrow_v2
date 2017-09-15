// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
  Icon,
} from 'semantic-ui-react'
import {
  getSuiteInfo,
  getAmenitiesForSuite,
  getRoomPage,
  getRoomsForSuite,
  getRoomAmenities,
} from '../../../api/building/building_api'
import SingularImageGallery from '../../image/SingularImageGallery'
import ImageGallery from '../../image/ImageGallery'
import { calculateComplexSuiteBaths, calculateRoomsSummary, calculateSuiteCommonAreasSummary, calculateFreeUtilitiesForSuite, } from '../../../api/amenities/amenity_calculations'


class SuiteCommonAreaCanvas extends Component {

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

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.suite.suite_id !== this.props.suite.suite_id) {
      this.summarizeSuite()
    }
  }

  summarizeSuite() {
    // summarize the amenities for this suite, such as the bathrooms and common areas
    getAmenitiesForSuite({
      building_id: this.props.building.building_id,
      suite_id: this.props.suite.suite_id,
    }).then((data) => {
      const suite_amenities = data.map((am) => {
        return JSON.parse(am)
      })
      this.setState({
        suite_amenities: suite_amenities,
        common_areas_summary: calculateSuiteCommonAreasSummary(suite_amenities),
        baths_summary: calculateComplexSuiteBaths(this.props.suite, data.map((am) => {
          return JSON.parse(am)
        })),
        free_utilities_summary: calculateFreeUtilitiesForSuite(suite_amenities),
      })
    })
    // summarize the rooms and their amenities, details such as price and room amenities
    getRoomsForSuite({
      building_id: this.props.building.building_id,
      suite_id: this.props.suite.suite_id,
    }).then((data) => {
      const rooms = data.map((r) => {
        return JSON.parse(r)
      })
      const promises = rooms.map((room) => {
        let getRoomPage_results
        let getRoomAmenities_results
        return getRoomPage({
    			building_id: this.props.building.building_id,
    			suite_id: this.props.suite.suite_id,
    			room_id: room.room_id,
        })
        .then((data) => {
          getRoomPage_results = data.map(result => JSON.parse(result))[0]
          return getRoomAmenities({
      			building_id: this.props.building.building_id,
      			suite_id: this.props.suite.suite_id,
      			room_id: room.room_id,
      		})
        }).then((data) => {
          getRoomAmenities_results = data.map((am) => {
            return JSON.parse(am)
          })
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

	createMarkup(string) {
		return {
			__html: string,
		}
	}

  generateBathsSummary() {
    return (<div style={comStyles().baths_summary}>
      {
        this.state.baths_summary.full_baths > 0 || this.state.baths_summary.half_baths > 0 || this.state.baths_summary.shared_baths > 0
        ?
        <h1>Common Area Bathrooms:</h1>
        :
        null
      }
      {
        this.state.baths_summary.full_baths > 0
        ?
        <h2>{`${this.state.baths_summary.full_baths} full bathroom${this.state.baths_summary.full_baths > 0 ? 's' : ''}`}</h2>
        :
        null
      }
      {
        this.state.baths_summary.half_baths > 0
        ?
        <h2>{`${this.state.baths_summary.half_baths} half bathroom${this.state.baths_summary.half_baths > 0 ? 's' : ''}`}</h2>
        :
        null
      }
      {
        this.state.baths_summary.shared_baths > 0
        ?
        <h2>{`${this.state.baths_summary.shared_baths} suite bathroom${this.state.shared_baths.shared_baths > 0 ? 's' : ''} shared with a bedroom`}</h2>
        :
        null
      }
    </div>)
  }

  generateBedsSummary() {
    return (
      <div style={comStyles().rooms_summary}>
        {
          this.state.rooms_summary.total_rooms
          ?
          <h1>Bedrooms:</h1>
          :
          null
        }
        {
          this.state.rooms_summary.total_rooms
          ?
          <h2>
            { `${this.state.rooms_summary.total_rooms} total rooms` }
            { this.state.rooms_summary.total_ensuite_baths > 0 ? ` with ${this.state.rooms_summary.total_ensuite_baths} ensuite baths` : null }
          </h2>
          :
          null
        }
        {
          this.state.rooms_summary.standard_price
          ?
          <h2>{ `$${this.state.rooms_summary.standard_price} per room` }</h2>
          :
          <h2>{ `$${this.state.rooms_summary.min_price} to $${this.state.rooms_summary.max_price} per room` }</h2>
        }
      </div>
    )
  }

  generateSuiteCommonAreasSummary() {
    return (
      <div style={comStyles().common_areas_summary}>
        {
          this.state.common_areas_summary.kitchen
          ?
          <h2>{ `${this.state.common_areas_summary.kitchen} Kitchen${this.state.common_areas_summary.kitchen > 0 ? 's' : ''}` }</h2>
          :
          null
        }
        {
          this.state.common_areas_summary.living_room
          ?
          <h2>{ `${this.state.common_areas_summary.living_room} Living Room${this.state.common_areas_summary.living_room > 0 ? 's' : ''}` }</h2>
          :
          null
        }
        {
          this.state.common_areas_summary.study_den
          ?
          <h2>{ `${this.state.common_areas_summary.study_den} Study Den${this.state.common_areas_summary.study_den > 0 ? 's' : ''}` }</h2>
          :
          null
        }
        {
          this.state.common_areas_summary.patio
          ?
          <h2>{ `${this.state.common_areas_summary.patio} Patio${this.state.common_areas_summary.patio > 0 ? 's' : ''}` }</h2>
          :
          null
        }
        {
          this.state.common_areas_summary.balcony
          ?
          <h2>{ `${this.state.common_areas_summary.balcony} Balcon${this.state.common_areas_summary.balcony > 0 ? 'ies' : 'y'}` }</h2>
          :
          null
        }
        {
          this.state.common_areas_summary.spare_rooms
          ?
          <h2>{ `${this.state.common_areas_summary.spare_rooms} Spare Room${this.state.common_areas_summary.spare_rooms > 0 ? 's' : ''}` }</h2>
          :
          null
        }
        {
          this.state.common_areas_summary.common_storage_closets
          ?
          <h2>{ `${this.state.common_areas_summary.common_storage_closets} Storage Closet${this.state.common_areas_summary.common_storage_closets > 0 ? 's' : ''}` }</h2>
          :
          null
        }
      </div>
    )
  }

  generateFreeUtilities() {
    return (
      <div style={comStyles().free_utilities_summary}>
        {
          this.state.free_utilities_summary.electric
          ?
          <h3>Electricity (hydro) included</h3>
          :
          <h3>Electricity (hydro) costs seperate</h3>
        }
        {
          this.state.free_utilities_summary.water
          ?
          <h3>Water included</h3>
          :
          <h3>Water costs seperate</h3>
        }
        {
          this.state.free_utilities_summary.heating
          ?
          <h3>Heating included</h3>
          :
          <h3>Heating costs seperate</h3>
        }
        {
          this.state.free_utilities_summary.internet
          ?
          <h3>Internet included</h3>
          :
          <h3>Interet cost seperate</h3>
        }
      </div>
    )
  }

	render() {
		return (
			<div style={comStyles().container}>
        <div id='containImage' style={comStyles().containImage}>
  				<SingularImageGallery
  					list_of_images={
  						this.props.images.map((img) => {
                return img.image_url
              })
  					}
  					image_size='hd'
  				/>
          <div style={comStyles().infoBanner}>
				    <h1>{ `${this.props.suite.suite_alias} Unit` || `Unit ${this.props.suite.suite_code}` }</h1>
          </div>
          <div style={comStyles().scrollDown}>
            <Icon name='double angle down' size='huge' />
            <p>Scroll Down</p>
          </div>
        </div>
        <div style={comStyles().summarization}>
          <div style={comStyles().desc_upper}>
    				<div
    					dangerouslySetInnerHTML={this.createMarkup(this.props.suite.suite_desc)}
    					style={comStyles().textMarkup}
    				/>
          </div>
          <div style={comStyles().stats_lower}>
            {
              this.generateBedsSummary()
            }
            {
              this.generateBathsSummary()
            }
            {
              this.generateSuiteCommonAreasSummary()
            }
            {
              this.generateFreeUtilities()
            }
          </div>
        </div>
			</div>
		)
	}
}

// defines the types of variables in this.props
SuiteCommonAreaCanvas.propTypes = {
	history: PropTypes.object.isRequired,
	images: PropTypes.array.isRequired,	// passed in
	building: PropTypes.object.isRequired,						// passed in
  suite: PropTypes.object.isRequired,             // passed in
}

// for all optional props, define a default value
SuiteCommonAreaCanvas.defaultProps = {
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(SuiteCommonAreaCanvas)

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
		},
    containImage: {
      height: 'auto',
      position: 'relative',
    },
    infoBanner: {
      position: 'absolute',
      bottom: '50px',
      left: '0px',
      width: 'auto',
      padding: '20px',
      backgroundColor: 'rgba(0,0,0,0.5)',
      color: 'white',
    },
    scrollDown: {
      position: 'absolute',
      bottom: '10px',
      right: '50%',
      width: 'auto',
      color: 'white',
    },
		bar: {
			display: 'flex',
			flexDirection: 'row',
		},
		textMarkup: {
			fontSize: '1rem',
			lineHeight: '2rem',
		},
    summarization: {
      display: 'flex',
      flexDirection: 'column',
    },
    desc_upper: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      minHeight: '100px',
    },
    stats_lower: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
    },
    baths_summary: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      border: '1px solid black',
    },
    rooms_summary: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      border: '1px solid black',
    },
    common_areas_summary: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      border: '1px solid black',
    },
    free_utilities_summary: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      border: '1px solid black',
    }
	}
}
