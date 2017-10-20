// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import moment from 'moment'
import { withRouter } from 'react-router-dom'
import {
  Card,
  Button,
  Image,
} from 'semantic-ui-react'
import {
  shortenAddress,
  shortenTimestamp,
} from '../../../../api/general/general_api'
import {
  getBuildingById,
} from '../../../../api/search/search_api'
import {
  getApplicationStatus,
} from '../../../../api/application/lease_application_api'

class LeaseApplicationCard extends Component {

  constructor() {
    super()
    this.state = {
      building: {},
      app_details: {},
    }
  }

  componentWillMount() {
    getApplicationStatus(this.props.details.application_id)
    .then((data) => {
      this.setState({
        app_details: data
      })
    })
    getBuildingById(this.props.details.building_id)
    .then((data) => {
      this.setState({
        building: data,
      })
    })
  }

	render() {
		return (
			<div style={comStyles().container}>
				<Card raised>
          <Card.Content>
            <Card.Header>
              {
              'STATUS: '
              }
              {
                this.state.app_details && this.state.app_details.application_status !== null
                ?
                this.state.app_details.application_status
                :
                'PENDING'
              }
              <Image fluid src={this.state.building.thumbnail} />
            </Card.Header>
            <Card.Content>
              <Card.Header>{shortenAddress(this.state.building.building_address)}</Card.Header>
              <Card.Meta>Applied On {shortenTimestamp(this.props.details.created_at)}</Card.Meta>
            </Card.Content>
          </Card.Content>
        </Card>
			</div>
		)
	}
}

// defines the types of variables in this.props
LeaseApplicationCard.propTypes = {
	history: PropTypes.object.isRequired,
  details: PropTypes.object.isRequired, // passed in
}

// for all optional props, define a default value
LeaseApplicationCard.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(LeaseApplicationCard)

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
      minHeight: '200px',
      margin: '10px auto',
		},
    buttons_container: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: '10px 0px 10px 0px'
    },
    subletor_pic: {
      position: 'absolute',
      top: '5px',
      right: '5px'
    },
    status: {
      padding: '20px',
    }
	}
}
