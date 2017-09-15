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
import locale from 'browser-locale'
import { Helmet } from 'react-helmet';
import Header from './Header'
import Chat from './chat/ChatPopup/Chat'
import CommunityPage from './community/CommunityPage'
import HousingPage from './housing/HousingPage'
import BuildingPage from './building/BuildingPage'
import SubletPage from './sublets/SubletPage'
import { dispatchActionsToRedux } from '../actions/system/system_actions'
import { redirectPath, setLanguageFromLocale } from '../api/general/general_api'
import { initiateFacebook, checkIfFacebookLoggedIn } from '../api/auth/facebook_auth'
import { saveTenantToRedux } from '../actions/auth/auth_actions'
import { changeAppLanguage } from '../actions/app/app_actions'
import { scrapeFacebookSublets } from '../api/sublet/facebook_sublet'

class AppRoot extends Component {

	componentWillMount() {
    this.autoSetLanguage()
    initiateFacebook().then(() => {
      // autologin to facebook if possible
      return checkIfFacebookLoggedIn()
    }).then((fbProfile) => {
      this.props.saveTenantToRedux(fbProfile)
      if (location.indexOf('sublet') > -1) {
        scrapeFacebookSublets(fbProfile)
      }
    })
    // grab the url that was given
    const location = this.props.location.pathname
    // take the path in the url and go directly to that page and save to redux any actions necessary
    if (location !== '/') {
      redirectPath(location).then(({ path, actions }) => {
        // path = '/sage-5'
        // actions = [ { type, payload }, { type, payload } ]
        this.props.dispatchActionsToRedux(actions)
        this.props.history.push(path)
      })
    }
  }

  autoSetLanguage() {
    const country_code = locale()
    setLanguageFromLocale(country_code).then((language_code) => {
      this.props.changeAppLanguage(language_code)
    })
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
        <Helmet>
          <html lang={ this.props.language }></html>
        </Helmet>
        <StyleRoot>
          <div style={comStyles().main}>

            <div id='language_tag' value={this.props.language} />

            <Header style={comStyles().header} />

            <div style={comStyles().content}>

              <Switch>

                <Route exact path='/' component={HousingPage} />
                  <Route path='/community' component={CommunityPage} />
                  <Route path='/housing' component={HousingPage} />

                  <Route path='/building' component={BuildingPage} />

                  <Route path='/sublets/:post_id' component={SubletPage} />
                  <Route path='/:building_alias' component={BuildingPage} />


              </Switch>

            </div>

            {
              this.props.selected_building
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
  history: PropTypes.object.isRequired,
  dispatchActionsToRedux: PropTypes.func.isRequired,
  saveTenantToRedux: PropTypes.func.isRequired,
  selected_building: PropTypes.object,
  language: PropTypes.string.isRequired,
  changeAppLanguage: PropTypes.func.isRequired,
}

AppRoot.defaultProps = {
  children: {},
  location: {},
  selected_building: null,
}

const RadiumHOC = Radium(AppRoot)

const mapReduxToProps = (redux) => {
	return {
    selected_building: redux.selection.selected_building,
    language: redux.app.selected_language,
	}
}

export default withRouter(connect(mapReduxToProps, {
  dispatchActionsToRedux,
  saveTenantToRedux,
  changeAppLanguage,
})(RadiumHOC))

// =============================

const comStyles = () => {
	return {
    main: {
      minHeight: '100vh',
      maxHeight: '100vh',
      minWidth: '100vw',
      maxWidth: '100vw',
      display: 'flex',
      flexDirection: 'column',
    },
    header: {
      minHeight: '7vh',
      maxHeight: '7vh',
      minWidth: '100vw',
      maxWidth: '100vw',
    },
    content: {
      minHeight: '93vh',
      maxHeight: '93vh',
      minWidth: '100vw',
      maxWidth: '100vw',
      overflowY: 'scroll'
    },
	}
}
