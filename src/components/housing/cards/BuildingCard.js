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


class BuildingCard extends Component {

  selectThisBuilding(building) {
    console.log(`${window.location.href}${aliasToURL(building.building_alias)}`)
    window.open(`${window.location.href}${aliasToURL(building.building_alias)}`, '_blank')
  }

	render() {
		return (
      <Card onClick={() => this.selectThisBuilding(this.props.building)} raised onMouseEnter={() => this.props.selectPinToRedux(this.props.building.building_id)} style={comStyles().hardCard}>
        <Image src={renderProcessedThumbnail(this.props.building.thumbnail)} />
        {/*<SingularImageGallery
          list_of_images={this.props.building.imgs}
        />*/}
        <Card.Content>
          <Card.Header>
            { this.props.building.building_name }
          </Card.Header>
          <Card.Description>
            { this.props.building.building_address }
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
      minWidth: '350px',
      maxWidth: '350px',
      minHeight: '350px',
      maxHeight: '350px',
      margin: '5px auto'
    }
	}
}
