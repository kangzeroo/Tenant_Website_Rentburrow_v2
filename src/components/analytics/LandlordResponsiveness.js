// Compt for copying as a LandlordResponsiveness
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import moment from 'moment'
import { withRouter } from 'react-router-dom'
import {
	getLandlordResponsiveness,
} from '../../api/analytics/building_analytics'
import {
  Card,
  Statistic,
  Icon,
} from 'semantic-ui-react'


class LandlordResponsiveness extends Component {

	render() {
		return (
			<Card id='LandlordResponsiveness' style={comStyles().container}>
        {
          this.props.last_active
          ?
          <Statistic horizontal value={moment(this.props.last_active).fromNow()} label='Landlord Last Active' size='mini' style={comStyles().stat} />
          :
          null
        }
        <br />
        {
          this.props.avg_time
          ?
          <Statistic horizontal value={
            this.props.avg_time > 60
            ?
            `${(this.props.avg_time/60).toFixed(0)} hours`
            :
            `${this.props.avg_time} minutes`
          } label='Typical Response Time' size='mini' style={comStyles().stat} />
          :
          null
        }
        <br />
        {
          this.props.percent_responded
          ?
          <Statistic horizontal value={`${this.props.percent_responded}%`} label='Of Inquiries Responded' size='mini' style={comStyles().stat} />
          :
          null
        }
			</Card>
		)
	}
}

// defines the types of variables in this.props
LandlordResponsiveness.propTypes = {
	history: PropTypes.object.isRequired,
  last_active: PropTypes.number,    // passed in
  avg_time: PropTypes.number,    // passed in
  percent_responded: PropTypes.number,    // passed in
}

// for all optional props, define a default value
LandlordResponsiveness.defaultProps = {
  last_active: 0,
  avg_time: 0,
  percent_responded: 0,
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(LandlordResponsiveness)

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
