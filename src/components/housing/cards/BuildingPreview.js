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
  shortenAddress,
} from '../../../api/general/general_api'
import SingularImageGallery from '../../image/SingularImageGallery'
import { selectPinToRedux } from '../../../actions/search/search_actions'


class BuildingPreview extends Component {

  selectThisBuilding(building) {
    // console.log(`${window.location.origin}/${aliasToURL(building.building_alias)}`)
    window.open(`${window.location.origin}/${aliasToURL(building.building_alias)}`, '_blank')
  }

	render() {
		return (
      <Card
        onClick={() => this.selectThisBuilding(this.props.building)}
        onMouseEnter={() => this.props.selectPinToRedux(this.props.building.building_id)}
        fluid
        style={comStyles().hardCard}
      >
        {/*<Image src={renderProcessedThumbnail(this.props.building.thumbnail)} />*/}
        <div style={comStyles().imageGallery}>
          <SingularImageGallery
            list_of_images={[this.props.building.thumbnail].concat(this.props.building.imgs)}
            image_size='hd'
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
BuildingPreview.propTypes = {
	history: PropTypes.object.isRequired,
  building: PropTypes.object.isRequired,    // passed in
  selectPinToRedux: PropTypes.func.isRequired,
}

// for all optional props, define a default value
BuildingPreview.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(BuildingPreview)

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

	}
}
