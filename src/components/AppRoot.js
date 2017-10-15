// The root Compt where routing is defined (via react-router 4)
// as well as any functions that need to be run on app load

// In react-router 4, a url such as '/properties/:pid' would go through multiple <Routes>
// such as the <Route path='/properties'> as well as <Route path='/properties/:pid'>
// thats why we use <Switch> to tell React-Router 4 that we only want to match the first route in its children
// and why we use 'exact' (eg. <Route exact path='/properties'>) so that we can load this Compt when the url is exactly '/properties' and not '/properties/123'


import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium, { StyleRoot } from 'radium'
import PropTypes from 'prop-types'
import {
  Switch,
  Route,
  withRouter,
} from 'react-router-dom'
import {
  Modal,
} from 'semantic-ui-react'
import locale from 'browser-locale'
import { Helmet } from 'react-helmet'
import Header from './Header'
import Chat from './chat/ChatPopup/Chat'
import Feature from './misc/feature'
import CommunityPage from './community/CommunityPage'
import HousingPage from './housing/HousingPage'
import BuildingPage from './building/BuildingPage'
import SubletPage from './sublets/SubletPage'
import TenantAccount from './tenant/TenantAccount'
import TenantApplications from './tenant/TenantApplications'
import TenantSettings from './tenant/TenantSettings'
import SubletApplication from './contracts/sublets/SubletApplication'
import { dispatchActionsToRedux } from '../actions/system/system_actions'
import { redirectPath, setLanguageFromLocale } from '../api/general/general_api'
import { initiateFacebook, checkIfFacebookLoggedIn } from '../api/auth/facebook_auth'
import { saveTenantToRedux, triggerForcedSignin } from '../actions/auth/auth_actions'
import { changeAppLanguage } from '../actions/app/app_actions'
import { scrapeFacebookSublets } from '../api/sublet/fb_sublet_scrapper'
import { changeRentType, saveSubletsToRedux } from '../actions/search/search_actions'
import { querySubletsInArea } from '../api/search/sublet_api'
import UseChrome from './instructions/UseChrome'
import { clearIntelList } from '../actions/intel/intel_actions'
import { sendOffToDynamoDB } from '../api/intel/intel_api'
import { unauthRoleStudent, } from '../api/aws/aws-cognito'
import { saveStudentProfile, getStudentProfile } from '../api/signing/sublet_contract_api'

class AppRoot extends Component {

  constructor() {
    super()
    this.state = {
      toggle_modal: false,
      modal_name: '',              // name of the modal
      context: {},
    }
  }

	componentWillMount() {
    // automatically set language
    this.autoSetLanguage()
    // detect browser and limit to chrome
    this.detectBrowser()
    // check if its a mobile device
    this.checkIfMobile()
    // begin the facebook login process
    this.initiateFacebookProcess()
    // execute processes depending on if we're on sublet or lease
    this.executeOnSubletOrLease()
    // execute on url name
    this.executeOnURL()
    // being Intel collection
    this.beginCollectingIntel()
  }

  detectBrowser() {
    // detech if using chrome and throw popup modal if not
    const chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1
    if (!chrome) {
      this.setState({
        toggle_modal: true,
        modal_name: 'chrome',
      })
    }
  }

  checkIfMobile() {
    if (screen.width <= 600 || screen.height <= 740){
			window.location.href = ' http://rentburrow-static-mobile.s3-website-us-east-1.amazonaws.com/'
		}
  }

  autoSetLanguage() {
    const country_code = locale()
    setLanguageFromLocale(country_code).then((language_code) => {
      this.props.changeAppLanguage(language_code)
    })
  }

  initiateFacebookProcess() {
    initiateFacebook().then(() => {
      // autologin to facebook if possible
      return checkIfFacebookLoggedIn()
    }).then((fbProfile) => {
      saveStudentProfile(fbProfile)
      .then((data) => {
        return getStudentProfile({ student_id: data.student_id, })
      })
      .then((data) => {
        this.props.saveTenantToRedux(JSON.parse(data))
      })
      const onSublet = this.props.location.pathname === '/sublet' || this.props.location.pathname === '/sublets'
      if (onSublet) {
        scrapeFacebookSublets(fbProfile)
      }
    }).catch((err) => {
      // no facebook login, use AWS Cognito Unauth role
      unauthRoleStudent().then((unauthUser) => {
        // console.log(unauthUser)
				// this.props.saveTenantToRedux(unauthUser)
			})
      // in X seconds, force login popup
      setTimeout(() => {
        this.props.triggerForcedSignin(true)
      }, 300000)
    })
  }

