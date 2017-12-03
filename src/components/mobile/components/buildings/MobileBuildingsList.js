// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {

} from 'semantic-ui-react'
import { queryBuildingsInArea, } from '../../../../api/search/search_api'
import { saveBuildingsToRedux, } from '../../../../actions/search/search_actions'
import MobileBuildingCard from '../cards/MobileBuildingCard'

class MobileBuildingsList extends Component {

  constructor() {
    super()
    this.state = {
      buildings: [],
    }
  }

  componentWillMount() {
    queryBuildingsInArea()
    .then((data) => {
      const buildings = data
			// Sort the buildings randomly
			this.props.saveBuildingsToRedux(buildings.sort((a, b) => { return 0.5 - Math.random() }))
			this.setState({
				buildings,
			})
    })
  }

	render() {
		return (
			<div id='MobileBuildingsList' style={comStyles().container}>
				{
          this.state.buildings.map((building) => {
            return (
              <MobileBuildingCard
                key={building.building_id}
                building={building}
              />
            )
          })
        }
			</div>
		)
	}
}

// defines the types of variables in this.props
MobileBuildingsList.propTypes = {
	history: PropTypes.object.isRequired,
  saveBuildingsToRedux: PropTypes.func.isRequired,
}

// for all optional props, define a default value
MobileBuildingsList.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(MobileBuildingsList)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {

	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
    saveBuildingsToRedux,
	})(RadiumHOC)
)

// ===============================

// the JS function that returns Radium JS styling
const comStyles = () => {
	return {
		container: {
      display: 'flex',
      flexDirection: 'column',
      background: "transparent url('https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif') center no-repeat",
		}
	}
}
