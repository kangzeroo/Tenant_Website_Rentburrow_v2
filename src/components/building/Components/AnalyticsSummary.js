// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
	Statistic,
	Icon,
	Card,
} from 'semantic-ui-react'
import { getAllImagesSizeForSpecificBuilding, getNumVirtualTours, } from '../../../api/search/search_api'

class AnalyticsSummary extends Component {
	constructor() {
    super()
    this.state = {
      image_count: 0,
      vr_tour_count: 0,
    }
  }

  componentWillMount() {
    getAllImagesSizeForSpecificBuilding(this.props.building.building_id)
    .then((data) => {
      this.setState({
        image_count: data.image_count,
      })
    })

    getNumVirtualTours(this.props.building.building_id)
    .then((data) => {
      this.setState({
        vr_tour_count: parseInt(data.vr_tour_count, 10),
      })
    })
  }

	render() {
		return (
			<Card id='AnalyticsSummary' style={comStyles().container}>
				<div style={comStyles().analyticsContainer} >
					<Statistic>
						<Statistic.Value>
							<Icon name='image' color='blue' />
							&nbsp;
							{this.state.image_count}
						</Statistic.Value>
						<Statistic.Label>
							Property Images
						</Statistic.Label>
					</Statistic>
					<Statistic>
						<Statistic.Value>
							<Icon name='simplybuilt' color='blue' />
							&nbsp;
							{this.state.vr_tour_count}
						</Statistic.Value>
						<Statistic.Label>
							Virtual Tours
						</Statistic.Label>
					</Statistic>
				</div>
			</Card>
		)
	}
}

// defines the types of variables in this.props
AnalyticsSummary.propTypes = {
	history: PropTypes.object.isRequired,
	building: PropTypes.object.isRequired, 			// passed in
}

// for all optional props, define a default value
AnalyticsSummary.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(AnalyticsSummary)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {

	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {

	})(RadiumHOC)
)

// ===============================

// the JS function that returns Radium JS styling
const comStyles = () => {
	return {
		container: {
      display: 'flex',
      flexDirection: 'column',
			width: '100%'
		},
		analyticsContainer: {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'space-around',
			margin: '30px'
		},
	}
}
