// The root Compt where routing is defined (via react-router 4)
// as well as any functions that need to be run on app load

// In react-router 4, a url such as '/properties/:pid' would go through multiple <Routes>
// such as the <Route path='/properties'> as well as <Route path='/properties/:pid'>
// thats why we use <Switch> to tell React-Router 4 that we only want to match the first route in its children
// and why we use 'exact' (eg. <Route exact path='/properties'>) so that we can load this Compt when the url is exactly '/properties' and not '/properties/123'


import React, { Component } from 'react';
import { connect } from 'react-redux';
import Radium, { StyleRoot } from 'radium'
import PropTypes from 'prop-types'
import {
  Switch,
  Route,
  withRouter,
} from 'react-router-dom'
import RequireAuth from './auth/RequireAuth'
import Header from './Header'
import Sidebar from './Sidebar'
import PublicBoard from './public/PublicBoard'
import SettingsPage from './settings/SettingsPage'
import Dashboard from './dashboard/Dashboard'
import BuildingsList from './buildings/BuildingsList'
import BuildingPage from './buildings/building/BuildingPage'
import CreateSuite from './buildings/suite/CreateSuite'
import SuitePage from './buildings/suite/SuitePage'
import CreateBuilding from './buildings/CreateBuilding'
import CreateCorporation from './corporation/CreateCorporation'
import CorporationInvite from './corporation/CorporationInvite'
import Chat from './chat/ChatPopup/Chat'
import ChatPage from './chat/ChatPage/ChatPage'
import Login from './auth/Login'
import Logout from './auth/Logout'
import Register from './auth/Register'
import ForgotPassword from './auth/ForgotPassword'
import AccountVerification from './auth/AccountVerification'
import { getBuildingsForCorporation } from '../api/building/building_api'
import { setupWebsockets, initiatePouchDB } from '../actions/setup/setup_actions'
import { saveCorporationProfile, setStaffProfile, authenticateStaff } from '../actions/auth/auth_actions'
import { retrieveStaffFromLocalStorage } from '../api/aws/aws-cognito'
import { saveBuildingsForCorp } from '../actions/corporation/corporation_actions'
import { getStaffInfo } from '../api/staff/staff_api'
import { toggleAccountPopup } from '../actions/staff/staff_actions'
import { getCorpInfo } from '../api/corporation/corporation_api'
import AccountDropdown from './staff/AccountDropdown'


class AppRoot extends Component {

	componentWillMount() {
    // grab the url that was given
    const location = this.props.location.pathname

    // check if staff member has already logged in
		retrieveStaffFromLocalStorage()
			.then((staff) => {
        return getStaffInfo(staff.sub)
			})
      .then((staff) => {
        // if they have, then we will auto-log them in
        this.saveStaffProfile(staff, location)
      })
			.catch((err) => {
				// if not, then we do nothing
			})
  }

  // save the staff profile & buildings to redux
  // reroute to original url of page load
  saveStaffProfile(staff, location) {
		this.props.setStaffProfile(staff)
		this.props.authenticateStaff()
    getCorpInfo(staff.corporation_id).then((corp) => {
      console.log(corp)
      this.props.saveCorporationProfile(corp)
    }).catch((err) => {})
    getBuildingsForCorporation(staff.corporation_id).then((buildings) => {
			this.props.saveBuildingsForCorp(buildings)
			this.props.history.push(location)
		}).catch(() => {})
	}

