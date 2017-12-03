// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
  Header,
  Image,
  Card,
  Button,
  Modal,
  Segment,
  Dimmer,
  Loader,
} from 'semantic-ui-react'
import {
	URLToAlias,
	renderProcessedImage,
	shortenAddress,
	renderProcessedThumbnail,
} from '../../../../api/general/general_api'
import {
  searchForSpecificBuildingByAlias,
  getSpecificLandlord,
} from '../../../../api/search/search_api'
import {
	getAmenitiesForSpecificBuilding,
	getImagesForSpecificBuilding,
	getAvailableSuites,
	getAmenitiesForSuite,
} from '../../../../api/building/building_api'
import {
  calculateComplexSuiteBaths,
  calculateRoomsSummary,
  calculateSuiteCommonAreasSummary,
  calculateFreeUtilitiesForSuite,
} from '../../../../api/amenities/amenity_calculations'
import SingularImageGallery from '../../../image/SingularImageGallery'
import MapComponent from '../../../map/MapComponent'
import MobileBuildingInfo from '../cards/MobileBuildingInfo'

class MobileBuildingPage extends Component {

  constructor() {
    super()
    this.state = {
      building: {},
      images: [],
      amenities: [],

      toggle_virtual_tour: false,

      suites: [],
			promise_array_of_suite_amenities_with_id: [],

      toggle_modal: false,
      modal_name: '',
      context: {},

      loading: false,
    }
  }

