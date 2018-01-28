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
import SingularImageGallery from '../../image/SingularImageGallery'
import FavoriteIcon from '../../tenant/favorites/FavoriteIcon'
import { xGreyText, xBootstrapRed } from '../../../styles/base_colors'
import { BUILDING_INTERACTIONS } from '../../../api/intel/dynamodb_tablenames'
import { collectIntel } from '../../../actions/intel/intel_actions'


class BuildingOverviewRow extends Component {

  exploreProperty(building) {
    this.props.toggleModal(true, 'building', building)
    this.props.collectIntel({
      'TableName': BUILDING_INTERACTIONS,
      'Item': {
        'ACTION': 'EXPLORE_BUILDING_BUTTON_CLICKED',
        'DATE': new Date().getTime(),
        'BUILDING_ID': building.building_id,
        'ADDRESS': building.building_address,
        'USER_ID': this.props.tenant_profile.tenant_id || 'NONE',
        'FINGERPRINT': this.props.fingerprint,
      }
    })
  }

	render() {
    const building = this.props.building
		return (
      <Card
        id='BuildingOverviewRow'
        key={building.building_id}
        raised
        style={comStyles().hardCard}
      >
        <FavoriteIcon fav_type='building' size='big' building={this.props.building} />
        <div style={comStyles().left} >
          <div id='infobar' style={comStyles().left_top} >
            <div>{building.building_alias}</div>
            <div>Common Areas</div>
          </div>
          <div style={comStyles().left_bottom}>
            <Button
              fluid
              onClick={() => this.exploreProperty(building)}
              color='blue'
              content='Explore Property'
              icon='building'
              style={comStyles().explore_button}
            />
          </div>
        </div>

        <div style={comStyles().center} >
          <div style={comStyles().ImageGallery} >
            <SingularImageGallery
              list_of_images={building.imgs}
              image_size='hd'
              intel_action='BUILDING_COMMON_AREA_PHOTO_VIEWED'
              intel_id={building.building_id}
            />
          </div>
        </div>
      </Card>
		)
	}
}

// defines the types of variables in this.props
BuildingOverviewRow.propTypes = {
	history: PropTypes.object.isRequired,
  building: PropTypes.object.isRequired,    // passed in
  toggleModal: PropTypes.func.isRequired,   // passed in
  collectIntel: PropTypes.func.isRequired,
  tenant_profile: PropTypes.object.isRequired,
  fingerprint: PropTypes.string.isRequired,
}

// for all optional props, define a default value
BuildingOverviewRow.defaultProps = {
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(BuildingOverviewRow)

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

// ================================

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
      margin: '10px auto',
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
      justifyContent: 'space-between',
    },
		left_top: {
			height: '85%',
			width: '100%',
			color: xGreyText,
			fontSize: '2.2rem',
			fontWeight: 'bold',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
			textAlign: 'center',
			padding: '15px',
			lineHeight: '35px',
		},
		left_bottom: {
			height: 'auto',
		},
		explore_button: {
			height: '100%',
			width: '100%',
			fontSize: '1.8rem',
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
