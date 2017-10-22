// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
  Tab,
  Header,
  Button,
} from 'semantic-ui-react'
import GroupApplication from './tabs/GroupApplication'
import MyApplication from './tabs/MyApplication'
import ApplicationContract from './tabs/ApplicationContract'
import {
  getGroupApplication,
  getMyApplication,
} from '../../../../api/application/lease_application_api'
import {
  getBuildingById,
} from '../../../../api/search/search_api'
import {
  authenticateTenant,
} from '../../../../api/general/general_api'
import {
  checkIfUserAlreadyPartGroup,
} from '../../../../api/group/group_api'

class LeaseApplicationPage extends Component {

  constructor() {
    super()
    this.state = {
      group_app: {},
      building: {},

      application_id: '',

      loading: false,
    }
  }

  componentWillMount() {
    const pathname = this.props.location.pathname
    const group_id = pathname.slice(pathname.indexOf('/lease_applications/applications/') + '/lease_applications/applications/'.length)

    if (authenticateTenant(this.props.tenant_profile) && this.authenticate(group_id, this.props.tenant_profile.tenant_id)) {

      this.setState({
        loading: true,
      })

      getGroupApplication(group_id)
      .then((data) => {
        console.log(data)
        this.setState({
          group_app: data
        })
        return getBuildingById(data.building_id)
      })
      .then((data) => {
        this.setState({
          building: data,
        })
        return getMyApplication({
          tenant_id: this.props.tenant_profile.tenant_id,
          group_id: group_id
        })
      })
      .then((data) => {
        this.setState({
          application_id: data.application_id
        })
      })
		} else {
			this.props.history.push('/')
		}
  }

  authenticate(group_id, tenant_id) {
    return checkIfUserAlreadyPartGroup(group_id, tenant_id)
    .then((data) => {
      return data.already_joined
    })
  }

  goBack() {
    this.props.history.push('/lease_applications')
  }

  goToBuilding(building_alias) {
    this.props.history.push(`/${building_alias}`)
  }

  renderGroupApp() {
    if (this.state.group_app && this.state.group_app.group_id) {
      return (
        <GroupApplication
          group_app={this.state.group_app}
          building={this.state.building}
        />
      )
    }
  }

  renderMyApp() {
    if (this.props.tenant_profile && this.props.tenant_profile.tenant_id && this.state.application_id !== '') {
      return (
        <MyApplication
          application_id={this.state.application_id}
        />
      )
    }
  }

  renderContract() {
    return (
      <ApplicationContract

      />
    )
  }

  renderTabs() {
		return [
			{ index: 0, code: 'group-info', menuItem: 'Group', render: () => <Tab.Pane attached={false}>{ this.renderGroupApp() }</Tab.Pane> },
      { index: 1, code: 'my-app', menuItem: 'My Application', render: () => <Tab.Pane attached={false}>{ this.renderMyApp() }</Tab.Pane> },
      { index: 2, code: 'my-app-contract', menuItem: 'My Contract', render: () => <Tab.Pane attached={false}>{ this.renderApplicationContract() }</Tab.Pane> },
			]
		}

	render() {
		return (
			<div style={comStyles().container}>
        <div style={comStyles().header_container} >
          <div style={comStyles().header_left} >
            <Button
              basic
              primary
              icon='chevron left'
              content='Back'
              onClick={() => this.goBack()}
              style={comStyles().go_back_button}
            />
            <Header
              as='h2'
              icon='building'
              content={this.state.building.building_alias}
              subheader={this.state.building.building_address}
            />
          </div>
          <Button
            primary
            icon='building outline'
            content='Explore Building'
            onClick={() => this.goToBuilding(this.state.building.building_alias)}
          />
        </div>
        <div style={comStyles().tabsContainer} >
          <Tab
            menu={{ secondary: true, pointing: true }}
            panes={this.renderTabs()}
            vertical
          />
        </div>
			</div>
		)
	}
}

// defines the types of variables in this.props
LeaseApplicationPage.propTypes = {
	history: PropTypes.object.isRequired,
  tenant_profile: PropTypes.object.isRequired,
}

// for all optional props, define a default value
LeaseApplicationPage.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(LeaseApplicationPage)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
    tenant_profile: redux.auth.tenant_profile,
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
      margin: ''
		},
    header_container: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      height: '70px',
      alignItems: 'center',
      justifyContent: 'space-between',
      margin: '10px 10px 10px 20px',
    },
    header_left: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center'
    },
    go_back_button: {
      height: '40px'
    },
    tabsContainer: {
			margin: '50px'
		}
	}
}
