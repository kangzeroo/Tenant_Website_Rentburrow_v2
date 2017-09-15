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
} from 'semantic-ui-react'
import {
  renderProcessedThumbnail,
  aliasToURL,
} from '../../../api/general/general_api'
import SingularImageGallery from '../../image/SingularImageGallery'
import { selectPinToRedux } from '../../../actions/search/search_actions'
import {
  shortenAddress,
} from '../../../api/general/general_api'


class BuildingCard extends Component {

  selectThisBuilding(building) {
    console.log(`${window.location.origin}/${aliasToURL(building.building_alias)}`)
    window.open(`${window.location.origin}/${aliasToURL(building.building_alias)}`, '_blank')
  }

	render() {
		return (
      <Card onClick={() => this.selectThisBuilding(this.props.building)} raised onMouseEnter={() => this.props.selectPinToRedux(this.props.building.building_id)} style={comStyles().hardCard}>
        {/*<Image src={renderProcessedThumbnail(this.props.building.thumbnail)} />*/}
        <div style={comStyles().imageGallery}>
          <SingularImageGallery
            list_of_images={[this.props.building.thumbnail].concat(this.props.building.imgs)}
            image_size='thumbnail'
          />
        </div>
        <Card.Content style={comStyles().info}>
          <Card.Header style={comStyles().headerPrint}>
            <div style={comStyles().address}>{ this.props.building.building_alias ? this.props.building.building_alias : shortenAddress(this.props.building.building_address) }</div>
          </Card.Header>
          <Card.Meta>
            {this.props.building.building_address}
          </Card.Meta>
          <Card.Description style={comStyles().more_info}>
            <div style={comStyles().price}>Rooms From ${ this.props.building.min_price }</div>
          </Card.Description>
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
}

// for all optional props, define a default value
BuildingCard.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(BuildingCard)

// Get access to state from the Redux store
function mapStateToProps(state) {
	return {
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapStateToProps, {
    selectPinToRedux,
	})(RadiumHOC)
)

// ===============================

// the JS function that returns Radium JS styling
const comStyles = () => {
	return {
    hardCard: {
      minWidth: '360px',
      maxWidth: '360px',
      minHeight: '300px',
      maxHeight: '300px',
      margin: '5px auto',
    },
    info: {
      backgroundColor: 'rgba(0,0,0,0)',
      // padding: '30px 10px 10px 10px',
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
