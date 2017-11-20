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
  Label,
  Header,
  Icon,
} from 'semantic-ui-react'
import {
  shortenAddress,
  shortenTimestamp,
  renderProcessedImage,
} from '../../../../api/general/general_api'
import {
  getBuildingById,
} from '../../../../api/search/search_api'
import {
  getApplicationStatus,
} from '../../../../api/application/lease_application_api'
import {
  getGroupInfo,
} from '../../../../api/group/group_api'

class LeaseApplicationCard extends Component {

  constructor() {
    super()
    this.state = {
      building: {},
      app_details: {},
      group: {},
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
    getGroupInfo(this.props.details.group_id)
    .then((data) => {
      this.setState({
        group: data
      })
    })
  }

  goToPage(group_id) {
    this.props.history.push(`/applications/lease/${group_id}`)
  }

  renderStatusText() {
    if (this.state.app_details && (this.state.app_details.doc_status === 'document.completed')) {
      return `STATUS: COMPLETE`
    } else {
      return 'STATUS: PENDING'
    }
  }

	render() {
		return (
			<div id='LeaseApplicationCard' style={comStyles().container}>
				<Card raised style={comStyles().card_styles} onClick={() => this.goToPage(this.props.details.group_id)}>
          <Image
            fluid
            src={renderProcessedImage(this.state.building.thumbnail)}
          />
            <Card.Content>
              <Card.Header>{shortenAddress(this.state.building.building_address)}</Card.Header>
              <Card.Meta>Applied on {shortenTimestamp(this.props.details.created_at)}</Card.Meta>
          </Card.Content>
          <Header
            as='h3'
            icon='time'
            content={this.renderStatusText()}
            subheader='Waiting for all parties to sign'
            color='blue'
            style={comStyles().status_text}
          />
          <Card.Content extra>
            <a>
              <Icon name={this.state.group.group_size > 1 ? 'users' : 'user'} />
              { `${this.state.group.group_name ? this.state.group.group_name :  ''} ${this.state.group.group_size} Group Member${this.state.group.group_size > 1 ? 's' : ''}`}
            </a>
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
      minHeight: '400px',
      margin: '10px auto',
		},
    card_styles: {
      height: '400px',
      width: '400px',
    },
    status_text: {
      margin: '0px 0px 10px 0px',
    }
	}
}