  componentWillMount() {
    let building_alias = URLToAlias(this.props.location.pathname)
    if (building_alias[building_alias.length - 1] === '/') {
      building_alias = building_alias.slice(0, -1)
    }
    this.setState({
      loading: true,
    })

    searchForSpecificBuildingByAlias(building_alias)
    .then((data) => {
      this.setState({
        building:data,
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
      const arrayOfPromises = suites.map((suite) => {
        return getAmenitiesForSuite({
          building_id: this.state.building.building_id,
          suite_id: suite.suite_id,
        })
        .then((data) => {
          return Promise.resolve({
            ...suite,
            amenities: data,
            baths_summary: calculateComplexSuiteBaths(suite, data),
            free_utilities_summary: calculateFreeUtilitiesForSuite(data),
          })
        })
      })

      Promise.all(arrayOfPromises)
      .then((data) => {
        this.setState({
          suites: data,
          loading: false,
        })
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
		if (modal_name === 'apply') {
	    return (
	      <Modal
					dimmer
					open={this.state.toggle_modal}
					onClose={() => this.toggleModal(false)}
					closeIcon
					size='large'
				>
	        <Modal.Content>
						<Header
              as='h1'
              content='We are currently working on our Applications for Mobile'
            />
            <Header
              as='h1'
              content='Please Apply on your laptop using Chroms'
            />
	        </Modal.Content>
	      </Modal>
	    )
		} else if (modal_name === 'more_info') {
	    return (
	      <Modal
					dimmer
					open={this.state.toggle_modal}
					onClose={() => this.toggleModal(false)}
					closeIcon
					size='large'
				>
	        <Modal.Content>
						<MobileBuildingInfo
              description={this.state.building.building_desc}
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

  renderHeader() {
    return (
      <Card fluid raised style={comStyles().headerContainer} >
      {
        this.state.loading
        ?
        <Dimmer active inverted>
          <Loader inverted content='Loading' />
        </Dimmer>
        :
        <div>
          {
            parseInt(this.state.building.min_rooms, 10) === parseInt(this.state.building.max_rooms, 10)
            ?
            <Header
              as='h1'
              content={`${this.state.building.min_rooms} Bedroom Suites`}
              subheader={this.state.building.building_address}
              style={comStyles().headerText}
              size='huge'
            />
            :
            <Header
              as='h1'
              content={`${this.state.building.min_rooms} - ${this.state.building.max_rooms} Bedroom Suites`}
              subheader={this.state.building.building_address}
              style={comStyles().headerText}
              size='huge'
            />
          }
          {
            <Button
              primary
              basic
              content='Show More Info'
              size='huge'
              onClick={() => this.toggleModal(true, 'more_info')}
            />
          }
        </div>
      }
      </Card>
    )
  }

  renderApplyBox() {
    return (
      <Card raised fluid style={comStyles().applyBox}>
        {
          this.state.loading
          ?
          <Dimmer active inverted>
            <Loader inverted content='Loading' />
          </Dimmer>
          :
          <div>
          {
            parseInt(this.state.building.min_price, 10) === parseInt(this.state.building.max_price, 10)
            ?
            <Header
              as='h1'
              content={`Rooms from $${this.state.building.min_price} per month`}
              style={comStyles().headerText}
            />
            :
            <Header
              as='h1'
              content={`Rooms from $${this.state.building.min_price} to $${this.state.building.max_price} per month`}
              style={comStyles().headerText}
            />
          }
          </div>
        }
        <Button
          primary
          content='Apply Now'
          size='huge'
          onClick={() => this.toggleModal(true, 'apply')}
        />
      </Card>
    )
  }

  renderMapComponent() {
    return (
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
    )
  }

  renderBuildingPhotos() {
    return (
      <Card raised fluid style={comStyles().imagesContainer} >
        <Header
          content={`${this.state.building.building_alias} Common Areas`}
          size='huge'
        />
        <SingularImageGallery
          list_of_images={[this.state.building.cover_photo].concat(this.state.building.imgs)}
          image_size='hd'
        />
      </Card>
    )
  }

  renderSuitePhotos() {
    return (
      <div>
        {
          this.state.suites.map((suite) => {
            return (
              <Card key={suite.suite_id} raised fluid style={comStyles().imagesContainer} >
                <div style={comStyles().suitePhotosHeader}>
                  <Header
                    as='h1'
                    content={`${suite.suite_alias}`}
                    size='huge'
                  />
                  {
                    suite.min_price === suite.max_price
                    ?
                    <Header
                      as='h1'
                      content={`$${suite.min_price} per room`}
                      size='huge'
                    />
                    :
                    <Header
                      as='h1'
                      content={`$${suite.min_price} - ${suite.max_price} per room`}
                      size='huge'
                    />
                  }
                </div>
                <div style={comStyles().suitePhotosHeader}>
                  <Header
                    as='h1'
                    icon='bed'
                    content={`${suite.available} Bedrooms`}
                    size='huge'
                  />
                  {
          					suite.baths_summary.full_baths > 0
          					?
                    <Header
                      as='h1'
                      icon='bath'
                      content={`${suite.baths_summary.full_baths} Full Baths`}
                      size='huge'
                    />
          					:
          					null
          				}
                  {
          					suite.baths_summary.half_baths > 0
          					?
                    <Header
                      as='h1'
                      icon='bath'
                      content={`${suite.baths_summary.half_baths} Half Baths`}
                      size='huge'
                    />
          					:
          					null
          				}
                  {
          					suite.baths_summary.shared_baths > 0
          					?
                    <Header
                      as='h1'
                      icon='bath'
                      content={`${suite.baths_summary.shared_baths} Shared Baths`}
                      size='huge'
                    />
          					:
          					null
          				}
                </div>
                <SingularImageGallery
                  list_of_images={[suite.cover_photo].concat(suite.imgs)}
                  image_size='hd'
                />
              </Card>
            )
          })
        }
      </div>
    )
  }

	render() {
		return (
			<div id='MobileBuildingPage' style={comStyles().container}>
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
          {
            this.renderHeader()
          }
          {
            this.renderApplyBox()
          }
          {
            this.renderBuildingPhotos()
          }
          {
            this.renderSuitePhotos()
          }
          {
            this.renderMapComponent()
          }
          {
            this.renderAppropriateModal(this.state.modal_name, this.state.context)
          }
			</div>
		)
	}
}

// defines the types of variables in this.props
MobileBuildingPage.propTypes = {
	history: PropTypes.object.isRequired,
}

// for all optional props, define a default value
MobileBuildingPage.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(MobileBuildingPage)

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
const loadStyles = (img) => {
	return {
		cover_photo: {
			minHeight: '50vh',
			maxHeight: '80vh',
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
      justifyContent: 'center',
      alignItems: 'center',
      width: '100vw',
      height: '100%',
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
    imagesContainer: {
      minWidth: '100%',
      maxWidth: '100%',
      minHeight: 'auto',
      maxHeight: 'auto',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '10px',
    },
    headerContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '70px',
      maxHeight: 'auto',
      minWidth: '90%',
      maxWidth: '90%',
      margin: '20px',
      padding: '10px',
    },
    headerText: {
      fontSize: '2.8rem',
    },
    mapContainer: {
			display: 'flex',
			flexDirection: 'column',
			height: '400px',
		},
		map: {
			width: '100%',
			height: '350px',
		},
		addressFont: {
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			fontSize: '1.5rem',
			fontWeight: 'bold',
			margin: '20px 0px 0px 0px'
		},
    applyBox: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100px',
      maxHeight: 'auto',
      minWidth: '80%',
      maxWidth: '80%',
      padding: '20px',
    },
    suitePhotosHeader: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      width: '100%',
    },
	}
}
