// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
  Item,
  Icon,
  Card,
  Button,
} from 'semantic-ui-react'
import SingularImageGallery from '../image/SingularImageGallery'
import { AMENITY_INTERACTIONS, IMAGE_INTERACTIONS } from '../../api/intel/dynamodb_tablenames'
import { collectIntel } from '../../actions/intel/intel_actions'


class AmenityBrowser extends Component {

  constructor() {
    super()
    this.state = {
      current_amenity: {},
    }
  }

  componentWillMount() {
    if (this.props.amenities.length > 0) {
      const amenitiesWithImages = this.props.amenities.filter((am) => {
        return am.imgs[0]
      })
      const amenitiesWithoutImages = this.props.amenities.filter((am) => {
        return !am.imgs[0]
      })
      const orderedAmenities = amenitiesWithImages.concat(amenitiesWithoutImages)
      this.setState({
        current_amenity: orderedAmenities[0]
      })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // console.log(this.props.amenities)
    if (prevProps && (prevProps.amenities !== this.props.amenities)) {
      this.setState({
        current_amenity: this.props.amenities[0]
      })
    }
  }

  clickedAmenity(am) {
    this.setState({ current_amenity: am })
    this.props.collectIntel({
      'TableName': AMENITY_INTERACTIONS,
      'Item': {
        'ACTION': this.props.intel_action,
        'DATE': new Date().getTime(),
        'REFERENCE_ID': this.props.intel_id,
        'USER_ID': this.props.tenant_profile.tenant_id || 'NONE',
        'AMENITY': am.amenity_alias,
      }
    })
    this.props.collectIntel({
      // When a user hovers over <BuildingCard> in <HousingPanel> of <HousingPage> in Tenant_Website
      'TableName': IMAGE_INTERACTIONS,
      'Item': {
        'ACTION': 'BUILDING_AMENITY_PHOTO_VIEWED',
        'REFERENCE_ID': this.props.building.building_id,
        'DATE': new Date().getTime(),
        'USER_ID': this.props.tenant_profile.tenant_id || 'NONE',
        'IMAGE_URL': this.state.current_amenity.imgs[0],
      }
    })
  }

	render() {
    const amenitiesWithImages = this.props.amenities.filter((am) => {
      return am.imgs[0]
    })
    const amenitiesWithoutImages = this.props.amenities.filter((am) => {
      return !am.imgs[0]
    })
    const orderedAmenities = amenitiesWithImages.concat(amenitiesWithoutImages)
		return (
			<Card id='AmenityBrowser' className='pretty_scrollbar' style={comStyles().container}>
        <div style={comStyles().box}>
          <div style={comStyles().amen}>
            <div style={comStyles().amentity_title}>
              Amenities
            </div>
            <div className='pretty_scrollbar' style={comStyles().amenitiesGrid}>
              {
                orderedAmenities.map((am, index) => {
                  return (
                    <Item
                      onClick={() => this.clickedAmenity(am)}
                      key={am.amenity_alias || index}
                      style={amenityStyles(this.state.current_amenity, am).amenity}
                    >
                      <Icon name='checkmark' />
                      <Item.Content>
                        <Item.Header>
                          { am.amenity_alias }
                        </Item.Header>
                      </Item.Content>
                    </Item>
                  )
                })
              }
            </div>
          </div>
          {
            this.state.current_amenity.imgs && this.state.current_amenity.imgs.length > 0
            && this.state.current_amenity.imgs[0] !== null
            ?
            <div style={comStyles().imageGallery}>
              <SingularImageGallery
                list_of_images={this.state.current_amenity.imgs}
                image_size='hd'
                intel_action='BUILDING_AMENITY_PHOTO_VIEWED'
                intel_id={this.props.building.building_id}
              />
            </div>
            :
            <div style={comStyles().imageGallery}>
              <Icon
                name='dont'
                size='huge'
                color='blue'
              />
              <h2>No Image Proof</h2>
            </div>
          }
        </div>
      </Card>
		)
	}
}

// defines the types of variables in this.props
AmenityBrowser.propTypes = {
	history: PropTypes.object.isRequired,
  building: PropTypes.object.isRequired,
  amenities: PropTypes.array,
  collectIntel: PropTypes.func.isRequired,
  tenant_profile: PropTypes.object.isRequired,
  intel_action: PropTypes.string.isRequired,    // passed in
  intel_id: PropTypes.string.isRequired,        // passed in
}

// for all optional props, define a default value
AmenityBrowser.defaultProps = {
  amenities: [],
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(AmenityBrowser)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
    tenant_profile: redux.auth.tenant_profile,
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
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      minHeight: '400px',
      width: '100%',
      overflow: 'scroll',
      backgroundColor: 'white',
      padding: '20px',
		},
		amentity_title: {
			fontSize: '2.0rem',
			lineHeight: '2.0rem',
			fontWeight: 'bold',
      display: 'flex',
      flexDirection: 'center',
			padding: '10px',
      width: '100%',
      height: '20%',
      justifyContent: 'center',
		},
    amen: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      minWidth: '40%',
      maxWidth: '40%',
      minHeight: '380px',
      maxHeight: '100%',
    },
    amenitiesGrid: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      flexWrap: 'wrap',
      minWidth: '100%',
      maxWidth: '100%',
      // minHeight: '300px',
      maxHeight: '80%',
      padding: '10px',
      borderRadius: '3px',
      overflowY: 'scroll',
    },
    imageGallery: {
      minWidth: '60%',
      minHeight: '400px',
      // maxHeight: '250px',
      height: 'auto',
      borderRadius: '3px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    box: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
	}
}

const amenityStyles = (current_amenity, this_amenity) => {
  let style = {
    backgroundColor: 'rgba(0,0,0,0)'
  }
  if (current_amenity.amenity_alias === this_amenity.amenity_alias) {
    style = {
      backgroundColor: 'rgba(153,204,255,0.8)',
      borderRadius: '3px'
    }
  }
  return {
		amenity: {
			fontSize: '1.0rem',
			lineHeight: '1.0rem',
			display: 'flex',
			flexDirection: 'row',
      // flexWrap: 'wrap',
      width: '200px',
      cursor: 'pointer',
      padding: '10px',
      ...style,
		},
  }
}
