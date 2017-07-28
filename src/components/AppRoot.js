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
import Header from './Header'
import CommunityPage from './community/CommunityPage'
import HousingPage from './housing/HousingPage'
import BuildingPage from './building/BuildingPage'
import { dispatchActionsToRedux } from '../actions/system/system_actions'
import { redirectPath } from '../api/general/general_api'
import { initiateFacebook } from '../api/auth/facebook_auth'

class AppRoot extends Component {

	componentWillMount() {
    initiateFacebook()
    // grab the url that was given
    const location = this.props.location.pathname
    // take the path in the url and go directly to that page and save to redux any actions necessary
    redirectPath(location).then(({ path, actions }) => {
      // path = '/sage-5'
      // actions = [ { type, payload }, { type, payload } ]
      this.props.dispatchActionsToRedux(actions)
      this.props.history.push(path)
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
        <StyleRoot>
          <div style={comStyles().main}>

            <Header style={comStyles().header} />

            <div style={comStyles().content}>

              <Route exact path='/' component={HousingPage} />

              <Switch>
                <Route path='/community' component={CommunityPage} />
              </Switch>

              <Switch>
                <Route path='/housing' component={HousingPage} />
              </Switch>

              <Switch>
                <Route path='/building' component={BuildingPage} />
              </Switch>

            </div>

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
}

AppRoot.defaultProps = {
  children: {},
  location: {},
}

const RadiumHOC = Radium(AppRoot)

const mapStateToProps = (state) => {
	return {
	}
}

export default withRouter(connect(mapStateToProps, {
  dispatchActionsToRedux,
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
