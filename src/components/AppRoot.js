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
import Fingerprint2 from 'fingerprintjs2'
import {
  Switch,
  Route,
  withRouter,
} from 'react-router-dom'
import {
  Modal,
  Segment,
  Dimmer,
  Loader,
} from 'semantic-ui-react'
import locale from 'browser-locale'
import { Helmet } from 'react-helmet'
import Header from './Header'
import Footer from './Footer'
import Chat from './chat/ChatPopup/Chat'
import ToastLauncher from './chat/Toast/ToastLauncher'
import LandingPage from './instructions/LandingPage'
import ProTipsPage from './community/student_info/ProTipsPage'
import PrizesPage from './community/student_info/PrizesPage'
import UberSignup from './scheduling/uber/UberSignup'
import LandlordTourConfirmation from './scheduling/timing/LandlordTourConfirmation'
import ContactUs from './instructions/ContactUs'
import ForgotPasswordPage from './auth/ForgotPasswordPage'
// import PrivacyPolicyPage from './community/student_info/PrivacyPolicyPage'
// import TermsOfServicePage from './community/student_info/TermsOfServicePage'
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
import InvalidPage from './invalid/InvalidPage'
import Authenticate from './pandadoc/Authenticate'
import Authenticated from './pandadoc/Authenticated'
import LoginPage from './auth/LoginPage'
import Logout from './auth/Logout'
import Register from './auth/Register'
import ForgotPassword from './auth/ForgotPassword'
import AccountVerification from './auth/AccountVerification'
import ExampleSubletPaperwork from './contracts/sublets/ExampleSubletPaperwork'
import ExampleEncryptionS3 from './examples/ExampleEncryptionS3'
import MyFavorites from './favorites/MyFavorites'
import ToursPage from './tours/ToursPage'
import Apology from './instructions/Apology'
import PostSubletPage from './sublets/PostSubletPage'
import MySubletAds from './sublets/MySubletAds'
import Test from './requests/Test'

import MobileHeader from './mobile/components/MobileHeader'
import MobilePage from './mobile/MobilePage'
import MobileBuildingPage from './mobile/components/buildings/MobileBuildingPage'
import MobileLandlordTourConfirmation from './mobile/scheduling/MobileLandlordTourConfirmation'
import TermsOfUsePage from './instructions/Legal/TermsOfUsePage'
import PrivacyPolicyPage from './instructions/Legal/PrivacyPolicyPage'
import BothPolicies from './instructions/Legal/BothPolicies'
import RedeemGift from './instructions/RedeemGift'

import { dispatchActionsToRedux } from '../actions/system/system_actions'
import { redirectPath, setLanguageFromLocale, checkIfPartOfRoutes } from '../api/general/general_api'
import { getInitialToastMessages } from '../api/messaging/toast_api'
import { initiateFacebook, checkIfFacebookLoggedIn } from '../api/auth/facebook_auth'
import { saveTenantToRedux, triggerForcedSignin, forwardUrlLocation, fingerprintBrowser } from '../actions/auth/auth_actions'
import { addToastMessage, removeToastMessage } from '../actions/messaging/toast_actions'
import { changeAppLanguage } from '../actions/app/app_actions'
import { scrapeFacebookSublets } from '../api/sublet/fb_sublet_scrapper'
import { changeRentType, saveSubletsToRedux } from '../actions/search/search_actions'
import { querySubletsInArea } from '../api/search/sublet_api'
import UseChrome from './instructions/UseChrome'
import { clearIntelList, saveIntelToCloud } from '../actions/intel/intel_actions'
import { unauthRoleStudent, retrieveTenantFromLocalStorage } from '../api/aws/aws-cognito'
import { saveTenantProfile, getTenantProfile } from '../api/auth/tenant_api'
import { updateDocumentStatus, } from '../api/pandadoc/pandadoc_api'
import '../styles/pretty_scrollbar.css'
import '../styles/custom_font.css'

import MenuPopup from './menu/MenuPopup'


class AppRoot extends Component {

  constructor() {
    super()
    this.state = {
      toggle_modal: false,
      modal_name: '',              // name of the modal
      context: {},

      mobile: true,
    }
  }

