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
  Image,
  Label,
} from 'semantic-ui-react'
import {
  renderProcessedThumbnail,
  aliasToURL,
  shortenAddress,
} from '../../../api/general/general_api'
import SingularImageGallery from '../../image/SingularImageGallery'
import { selectPinToRedux } from '../../../actions/search/search_actions'
import { collectIntel } from '../../../actions/intel/intel_actions'
import { BUILDING_INTERACTIONS } from '../../../api/intel/dynamodb_tablenames'
import RibbonLabel from '../../instructions/RibbonLabel'

class BuildingCard extends Component {

  selectThisBuilding(building) {
    if (building.label && building.label.toLowerCase().indexOf('sold out') > -1) {
      // do nothing
    } else {
      window.open(`${window.location.origin}/${aliasToURL(building.building_alias)}`, '_blank')
    }
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
        'USER_ID': this.props.tenant_profile.id || 'NONE',
      }
    })
  }

	render() {
		return (
      <Card
        onClick={() => this.selectThisBuilding(this.props.building)}
        raised
        onMouseEnter={() => this.cardOnHover(this.props.building)}
        style={comStyles(this.props.building.label).hardCard}
      >
        {/*<Image src={renderProcessedThumbnail(this.props.building.thumbnail)} />*/}
        <div style={comStyles().imageGallery}>
          <SingularImageGallery
            list_of_images={[this.props.building.thumbnail].concat(this.props.building.imgs)}
            image_size='thumbnail'
          />
        </div>
        <Card.Content style={comStyles().info}>
          <div style={comStyles().details}>
            <Card.Header style={comStyles().headerPrint}>
              <div style={comStyles().address}>{ this.props.building.building_alias ? this.props.building.building_alias : shortenAddress(this.props.building.building_address) }</div>
            </Card.Header>
            <Card.Meta>
              {this.props.building.building_address}
            </Card.Meta>
            <Card.Description style={comStyles().more_info}>
              <div style={comStyles().price}>Rooms From ${ this.props.building.min_price }</div>
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
      </Card>
		)
	}
}

// defines the types of variables in this.props
BuildingCard.propTypes = {
	history: PropTypes.object.isRequired,
  building: PropTypes.object.isRequired,    // passed in
  selectPinToRedux: PropTypes.func.isRequired,
  collectIntel: PropTypes.func.isRequired,
  tenant_profile: PropTypes.object.isRequired,
}

// for all optional props, define a default value
BuildingCard.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(BuildingCard)

// Get access to state from the Redux store
function mapStateToProps(state) {
	return {
    tenant_profile: state.auth.tenant_profile,
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapStateToProps, {
    selectPinToRedux,
    collectIntel,
	})(RadiumHOC)
)

// ===============================

// the JS function that returns Radium JS styling
const comStyles = (label) => {
  let opacityStyles = {}
  if (label && label.toLowerCase().indexOf('sold out') > -1) {
    opacityStyles.opacity = 0.5
  }
	return {
    hardCard: {
      minWidth: '360px',
      maxWidth: '360px',
      minHeight: '300px',
      maxHeight: '300px',
      margin: '5px auto',
      ...opacityStyles,
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
      height: '200px',
    },
    address: {
      width: '60%',
      display: 'flex',
      flexWrap: 'wrap',
    },
    price: {
      width: '40%',
    },
    more_info: {
      display: 'flex',
      flexDirection: 'row',
    },
	}
}