  executeOnSubletOrLease() {
    const location = this.props.location.pathname
    const onSublet = location === '/sublet' || location === '/sublets'
    const onLease = location === '/lease' || location === '/leases'
    if (onSublet) {
      this.props.changeRentType('sublet')
      querySubletsInArea({
        ...this.props.current_gps_center,
        filterParams: this.props.sublet_filter_params,
      }).then((data) => {
        this.props.saveSubletsToRedux(data)
      })
    }
    if (onLease) {
      this.props.changeRentType('lease')
    }
  }

  executeOnURL() {
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

  beginCollectingIntel() {
    setInterval(() => {
      sendOffToDynamoDB(this.props.collectedRawIntel)
      this.props.clearIntelList()
    }, 10000)
  }

  renderAppropriateModal(modal_name, context) {
    if (modal_name === 'chrome') {
      return this.renderChromeMessage()
    }
    return null
  }

  // toggle modal
  toggleModal(bool, attr, context) {
    this.setState({
      toggle_modal: bool,
      modal_name: attr,
      context,
    })
  }

  renderChromeMessage() {
    return (
      <UseChrome
        toggleModal={(x, y, z) => this.toggleModal(x, y, z)}
      />
    )
  }

  // note that we have <StyleRoot>, which must be defined in order to use Radium
  // <StyleRoot> enables Radium styling to be used in all child compts
  // hence why the most outer div uses inline styles
	render() {
		return (
      <div style={
        {
    			width: '100vw',
    			height: '100vh',
        }
      }
      >
        <Helmet>
          <html lang={this.props.language}></html>
        </Helmet>
        <StyleRoot>
          <div style={comStyles().main}>

        <Modal dimmer='blurring' open={this.state.toggle_modal} onClose={() => this.toggleModal(false)}>
            {
              this.renderAppropriateModal(this.state.modal_name, this.state.context)
            }
        </Modal>

            <div id='language_tag' value={this.props.language} />

            <Header style={comStyles().header} />

            <div style={comStyles().content}>

              <Switch>
                <Route exact path='/' component={HousingPage} />
                <Route exact path='/sandbox' component={Feature} />
                <Route exact path='/community' component={CommunityPage} />

                <Route exact path='/lease' component={HousingPage} />
                <Route exact path='/leases' component={HousingPage} />

                <Route exact path='/sublet' component={HousingPage} />
                <Route exact path='/sublets' component={HousingPage} />

                <Route exact path='/sublet/:sublet_id' component={SubletPage} />

                <Route exact path='/account' component={TenantAccount} />
                <Route exact path='/applications' component={TenantApplications} />
                <Route exact path='/settings' component={TenantSettings} />

                <Route exact path='/:building_alias' component={BuildingPage} />

                <Switch>
                  <Route path='/signing/sublet' component={SubletApplication} />
                  <Route path='/signing/lease' component={SubletApplication} />
                </Switch>

                {/* Route Mobile Site to Here .... */}
              </Switch>

            </div>

            {
              this.props.selected_building && false
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
  triggerForcedSignin: PropTypes.func.isRequired,
  selected_building: PropTypes.object,
  language: PropTypes.string.isRequired,
  changeAppLanguage: PropTypes.func.isRequired,
  changeRentType: PropTypes.func.isRequired,
  saveSubletsToRedux: PropTypes.func.isRequired,
	current_gps_center: PropTypes.object.isRequired,
  sublet_filter_params: PropTypes.object.isRequired,
  collectedRawIntel: PropTypes.array,
  clearIntelList: PropTypes.func.isRequired,
}

AppRoot.defaultProps = {
  children: {},
  location: {},
  selected_building: null,
  collectedRawIntel: [],
}

const RadiumHOC = Radium(AppRoot)

const mapReduxToProps = (redux) => {
	return {
    selected_building: redux.selection.selected_building,
    language: redux.app.selected_language,
    current_gps_center: redux.filter.current_gps_center,
    sublet_filter_params: redux.filter.sublet_filter_params,
    collectedRawIntel: redux.intel.collectedRawIntel,
	}
}

export default withRouter(connect(mapReduxToProps, {
  dispatchActionsToRedux,
  saveTenantToRedux,
  triggerForcedSignin,
  changeAppLanguage,
  changeRentType,
  saveSubletsToRedux,
  clearIntelList,
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