	componentWillMount() {
    // check if its a mobile device
    if (/Mobi/.test(navigator.userAgent)) {
      window.location.href = `https://m.renthero.ca${this.props.location.pathname}`
    } else {
      this.setState({
        mobile: false,
      })
      // create a unique identifier for the browser
      this.fingerprintBrowser()
      // automatically set language
      this.autoSetLanguage()
      // detect browser and limit to chrome
      // this.detectBrowser()
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
      // execute initial Toast messages
      this.launchToasts()
    }
  }

  fingerprintBrowser() {
    new Fingerprint2().get((result, components) => {
      // console.log(result) // a hash, representing your device fingerprint
      // console.log(components) // an array of FP components
      this.props.fingerprintBrowser(result)
    })
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
    const p = new Promise((res, rej) => {
      if (/Mobi/.test(navigator.userAgent)) {
  			window.location.href = 'https://m.renthero.ca'
        rej()
      } else {
        res()
      }
    })
    return p
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
          if (checkIfPartOfRoutes(this.props.location_forwarding)) {
            this.props.history.push(this.props.location_forwarding)
          }
      })
      .catch((err) => {
        _LTracker.push({
          'error': err,
          'tag' : `${localStorage.getItem('tenant_id')}`
        })
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
      this.checkIfTenantLoggedIn()
    }
  }

  checkIfTenantLoggedIn() {
    // grab the url that was given, will be used in this.saveStaffProfile()
    let location = this.props.location.pathname + this.props.location.search
    if (location === '/login') {
      location = '/'
    }
    retrieveTenantFromLocalStorage()
			.then((data) => {
        return getTenantProfile({ tenant_id: data.sub })
			})
      .then((tenant) => {
        this.props.saveTenantToRedux(tenant)
      })
			.catch((err) => {
        _LTracker.push({
          'error': err,
          'tag' : `${localStorage.getItem('tenant_id')}`
        })
				// if not, then we do nothing
        unauthRoleStudent().then((unauthUser) => {
          // console.log(unauthUser)
          this.props.saveTenantToRedux(unauthUser)
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
    const pathname = this.props.location.pathname
    const search = this.props.location.search
    // take the path in the url and go directly to that page and save to redux any actions necessary
    if (pathname !== '/') {
      // use forwardUrlLocation when you have a path that requires a login first (privately available)
      // use PossibleRoutes.js when you have a path that is publically available
      this.props.forwardUrlLocation(pathname + search)
      // if not, then we do nothing
      redirectPath(pathname + search).then(({ path, actions }) => {
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

  launchToasts() {
    setTimeout(() => {
      getInitialToastMessages(this.props.location).forEach((toast, index) => {
        const time = index * 1000
        setTimeout(() => {
          this.props.addToastMessage(toast)
        }, time)
      })
    }, 5000)
    setTimeout(() => {
      getInitialToastMessages(this.props.location).forEach((toast) => {
        this.props.removeToastMessage(toast.id)
      })
    }, 15000)
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

  renderMainSite() {
    const hideFooter = this.props.location.pathname === '/' || this.props.location.pathname === '/sublets' || this.props.location.pathname === '/leases' || this.props.location.pathname === '/sublet' || this.props.location.pathname === '/lease'
    return (
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
                <Route exact path='/sandbox' component={Test} />
                <Route exact path='/invalid' component={InvalidPage} />
                {/*<Route exact path='/welcome' component={LandingPage} />*/}
                {/*<Route exact path='/protips' component={ProTipsPage} />*/}
                {/*<Route exact path='/uber' component={UberSignup} />*/}
                {/*<Route exact path='/prizes' component={PrizesPage} />*/}
                {/*<Route exact path='/terms' component={TermsOfServicePage} />*/}
                {/*<Route exact path='/privacy' component={PrivacyPolicyPage} />*/}
                <Route exact path='/apology' component={Apology} />
                <Route exact path='/contact' component={ContactUs} />
                {/*<Route exact path='/claimprize' component={RedeemGift} />*/}
                <Route exact path='/book-filming' component={BookAFilmingPage} />
                <Route exact path='/postsublet' component={PostSubletPage} />
                <Route exact path='/my-ads' component={MySubletAds} />
                {/*<Route exact path='/landlord-confirm-tour/:tour_id' component={LandlordTourConfirmation} />*/}
                {/*<Route exact path='/how-it-works' component={HowItWorksLandlord} />*/}
                {/*<Route exact path='/pricing' component={PricingLandlord} />*/}
                {/*<Route exact path='/landlord-faq' component={FAQLandlord} />*/}
                <Route exact path='/join-landlord' component={JoinPageLandlord} />
                {/*<Route exact path='/community' component={CommunityPage} />*/}

                <Route exact path='/register' component={Register} />
                <Route exact path='/register/verify' component={AccountVerification} />
                <Route exact path='/login/forgot' component={ForgotPasswordPage} />
                <Route exact path='/login' component={LoginPage} />
                <Route exact path='/logout' component={Logout} />
                <Route exact path='/termsofuse' component={TermsOfUsePage} />
                <Route exact path='/privacypolicy' component={PrivacyPolicyPage} />
                <Route exact path='/termsandconditions' component={BothPolicies} />

                <Route exact path='/tours' component={ToursPage} />

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
                <Route exact path='/favorites' component={MyFavorites} />
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

            {
              hideFooter
              ?
              null
              :
              <Footer />
            }

          </div>

          {
            this.props.tenant_profile && this.props.tenant_profile.tenant_id && false
            ?
            <Chat style={comStyles().chat} />
            :
            null
          }

          <ToastLauncher style={comStyles().toast_launcher} />
          {
            this.props.menu
            ?
            <MenuPopup />
            :
            null
          }

        </div>
      </StyleRoot>
    )
  }

  renderMobileSite() {
    return (
      <StyleRoot>
        <MobileHeader style={comStyles().header} />
        <div id='main_content' className='pretty_scrollbar' style={comStyles().content}>
          <Switch>
            <Route exact path='/' component={MobilePage} />
            <Route exact path='/:building_alias' component={MobileBuildingPage} />
            <Route exact path='/landlord-confirm-tour/:tour_id' component={MobileLandlordTourConfirmation} />
          </Switch>
        </div>
      </StyleRoot>
    )
  }

  // note that we have <StyleRoot>, which must be defined in order to use Radium
  // <StyleRoot> enables Radium styling to be used in all child compts
  // hence why the most outer div uses inline styles
	render() {
    // const hideFooter = true
		return (
      <div id='AppRoot' style={this.state.mobile ? comStyles().mobile_main : comStyles().main}>
        <Helmet>
          <html lang={this.props.language}></html>
          <title>{ this.props.html_title }</title>
          <meta name='thumbnail' content={this.props.meta_thumbnail} />
        </Helmet>
        {
          this.state.mobile
          ?
          <Segment style={comStyles().loadingContainer}>
            <Dimmer active inverted>
              <Loader size='massive' inverted>Loading</Loader>
            </Dimmer>
          </Segment>
          :
          this.renderMainSite()
        }
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
  addToastMessage: PropTypes.func.isRequired,
  removeToastMessage: PropTypes.func.isRequired,
  selected_building_to_apply_for: PropTypes.object,
  fingerprintBrowser: PropTypes.func.isRequired,
  html_title: PropTypes.string.isRequired,
  meta_thumbnail: PropTypes.string.isRequired,
  menu: PropTypes.bool.isRequired,
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
    html_title: redux.app.html_title,
    meta_thumbnail: redux.app.meta_thumbnail,
    menu: redux.menu.menu,
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
  addToastMessage,
  removeToastMessage,
  fingerprintBrowser,
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
    mobile_main: {
      minWidth: '100vw',
      maxWidth: '100vw',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      maxHeight: '100vh',
      overflowY: 'scroll',
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
      height: '-webkit-fill-available'
    },
    chat: {

    },
    loadingContainer: {
      fontFamily: 'Helvetica Neue',
      backgroundColor: 'white',
      minHeight: '100vh',
      maxHeight: '100vh',
      minWidth: '100vw',
      maxWidth: '100vw',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    font_logo: {
      fontSize: '5em',
      color: 'rgba(81, 151, 214, 1)',
      fontWeight: 'bold',
      fontFamily: `'Carter One', cursive`,
    }
	}
}
