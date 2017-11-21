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
import Footer from './Footer'
import Chat from './chat/ChatPopup/Chat'
import LandingPage from './instructions/LandingPage'
import ProTipsPage from './community/student_info/ProTipsPage'
import PrizesPage from './community/student_info/PrizesPage'
import ContactUs from './instructions/ContactUs'
import PrivacyPolicyPage from './community/student_info/PrivacyPolicyPage'
import TermsOfServicePage from './community/student_info/TermsOfServicePage'
import HowItWorksLandlord from './community/landlord_info/HowItWorksLandlord'
import BookAFilmingPage from './community/landlord_info/BookAFilmingPage'
import JoinPageLandlord from './community/landlord_info/JoinPageLandlord'
import PricingLandlord from './community/landlord_info/PricingLandlord'
import FAQLandlord from './community/landlord_info/FAQLandlord'
import CommunityPage from './community/local_businesses/CommunityPage'
import HousingPage from './housing/HousingPage'
import BuildingPage from './building/BuildingPage'
import SubletPage from './sublets/SubletPage'
import TenantAccount from './tenant/TenantAccount'
import SubletApplications from './tenant/SubletApplications/TenantSubletApplications'
import TenantLeaseApplications from './tenant/LeaseApplications/TenantLeaseApplications'
import TenantSettings from './tenant/TenantSettings'
import SubletApplication from './contracts/sublets/SubletApplication'
import LeaseApplication from './contracts/leases/LeaseApplication'
import LeaseApplicationPage from './tenant/LeaseApplications/pages/LeaseApplicationPage'
import SentApplicationPage from './tenant/SubletApplications/sublets/SentApplicationPage'
import ReceivedApplicationPage from './tenant/SubletApplications/sublets/ReceivedApplicationPage'
import Authenticate from './pandadoc/Authenticate'
import Authenticated from './pandadoc/Authenticated'
import Logout from './auth/Logout'
import ExampleSubletPaperwork from './contracts/sublets/ExampleSubletPaperwork'
import ExampleEncryptionS3 from './examples/ExampleEncryptionS3'
import { dispatchActionsToRedux } from '../actions/system/system_actions'
import { redirectPath, setLanguageFromLocale } from '../api/general/general_api'
import { initiateFacebook, checkIfFacebookLoggedIn } from '../api/auth/facebook_auth'
import { saveTenantToRedux, triggerForcedSignin, forwardUrlLocation } from '../actions/auth/auth_actions'
import { changeAppLanguage } from '../actions/app/app_actions'
import { scrapeFacebookSublets } from '../api/sublet/fb_sublet_scrapper'
import { changeRentType, saveSubletsToRedux } from '../actions/search/search_actions'
import { querySubletsInArea } from '../api/search/sublet_api'
import UseChrome from './instructions/UseChrome'
import { clearIntelList, saveIntelToCloud } from '../actions/intel/intel_actions'
import { unauthRoleStudent, } from '../api/aws/aws-cognito'
import { saveTenantProfile, getTenantProfile } from '../api/auth/tenant_api'
import { updateDocumentStatus, } from '../api/pandadoc/pandadoc_api'
import '../styles/pretty_scrollbar.css'
import '../styles/custom_font.css'


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
    // set the zoom level so that CSS displays well
    this.setZoomLevel()
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
    if (screen.width <= 600 || screen.height <= 740) {
			// window.location.href = ' http://rentburrow-static-mobile.s3-website-us-east-1.amazonaws.com/'
		}
  }

  autoSetLanguage() {
    const country_code = locale()
    setLanguageFromLocale(country_code).then((language_code) => {
      this.props.changeAppLanguage(language_code)
    })
  }

  documentStatus(tenant_id) {
    updateDocumentStatus({ tenant_id, })
  }

  initiateFacebookProcess() {
    if (localStorage.getItem('fbToken')) {
      initiateFacebook().then(() => {
        // autologin to facebook if possible
        return checkIfFacebookLoggedIn()
      })
      .then((fbProfile) => {
        const onSublet = this.props.location.pathname === '/sublet' || this.props.location.pathname === '/sublets'
        if (onSublet) {
          scrapeFacebookSublets(fbProfile)
        }
        return saveTenantProfile(fbProfile)
      })
      .then((data) => {
        // this.documentStatus(data.tenant_id)
        return getTenantProfile({ tenant_id: data.tenant_id, })
      })
      .then((data) => {
        this.props.saveTenantToRedux(data)
          // use location_forwarding when you have a path that requires a login first (privately available)
          // use PossibleRoutes.js when you have a path that is publically available
        this.props.history.push(this.props.location_forwarding)
      })
      .catch((err) => {
        // no facebook login, use AWS Cognito Unauth role
        unauthRoleStudent().then((unauthUser) => {
          // console.log(unauthUser)
          this.props.saveTenantToRedux(unauthUser)
        })
        // in X seconds, force login popup
        setTimeout(() => {
          this.props.triggerForcedSignin(true)
        }, 300000)
      })
    } else {
      unauthRoleStudent().then((unauthUser) => {
        // console.log(unauthUser)
        this.props.saveTenantToRedux(unauthUser)
      })
      // in X seconds, force login popup
      setTimeout(() => {
        this.props.triggerForcedSignin(true)
      }, 300000)
    }
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
    const pathname = this.props.location.pathname
    const search = this.props.location.search
    // take the path in the url and go directly to that page and save to redux any actions necessary
    if (pathname !== '/') {
      // use forwardUrlLocation when you have a path that requires a login first (privately available)
      // use PossibleRoutes.js when you have a path that is publically available
      this.props.forwardUrlLocation(pathname + search)
      // if not, then we do nothing
      redirectPath(pathname).then(({ path, actions }) => {
        // path = '/sage-5'
        // actions = [ { type, payload }, { type, payload } ]
        this.props.dispatchActionsToRedux(actions)
        this.props.history.push(path)
      })
    }
  }

  beginCollectingIntel() {
    setInterval(() => {
      this.props.saveIntelToCloud()
      this.props.clearIntelList()
    }, 10000)
  }

  setZoomLevel() {
    // const scale = 'scale(0.9)';
    // document.body.style.webkitTransform =  scale;    // Chrome, Opera, Safari
    // document.body.style.msTransform =   scale;       // IE 9
    // document.body.style.transform = scale;     // General
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

  forceScrollTop() {
    const main_content = document.getElementById('main_content')
    const app_root = document.getElementById('AppRoot')
    main_content.scrollTop = 0
    app_root.scrollTop = 0
  }

  // note that we have <StyleRoot>, which must be defined in order to use Radium
  // <StyleRoot> enables Radium styling to be used in all child compts
  // hence why the most outer div uses inline styles
	render() {
    // const hideFooter = true
    const hideFooter = this.props.location.pathname === '/' || this.props.location.pathname === '/sublets' || this.props.location.pathname === '/leases' || this.props.location.pathname === '/sublet' || this.props.location.pathname === '/lease'
		return (
      <div id='AppRoot' style={comStyles().main}>
        <Helmet>
          <html lang={this.props.language}></html>
        </Helmet>
        <StyleRoot>
        <div style={comStyles(hideFooter).main}>

          <Modal dimmer='blurring' open={this.state.toggle_modal} onClose={() => this.toggleModal(false)}>
              {
                this.renderAppropriateModal(this.state.modal_name, this.state.context)
              }
          </Modal>

            <div id='language_tag' value={this.props.language} />

            <Header style={comStyles().header} />

            <div id='main_content' className='pretty_scrollbar' style={comStyles().content}>

              <Switch>
                <Route exact path='/' component={HousingPage} />
                <Route exact path='/sandbox' component={ExampleEncryptionS3} />
                {/*<Route exact path='/welcome' component={LandingPage} />*/}
                {/*<Route exact path='/protips' component={ProTipsPage} />*/}
                <Route exact path='/prizes' component={PrizesPage} />
                {/*<Route exact path='/terms' component={TermsOfServicePage} />*/}
                {/*<Route exact path='/privacy' component={PrivacyPolicyPage} />*/}
                <Route exact path='/contact' component={ContactUs} />
                <Route exact path='/book-filming' component={BookAFilmingPage} />
                {/*<Route exact path='/how-it-works' component={HowItWorksLandlord} />*/}
                {/*<Route exact path='/pricing' component={PricingLandlord} />*/}
                {/*<Route exact path='/landlord-faq' component={FAQLandlord} />*/}
                <Route exact path='/join-landlord' component={JoinPageLandlord} />
                {/*<Route exact path='/community' component={CommunityPage} />*/}
                <Route exact path='/logout' component={Logout} />

                <Route exact path='/lease' component={HousingPage} />
                <Route exact path='/leases' component={HousingPage} />

                <Route exact path='/sublet' component={HousingPage} />
                <Route exact path='/sublets' component={HousingPage} />

                <Route exact path='/authenticate' component={Authenticate} />
                <Route exact path='/authenticated' component={Authenticated} />

                <Route exact path='/sublet/:sublet_id' component={SubletPage} />

                <Route exact path='/account' component={TenantAccount} />
                <Route exact path='/sublet_applications' component={SubletApplications} />
                <Route exact path='/lease_applications' component={TenantLeaseApplications} />
                <Route exact path='/applications/lease/:group_id' component={LeaseApplicationPage} />
                <Route exact path='/applications/subletee/:subletee_id' component={SentApplicationPage} />
                <Route exact path='/applications/subletor/:subletor_id' component={ReceivedApplicationPage} />
                <Route exact path='/settings' component={TenantSettings} />

                <Route exact path='/:building_alias' component={BuildingPage} />

                {
                  this.props.tenant_profile.tenant_id
                  ?
                  <Switch>
                    <Route path='/signing/sublet' component={SubletApplication} />
                    <Route path='/signing/lease/:building_id' component={LeaseApplication} />
            				<Route exact path='/signing/example/paperwork/sublet' component={ExampleSubletPaperwork} />
                  </Switch>
                  :
                  null
                }

                {/* Route Mobile Site to Here .... */}
              </Switch>

              {
                hideFooter
                ?
                null
                :
                <Footer forceScrollTop={() => this.forceScrollTop()} />
              }

            </div>

            {
              this.props.tenant_profile && this.props.tenant_profile.tenant_id
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

 // && this.props.location.pathname !== '/'

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
  // collectedRawIntel: PropTypes.array,
  clearIntelList: PropTypes.func.isRequired,
  forwardUrlLocation: PropTypes.func.isRequired,
  location_forwarding: PropTypes.string.isRequired,
  tenant_profile: PropTypes.object.isRequired,
  saveIntelToCloud: PropTypes.func.isRequired,
  selected_building_to_apply_for: PropTypes.object,
}

AppRoot.defaultProps = {
  children: {},
  location: {},
  selected_building: null,
  selected_building_to_apply_for: {},
  // collectedRawIntel: [],
}

const RadiumHOC = Radium(AppRoot)

const mapReduxToProps = (redux) => {
	return {
    selected_building: redux.selection.selected_building,
    language: redux.app.selected_language,
    current_gps_center: redux.filter.current_gps_center,
    sublet_filter_params: redux.filter.sublet_filter_params,
    // collectedRawIntel: redux.intel.collectedRawIntel,
    location_forwarding: redux.auth.location_forwarding,
    tenant_profile: redux.auth.tenant_profile,
    selected_building_to_apply_for: redux.contract.selected_building_to_apply_for,
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
  forwardUrlLocation,
  saveIntelToCloud,
})(RadiumHOC))

// =============================

const comStyles = () => {
	return {
    main: {
      minWidth: '100vw',
      maxWidth: '100vw',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      maxHeight: '100vh',
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
      overflowY: 'scroll',
      overflowX: 'hidden',
    },
    chat: {

    }
	}
}
