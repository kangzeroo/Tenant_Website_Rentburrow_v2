// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
  Header,
  Icon,
  Button,
} from 'semantic-ui-react'
import {
  getAllMyLeaseApplications,
} from '../../../../api/application/lease_application_api'
import LeaseApplicationCard from '../cards/LeaseApplicationCard'
import {
  getBuildingById,
} from '../../../../api/search/search_api'
import {
  saveLeaseApplicationsToRedux,
} from '../../../../actions/contract/contract_actions'

class LeaseApplications extends Component {

  constructor() {
    super()
    this.state = {
      applications: []
    }
  }

  componentWillMount() {
    getAllMyLeaseApplications(this.props.tenant_profile.tenant_id)
    .then((data) => {
      this.setState({
        applications: data,
      })
      this.props.saveLeaseApplicationsToRedux(data)
    })
  }

	render() {
		return (
      <div style={comStyles().container}>
        <Header
          as='h3'
          icon='share'
          content='Lease Applications'
          subheader='View all your lease applications'
        />
        {
          this.state.applications.length === 0
          ?
          <div style={comStyles().no_applications_container} >
            <Header
              as='h2'
              content='You currently have no Lease applications :('
              subheader='To upload a sublet, post it on Facebook and it will automatically appear on Rentburrow'
            />
          </div>
          :
          <div style={comStyles().activeContainer} >
          {
            this.state.applications.map((card) => {
              return (
                <LeaseApplicationCard
                  key={card.group_id}
                  details={card}
                />
              )
            })
          }
          </div>
        }
      </div>
		)
	}
}

// defines the types of variables in this.props
LeaseApplications.propTypes = {
	history: PropTypes.object.isRequired,
  tenant_profile: PropTypes.object.isRequired,
  saveLeaseApplicationsToRedux: PropTypes.func.isRequired,
}

// for all optional props, define a default value
LeaseApplications.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(LeaseApplications)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
    tenant_profile: redux.auth.tenant_profile,
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
    saveLeaseApplicationsToRedux,
	})(RadiumHOC)
)

// ===============================

// the JS function that returns Radium JS styling
const comStyles = () => {
	return {
		container: {
      display: 'flex',
      flexDirection: 'column',
		},
    activeContainer: {
      display: 'flex',
			flexDirection: 'row',
			justifyContent: 'space-around',
			flexWrap: 'wrap',
    },
    no_applications_container: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '150px',
      maxHeight: '150px',
    },
    button_text: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      minWidth: '400px',
      maxWidth: '400px',
    }
	}
}
