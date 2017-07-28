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
import { selectBuilding } from '../../../actions/selection/selection_actions'

class BuildingCard extends Component {

  selectBuilding(building) {
    this.props.selectBuilding(building)
    this.props.history.push(`/buildings/${building.building_id}`)
  }

	render() {
		return (
      <Card onClick={() => this.selectBuilding(this.props.building)} raised>
        <Image src={this.props.building.thumbnail} />
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
  selectBuilding: PropTypes.func.isRequired,
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
    selectBuilding,
	})(RadiumHOC)
)

// ===============================

// the JS function that returns Radium JS styling
const comStyles = () => {
	return {
	}
}
