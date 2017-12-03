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
  Header,
} from 'semantic-ui-react'
import SingularImageGallery from '../../../image/SingularImageGallery'
import {
  renderProcessedThumbnail,
  aliasToURL,
  shortenAddress,
} from '../../../../api/general/general_api'
import { selectPinToRedux } from '../../../../actions/search/search_actions'
import { collectIntel } from '../../../../actions/intel/intel_actions'
import { BUILDING_INTERACTIONS } from '../../../../api/intel/dynamodb_tablenames'
import RibbonLabel from '../../../instructions/RibbonLabel'
import { check_if_building_accessible } from '../../../../api//label/building_label_api'

class MobileBuildingCard extends Component {

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
      }
    })
  }

	render() {
		return (
			<Card fluid raised id='MobileBuildingCard' onClick={() => this.selectThisBuilding(this.props.building)} style={comStyles().container}>
        <div style={comStyles().imageGallery}>
          <SingularImageGallery
            list_of_images={[this.props.building.thumbnail].concat(this.props.building.imgs)}
            image_size='hd'
          />
        </div>
        <Card.Content style={comStyles().info}>
          <div style={comStyles().details}>
            <Header as='h1' style={comStyles().headerPrint}>
              <div style={comStyles().address}>{ this.props.building.building_alias ? this.props.building.building_alias : shortenAddress(this.props.building.building_address) }</div>
            </Header>
            <Card.Description style={comStyles().more_info}>
              {
                this.props.building.min_price && this.props.building.max_price
                ?
                <div style={comStyles().price}>
                  {
                    this.props.building.min_price === this.props.building.max_price
                    ?
                    <Header as='h2' content={`Rooms from $${this.props.building.min_price}`} />
                    :
                    <Header as='h2' content={`Rooms from $${this.props.building.min_price} to $${this.props.building.max_price}`} />
                  }
                </div>
                :
                <Header as='h2' content='Inquire Price' />
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
			</Card>
		)
	}
}

// defines the types of variables in this.props
MobileBuildingCard.propTypes = {
	history: PropTypes.object.isRequired,
  building: PropTypes.object.isRequired,      // passed in
  selectPinToRedux: PropTypes.func.isRequired,
  collectIntel: PropTypes.func.isRequired,
  tenant_profile: PropTypes.object.isRequired,
}

// for all optional props, define a default value
MobileBuildingCard.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(MobileBuildingCard)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
    tenant_profile: redux.auth.tenant_profile,
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
		container: {
      display: 'flex',
      flexDirection: 'column',
		},
    more_info: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }
	}
}
