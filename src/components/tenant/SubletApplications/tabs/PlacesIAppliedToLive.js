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
  Modal,
} from 'semantic-ui-react'
import ApplicationCard from '../cards/ApplicationCard'
import {
  getSentApplications,
} from '../../../../api/application/application_api'
import { saveSentApplicationsToRedux, } from '../../../../actions/contract/contract_actions'
import { updateDocumentStatus, } from '../../../../api/pandadoc/pandadoc_api'
import SubleteeDone from '../../../contracts/sublets/subletee/SubleteeDone'

class PlacesIAppliedToLive extends Component {

  constructor() {
    super()
    this.state = {
      applications: [],

      toggle_modal: false,
      modal_name: '',
      context: null,
    }
  }

  componentWillMount() {
    updateDocumentStatus(this.props.tenant_profile.tenant_id)
    getSentApplications(this.props.tenant_profile.tenant_id)
    .then((data) => {
      // const existsAlready = (app, unique_apps) => {
      //   let exists = false
      //   unique_apps.forEach((uqa) => {
      //     if (uqa.subletor_fb_id === app.subletor_fb_id) {
      //       exists = true
      //     }
      //   })
      //   return exists
      // }
      // console.log(data)
      const applications = data
      // const unique_apps = []
      // applications.forEach((app) => {
      //   let unique = true
      //   if (existsAlready(app, unique_apps)) {
      //     unique = false
      //   }
      //   if (unique) {
      //     unique_apps.push(app)
      //   }
      // })
      this.props.saveSentApplicationsToRedux(applications)
      this.setState({
        applications: applications,
      })
    })
  }

  renderAppropriateModal(modal_name, context) {
    if (modal_name === 'subletee_done') {
      return (
        <SubleteeDone
          sublet_post={context.sublet_post}
          subletee_contract={context.subletee_contract}
        />
      )
    }
  }

  toggleModal(bool, attr, context) {
    this.setState({
      toggle_modal: bool,
      modal_name: attr,
      context: context
    })
  }

	render() {
		return (
			<div style={comStyles().container}>
        <Header as='h3'>
          <Icon name='external' />
          Active Applications
        </Header>
        {
          this.state.applications.length === 0
          ?
          <div style={comStyles().no_applications_container} >
            <Header
              as='h2'
              content='You currently have no applications :('
              subheader='Apply to a sublet/lease today!'
            />
            <div style={comStyles().button_text}>
              <div>Search for a sublet:</div>
              <Button
                content='Sublets'
                primary
                onClick={() => this.props.history.push('/sublet')}
              />
            </div>
            <div style={comStyles().button_text}>
              <div>Search for a lease:</div>
              <Button
                content='Leases'
                primary
                onClick={() => this.props.history.push('/lease')}
              />
            </div>
          </div>
          :
          <div style={comStyles().activeContainer} >
            {
              this.state.applications.map((card) => {
                return (
                  <ApplicationCard
                    key={card.subletee_id}
                    details={card}
                    triggerSubleteeDoneModal={({ sublet_post, subletee_contract }) => this.toggleModal(true, 'subletee_done', { sublet_post, subletee_contract })}
                  />
                )
              })
            }
          </div>
        }
        <Modal dimmer='blurring' open={this.state.toggle_modal} onClose={() => this.toggleModal(false)}>
          {
            this.renderAppropriateModal(this.state.modal_name, this.state.context)
          }
        </Modal>
      </div>
		)
	}
}

// defines the types of variables in this.props
PlacesIAppliedToLive.propTypes = {
	history: PropTypes.object.isRequired,
  tenant_profile: PropTypes.object,
  saveSentApplicationsToRedux: PropTypes.func.isRequired,
}

// for all optional props, define a default value
PlacesIAppliedToLive.defaultProps = {
  tenant_profile: {}
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(PlacesIAppliedToLive)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
    tenant_profile: redux.auth.tenant_profile
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
    saveSentApplicationsToRedux,
	})(RadiumHOC)
)

// ===============================

// the JS function that returns Radium JS styling
const comStyles = () => {
	return {
		container: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '60vh',
      maxHeight: '60vh'
		},
    activeContainer: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    no_applications_container: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      minHeight: '150px',
      maxHeight: '150px',
    },
    button_text: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      minWidth: '250px',
      maxWidth: '250px',
    }
	}
}
