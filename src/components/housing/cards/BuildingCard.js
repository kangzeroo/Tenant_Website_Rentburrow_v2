// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import moment from 'moment'
import { withRouter } from 'react-router-dom'
import {
  Card,
  Icon,
  Label,
} from 'semantic-ui-react'
import {
  aliasToURL,
  shortenAddress,
} from '../../../api/general/general_api'
import FavoriteIcon from '../../tenant/favorites/FavoriteIcon'
import SingularImageGallery from '../../image/SingularImageGallery'
import { selectPinToRedux } from '../../../actions/search/search_actions'
import { collectIntel } from '../../../actions/intel/intel_actions'
import { BUILDING_INTERACTIONS } from '../../../api/intel/dynamodb_tablenames'
import RibbonLabel from '../../instructions/RibbonLabel'
import { check_if_building_accessible } from '../../../api/label/building_label_api'

class BuildingCard extends Component {

  constructor() {
    super()
    this.state = {
      favorited: false,

      new_property: false,
    }
  }

  componentWillMount() {
    if (this.props.favorites && this.props.favorites.tenant_favorites && this.props.favorites.tenant_favorites.length > 0) {
      this.setState({
        favorited: true,
      })
    } else if (this.props.favorites && this.props.favorites.favorites_loaded) {
      this.setState({
        favorited: true,
      })
    }
    if (moment(this.props.building.created_at).diff(moment(), 'days') >= -30) {
      this.setState({
        new_property: true,
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.favorites !== nextProps.favorites) {
			this.setState({
        favorited: true,
      })
		}
  }

  selectThisBuilding(building) {
    if (check_if_building_accessible(building.label)) {
      window.open(`${window.location.origin}/${aliasToURL(building.building_alias)}`, '_blank')
    } else {
      // do nothing
    }
    this.props.collectIntel({
      'TableName': BUILDING_INTERACTIONS,
      'Item': {
        'ACTION': 'BUILDING_CARD_CLICKED',
        'DATE': new Date().getTime(),
        'BUILDING_ID': building.building_id,
        'ADDRESS': building.building_address,
        'USER_ID': this.props.tenant_profile.tenant_id || 'NONE',
        'CORP_ID': building.corporation_id,
        'FINGERPRINT': this.props.fingerprint,
      }
    })
    // console.log(`${window.location.origin}/${aliasToURL(building.building_alias)}`)
  }

  cardOnHover(building) {
    this.props.selectPinToRedux(building.building_id)
    this.props.collectIntel({
      'TableName': BUILDING_INTERACTIONS,
      'Item': {
        'ACTION': 'BUILDING_CARD_HOVER',
        'DATE': new Date().getTime(),
        'BUILDING_ID': building.building_id,
        'ADDRESS': building.building_address,
        'USER_ID': this.props.tenant_profile.tenant_id || 'NONE',
        'CORP_ID': building.corporation_id,
        'FINGERPRINT': this.props.fingerprint,
      }
    })
  }

	render() {
		return (
      <Card
        id='BuildingCard'
        onClick={() => this.selectThisBuilding(this.props.building)}
        raised
        onMouseEnter={() => this.cardOnHover(this.props.building)}
        style={comStyles(this.props.building.label).hardCard}
      >
        {/*<Image src={renderProcessedThumbnail(this.props.building.thumbnail)} />*/}
        <div style={comStyles().imageGallery}>
          {
            this.state.favorited
            ?
            <FavoriteIcon fav_type='building' building={this.props.building} />
            :
            null
          }
          <SingularImageGallery
            list_of_images={[this.props.building.thumbnail].concat(this.props.building.imgs)}
            image_size='thumbnail'
          />
        </div>
        <Card.Content style={comStyles().info}>
          <div style={comStyles().details}>
            <Card.Header style={comStyles().headerPrint}>
              <h1 style={comStyles().address}>{ this.props.building.building_alias ? this.props.building.building_alias : shortenAddress(this.props.building.building_address) }</h1>
            </Card.Header>
            <Card.Description style={comStyles().more_info}>
              {
                this.props.building.min_price && this.props.building.max_price
                ?
                <div style={comStyles().price}>
                  {
                    this.props.building.min_price === this.props.building.max_price
                    ?
                    `Rooms from $${this.props.building.min_price}`
                    :
                    `Rooms from $${this.props.building.min_price} to $${this.props.building.max_price}`
                  }
                </div>
                :
                'Inquire Price'
              }
            </Card.Description>
          </div>
          {
            this.props.building.label !== null && this.props.building.label !== ''
            ?
            <div style={comStyles().ribbon}>
              <RibbonLabel label={this.props.building.label} />
            </div>
            :
            null
          }
        </Card.Content>
        <Card.Content extra style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <a style={comStyles().bedContainer}>
            <Icon name='bed' />
            {
              this.props.building.min_rooms && this.props.building.max_rooms
              ?
              <div>
                {
                  this.props.building.min_rooms === this.props.building.max_rooms
                  ?
                  `${this.props.building.min_rooms} Bed${this.props.building.min_rooms === 1 ? '' : 's'}`
                  :
                  `${this.props.building.min_rooms} to ${this.props.building.max_rooms} Beds`
                }
              </div>
              :
              'Inquire Rooms'
            }
          </a>
          {
            this.state.new_property
            ?
            <Label color='orange' style={{ position: 'absolute', right: '5px' }}>
              NEW
            </Label>
            :
            null
          }
        </Card.Content>
      </Card>
		)
	}
}

// defines the types of variables in this.props
BuildingCard.propTypes = {
	history: PropTypes.object.isRequired,
  building: PropTypes.object.isRequired,    // passed in
  favorites: PropTypes.object.isRequired,
  selectPinToRedux: PropTypes.func.isRequired,
  collectIntel: PropTypes.func.isRequired,
  fingerprint: PropTypes.string.isRequired,
  tenant_profile: PropTypes.object.isRequired,
}

// for all optional props, define a default value
BuildingCard.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(BuildingCard)

// Get access to state from the Redux store
function mapReduxToProps(redux) {
	return {
    tenant_profile: redux.auth.tenant_profile,
    fingerprint: redux.auth.browser_fingerprint,
    favorites: redux.favorites,
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
    selectPinToRedux,
    collectIntel,
	})(RadiumHOC)
)

// ===============================

// the JS function that returns Radium JS styling
const comStyles = (label) => {
  let opacityStyles = {}
  if (!check_if_building_accessible(label)) {
    opacityStyles.opacity = 0.5
  }
	return {
    hardCard: {
      minWidth: '310px',
      maxWidth: 'auto',
      minHeight: '270px',
      maxHeight: '270px',
      margin: '10px auto',
      ...opacityStyles,
      fontFamily: 'Helvetica Neue',
    },
    info: {
      backgroundColor: 'rgba(0,0,0,0)',
      display: 'flex',
      flexDirection: 'row',
      // padding: '30px 10px 10px 10px',
    },
    details: {
      color: 'black',
      display: 'flex',
      flexDirection: 'column',
      width: '90%',
    },
    ribbon: {
      display: 'flex',
      flexDirection: 'column',
      width: '10%',
    },
    imageGallery: {
      height: '170px'
    },
    address: {
      width: '70%',
      display: 'flex',
      flexWrap: 'wrap',
      fontSize: '1.3rem',
    },
    price: {
      width: '100%',
    },
    more_info: {
      display: 'flex',
      flexDirection: 'row',
    },
    headerPrint: {
      fontSize: '1rem',
    },
    bedContainer: {
      display: 'flex',
      flexDirection: 'row',
    }
	}
}
