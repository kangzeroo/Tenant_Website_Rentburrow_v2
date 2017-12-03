// Compt for copying as a BuildingViews
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
	getBuildingViews,
} from '../../api/analytics/building_analytics'
import {
  Card,
  Statistic,
  Icon,
} from 'semantic-ui-react'


class BuildingViews extends Component {

  constructor() {
    super()
    this.state = {
      views: [],
      unique_visitors: 0,
      inquiries: [],
      interested: [],
    }
  }

  componentWillMount() {
    getBuildingViews(this.props.building.building_id).then((data) => {
      this.setState({
        views: data.Items.filter((it) => {
          return it.ACTION === 'BUILDING_PAGE_LOADED'
        }),
        unique_visitors: data.unique_visitors,
        // inquiries: data.Items.filter((it) => {
        //   return it.ACTION === 'SUBMITTED_BUILDING_APPLICATION' || it.ACTION === 'SUBMITTED_PHONE_CALL_BACK_FORM'
        // }),
        // interested: data.Items.filter((it) => {
        //   return it.ACTION === 'APPLY_NOW_BUTTON_BUILDING' || it.ACTION === 'CALL_LANDLORD_BUTTON'
        // }),
      })
    })
  }

	render() {
		return (
			<Card id='BuildingViews' style={comStyles().container}>
        <Statistic style={comStyles().stat}>
          <Statistic.Value>
            <Icon color='blue' name='user' /> &nbsp;
            {this.state.views.length}
          </Statistic.Value>
          <Statistic.Label>Recent Views</Statistic.Label>
        </Statistic>
        <Statistic style={comStyles().stat}>
          <Statistic.Value>
            <Icon color='blue' name='eye' /> &nbsp;
            {this.state.unique_visitors}
          </Statistic.Value>
          <Statistic.Label>People Looking</Statistic.Label>
        </Statistic>
			</Card>
		)
	}
}

// defines the types of variables in this.props
BuildingViews.propTypes = {
	history: PropTypes.object.isRequired,
  building: PropTypes.object.isRequired,    // passed in
}

// for all optional props, define a default value
BuildingViews.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(BuildingViews)

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
      flexDirection: 'row',
      padding: '15px',
      margin: '10px 0px 0px 0px',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
		},
    stat: {
      margin: 'auto'
    }
	}
}
