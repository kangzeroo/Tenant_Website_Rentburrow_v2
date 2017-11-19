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
  Tab,
  Header,
  Button,
  Card,
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
  userInGroup,
} from '../../../../api/group/group_api'
import {
  generateNewLeaseSession,
} from '../../../../api/pandadoc/pandadoc_api'

class LeaseApplicationPage extends Component {

  constructor() {
    super()
    this.state = {
      group_app: {},
      building: {},

      application: {},

      loading: false,
      loaded: false,
    }
  }

  componentWillMount() {
    const pathname = this.props.location.pathname
    const group_id = pathname.slice(pathname.indexOf('/applications/lease/') + '/applications/lease/'.length)

    userInGroup(this.props.tenant_profile.tenant_id, group_id)
    .then((data) => {
      if (authenticateTenant(this.props.tenant_profile) && data.user_in_group) {

        this.setState({
          loading: true,
        })

        getGroupApplication(group_id)
        .then((data) => {
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
            application: data,
          })
          this.newPandadocSession(data)
        })
  		} else {
  			this.props.history.push('/')
  		}
    })
  }

  newPandadocSession(application) {
    const time = moment.duration('04:15:00');
    const generated_expiry_date = moment(application.session_expires_at, 'YYYY-MM-DD HH:mm').subtract(time)
    const cur_date = moment()

    if (cur_date.isAfter(generated_expiry_date)) {
      // console.log('generating new session...')
			generateNewLeaseSession({
				application_id: application.application_id,
				doc_id: application.doc_id,
				email: this.props.tenant_profile.email,
			})
			.then(() => {
				getMyApplication(this.props.tenant_profile.tenant_id, application.application_id)
        .then((data) => {
          this.setState({
            application: data,
            loaded: true,
          })
        })
			})
    } else {
      this.setState({
        loaded: true,
      })
      // console.log('session still available')
    }
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
    if (this.props.tenant_profile && this.props.tenant_profile.tenant_id && this.state.application.application_id !== '') {
      return (
        <MyApplication
          application_id={this.state.application.application_id}
        />
      )
    }
  }

  renderApplicationContract() {
    if (this.props.tenant_profile && this.props.tenant_profile.tenant_id && this.state.application.application_id !== '' && this.state.loaded) {
      return (
        <ApplicationContract
          application={this.state.application}
        />
      )
    }
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
			<div id='LeaseApplicationPage' style={comStyles().container}>
          <Card raised fluid style={comStyles().card_style}>
            <div style={comStyles().headerContainer} >
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
                content={this.state.building.building_alias + ' Application'}
                subheader={this.state.building.building_address}
              />
            <Button
              primary
              icon='building outline'
              content='Explore Building'
              onClick={() => this.goToBuilding(this.state.building.building_alias)}
              style={comStyles().explore_building_button}
            />
          </div>
        </Card>
        <div style={comStyles().tabsContainer} >
          <Tab
            menu={{ secondary: true, pointing: true }}
            panes={this.renderTabs()}
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
      flexDirection: 'column'
		},
    headerContainer: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
			padding: '10px 20px 10px 20px',
      margin: 'auto',
    },
    card_style: {
      width: '100%'
		},
    header_left: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center'
    },
    go_back_button: {
      height: '40px',
      width: '100px'
    },
    tabsContainer: {
			margin: '50px'
		},
    explore_building_button: {
      height: '40px',
      width: '200px'
    }
	}
}
