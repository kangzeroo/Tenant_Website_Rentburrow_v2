
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
  shortenAddress,
} from '../../../api/general/general_api'
import {
  xDeepBlue,
} from '../../../styles/base_colors'
import SingularImageGallery from '../../image/SingularImageGallery'
import { selectBuilding } from '../../../actions/selection/selection_actions'
import { selectPinToRedux } from '../../../actions/search/search_actions'

class BuildingRow extends Component {

  selectThisBuilding(building) {
    window.open(`${window.location.href}${building.building_id}`, '_blank')
    // this.props.history.push(`/building/${building.building_id}`)
    // this.props.selectBuilding(building)
  }

	render() {
		return (
      <div onClick={() => this.selectThisBuilding(this.props.building)} onMouseEnter={() => this.props.selectPinToRedux(this.props.building.building_id)} style={comStyles().hardCard}>
        <div style={comStyles().imageGallery}>
          <SingularImageGallery
            list_of_images={this.props.building.imgs}
          />
        </div>
        <Card.Content style={comStyles().info}>
          <Card.Header style={comStyles().headerPrint}>
            <div style={comStyles().address}>{ this.props.building.building_alias ? this.props.building.building_alias : shortenAddress(this.props.building.building_address) }</div>
            <div style={comStyles().price}>Rooms From</div>
          </Card.Header>
          <Card.Description style={comStyles().more_info}>
            {/*<div style={comStyles().rooms}>5 rooms</div> &nbsp;
            <div style={comStyles().baths}>2 baths</div>*/}
            <div style={comStyles().rooms}>{this.props.building.building_address}</div>
            <div style={comStyles().price}>${ this.props.building.min_price }</div>
          </Card.Description>
        </Card.Content>
      </div>
		)
	}
}

// defines the types of variables in this.props
BuildingRow.propTypes = {
	history: PropTypes.object.isRequired,
  location: PropTypes.object,
  building: PropTypes.object.isRequired,    // passed in
  selectBuilding: PropTypes.func.isRequired,
  selectPinToRedux: PropTypes.func.isRequired,
}

// for all optional props, define a default value
BuildingRow.defaultProps = {
  location: {},
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(BuildingRow)

// Get access to state from the Redux store
function mapStateToProps(state) {
	return {
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapStateToProps, {
    selectBuilding,
    selectPinToRedux,
	})(RadiumHOC)
)

// ===============================

// the JS function that returns Radium JS styling
const comStyles = () => {
	return {
    hardCard: {
      minWidth: '100%',
      maxWidth: '100%',
      minHeight: '650px',
      maxHeight: '650px',
      margin: '10px auto',
      backgroundColor: 'white',
    },
    imageGallery: {
      height: '400px',
    },
    info: {
      backgroundColor: 'rgba(0,0,0,0)',
      padding: '30px 10px 10px 10px',
    },
    headerPrint: {
      fontSize: '3rem',
      fontWeight: 'bold',
      color: 'black',
      padding: '5px',
      display: 'flex',
      flexDirection: 'row',
    },
    address: {
      width: '60%',
      display: 'flex',
      flexWrap: 'wrap',
    },
    price: {
      width: '40%',
      textAlign: 'right',
    },
    more_info: {
      display: 'flex',
      flexDirection: 'row',
      padding: '30px 10px 10px 10px',
      fontSize: '2.5rem',
    },
    rooms: {
    },
    baths: {
    }
	}
}