  // note that we have <StyleRoot>, which must be defined in order to use Radium
  // <StyleRoot> enables Radium styling to be used in all child compts
  // hence why the most outer div uses inline styles
	render() {
		return (
      <div style={
        {
    			width: '100vw',
    			height: '100vh'
        }
      }
      >
        <StyleRoot>
          <div style={comStyles().main}>

            <Header toggleAccountDropdown={() => this.toggleAccountDropdown()} style={comStyles().header} />

            <div style={comStyles().container}>
              <Sidebar style={comStyles().sidebar} />
              <div style={comStyles().content}>
                <Route exact path='/' component={this.props.authenticated_staff ? Dashboard : PublicBoard} />

                <Switch>
                  <Route exact path='/login' component={Login} />
                  <Route path='/login/forgot' component={ForgotPassword} />
                </Switch>
                <Switch>
                  <Route exact path='/register' component={Register} />
                  <Route path='/register/verify' component={AccountVerification} />
                </Switch>
                <Route path='/logout' component={Logout} />

                <Route path='/public' component={PublicBoard} />

                <Switch>
                  <Route exact path='/settings' component={RequireAuth(SettingsPage)} />
                  <Route path='/settings/corporation/create' component={RequireAuth(CreateCorporation)} />
                  <Route path='/settings/corporation/invite' component={RequireAuth(CorporationInvite)} />
                </Switch>

                <Switch>
                  <Route exact path='/dashboard' component={RequireAuth(Dashboard)} />
                  <Route path='/dashboard/metric' component={RequireAuth(Dashboard)} />
                </Switch>

                <Switch>
                  <Route exact path='/chat' component={RequireAuth(ChatPage)} />
                </Switch>

                <Switch>
                  <Route exact path='/buildings' component={RequireAuth(BuildingsList)} />
                  <Route exact path='/buildings/create' component={RequireAuth(CreateBuilding)} />
                  <Route exact path='/buildings/:building_id' component={RequireAuth(BuildingPage)} />
                  <Route exact path='/buildings/:building_id/suite/create' component={RequireAuth(CreateSuite)} />
                  <Route exact path='/buildings/:building_id/suite/:suite_id' component={RequireAuth(SuitePage)} />
                </Switch>

              </div>
            </div>

            {
              this.props.account_popup
              ?
              <AccountDropdown style={comStyles().profile_dropdown} />
              :
              null
            }

            {
              this.props.authenticated_staff && this.props.location.pathname.indexOf('chat') === -1
              ?
              <Chat style={comStyles().chat} />
              :
              null
            }
          </div>
        </StyleRoot>
      </div>
		)
	}
}

AppRoot.propTypes = {
  children: PropTypes.object,
  location: PropTypes.object,
	saveCorporationProfile: PropTypes.func,
	setupWebsockets: PropTypes.func,
	initiatePouchDB: PropTypes.func,
	setStaffProfile: PropTypes.func,
	authenticateStaff: PropTypes.func,
  saveBuildingsForCorp: PropTypes.func,
  authenticated_staff: PropTypes.bool,
  history: PropTypes.object,
  toggleAccountPopup: PropTypes.func.isRequired,
  account_popup: PropTypes.bool,
}

AppRoot.defaultProps = {
  children: {},
  location: {},
  authenticated_staff: false,
}

const RadiumHOC = Radium(AppRoot)

const mapStateToProps = (state) => {
	return {
    authenticated_staff: state.auth.authenticated_staff,
    account_popup: state.staff.account_popup,
	}
}

export default withRouter(connect(mapStateToProps, {
	setupWebsockets,
	saveCorporationProfile,
	initiatePouchDB,
  setStaffProfile,
  authenticateStaff,
  saveBuildingsForCorp,
  toggleAccountPopup,
})(RadiumHOC))

// =============================

const comStyles = () => {
	return {
    header: {
      minHeight: '7vh',
      maxHeight: '7vh',
      minWidth: '100%',
      maxWidth: '100%'
    },
    main: {
      minHeight: '100vh',
      maxHeight: '100vh',
      minWidth: '100vw',
      maxWidth: '100vw',
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'scroll'
    },
    container: {
      minHeight: '93vh',
      maxHeight: '93vh',
      display: 'flex',
      flexDirection: 'row',
      marginTop: '7vh'
    },
    sidebar: {
      minWidth: '200px',
      maxWidth: '200px',
      minHeight: '93vh',
      maxHeight: '93vh',
      marginTop: '7vh'
    },
    content: {
      flex: 1,
      minHeight: '100%',
      maxHeight: '100%',
    },
	}
}
