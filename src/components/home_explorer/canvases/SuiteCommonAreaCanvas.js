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
import SuiteBathSummary from './summary/SuiteBathSummary'
import SuiteBedSummary from './summary/SuiteBedSummary'
import SuiteCommonAreaSummary from './summary/SuiteCommonAreaSummary'
import SuiteFreeUtilitiesSummary from './summary/SuiteFreeUtilitiesSummary'


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
    return (<SuiteBathSummary baths_summary={this.state.baths_summary}/>)
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
      padding: '20px',
    },
    desc_upper: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      minHeight: '100px',
      justifyContent: 'center',
      textAlign: 'center',
      alignItems: 'center',
      padding: '20px',
    },
    stats_lower: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      height: 'auto',
      minHeight: '600px',
      padding: '20px',
    },
	}
}
