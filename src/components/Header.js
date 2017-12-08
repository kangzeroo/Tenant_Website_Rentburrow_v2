// This is the header of rentburrow landlord's dashboard.

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import { fadeInDown } from 'react-animations'
import { Link, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import firebase from 'firebase'
import {
  xMidBlue,
  xLightBlue,
  xDeepBlue,
} from '../styles/base_colors'
import {
  Icon,
  Image,
  Button,
  Modal,
  Dropdown,
  Popup,
} from 'semantic-ui-react'
import LoginPopup from './auth/LoginPopup'
import i18n from '../i18n/translator'
import { languageOptions } from '../i18n/language_options'
import {
  WELCOME_MESSAGE,
} from '../i18n/phrases/Header_i18n'
import { changeAppLanguage } from '../actions/app/app_actions'
import SearchInput from './filter/SearchInput'
import { queryBuildingsInArea } from '../api/search/search_api'
import { saveBuildingsToRedux } from '../actions/search/search_actions'
import PropertyRequest from './requests/PropertyRequest'

class Header extends Component {

  constructor() {
    super()
    this.state = {
      toggle_modal: false,
      modal_name: '',
      context: null,
    }
  }

  toggleModal(bool, attr, context) {
    this.setState({
      toggle_modal: bool,
      modal_name: attr,
      context: context
    })
  }

  renderAppropriateModal(modal_name, context) {
    if (modal_name === 'login') {
      return this.renderLoginSuite('login')
    } else if (modal_name === 'signup') {
      return this.renderLoginSuite('signup')
    } else if (modal_name === 'request') {
      return this.renderRequest()
    }
    return null
  }

  renderRequest() {
    return (
      <Modal.Content inverted>
        <PropertyRequest
        />
      </Modal.Content>
    )
  }

  renderLoginSuite(context) {
    return (
        <div style={comStyles().login_modal}>
          {
            this.props.rent_type === 'sublet' && this.props.force_signin
            ?
            null
            :
            <Button
              circular
              icon='close'
              size='big'
              style={comStyles().close_login}
              onClick={() => this.toggleModal(false)}
            />
          }
          <Modal.Content>
            <LoginPopup
              toggleModal={() => this.toggleModal(false)}
              context={context}
            />
          </Modal.Content>
        </div>
    )
  }

  refreshEverything() {
    if (this.props.location.pathname === '/') {
      queryBuildingsInArea({
        ...this.props.current_gps_center,
  			filterParams: this.props.lease_filter_params,
  		}).then((buildings) => {
  			this.props.saveBuildingsToRedux(buildings)
  		})
    }
  }

  handleTenantChange(e, value) {
    if (value.value === 'account') {
      this.props.history.push('/account')
    } else if (value.value === 'sublet_apps') {
      this.props.history.push('/sublet_applications')
    } else if (value.value === 'lease_apps') {
      this.props.history.push('/lease_applications')
    } else if (value.value === 'pro_tips') {
      this.props.history.push('/protips')
    } else if (value.value === 'privacy_policy') {
      this.props.history.push('/privacy-policy')
    } else if (value.value === 'logout') {
      this.props.history.push('/logout')
    }
  }

  renderProfileDropdown() {
    const trigger = (
      <span style={profileStyles().profile_div}>
        <Image
          src={this.props.tenant_profile.thumbnail}
          shape='circular'
          bordered
          style={comStyles().tenant_thumbnail}
        />
        <Icon name='content' inverted size='big' />
      </span>
    )

    const options = [
      { key: 'user', value: 'account', text: 'Edit Profile', icon: 'user' },
      { key: 'sublet_apps', value: 'sublet_apps', text: 'Sublet Applications', icon: 'file text' },
      // { key: 'lease_apps', value: 'lease_apps', text: 'Lease Applications', icon: 'file text outline' },
      // { key: 'pro_tips', value: 'pro_tips', text: 'Renting Pro-Tips', icon: 'star' },
      // { key: 'privacy_policy', value: 'privacy_policy', text: 'Privacy Policy', icon: 'privacy' },
      { key: 'sign-out', value: 'logout', text: 'Sign Out', icon: 'sign out' }
    ]

    return (
      <Dropdown
        trigger={trigger}
        options={options}
        pointing='top right'
        icon={null}
        onChange={(e, value) => this.handleTenantChange(e, value)}
      />
    )
  }

  render() {
    return (
        <div id='Header' style={comStyles().header}>
          <div style={comStyles().leftFloat}>
            <Link to='/' onClick={() => this.refreshEverything()}>
              <img style={comStyles().logo} src='https://s3.amazonaws.com/rentburrow-static-assets/Logos/rbdesktop.png' alt='logo' />
            </Link>
          </div>
          {
            this.props.history.location.pathname === '/' || this.props.history.location.pathname === '/lease' || this.props.history.location.pathname === '/leases' || this.props.history.location.pathname === '/sublet' || this.props.history.location.pathname === '/sublets'
            ?
            <SearchInput
              style={comStyles().searchContainer}
            />
            :
            null
          }

          {/*
          <div style={comStyles().righterFloat}>
            <h3> { i18n(WELCOME_MESSAGE) } </h3>
            <Dropdown placeholder='Change Language' onChange={(e, data) => this.props.changeAppLanguage(data.value)} selection options={languageOptions()} />
          </div>*/}
          {
            this.props.authenticated
            ?
            <div style={comStyles().user_container} >
              <Icon onClick={() => this.props.history.push('/contact')} name='help circle' inverted size='big' style={comStyles().helpIcon} />
              {/*}<Button
                basic
                inverted
                content='Request a Photoshoot'
                style={comStyles().login}
                onClick={() => this.toggleModal(true, 'request')}
              />*/}
              { this.renderProfileDropdown() }
            </div>
            :
            <div style={comStyles().rightFloat}>
              {/*}<Icon onClick={() => this.props.history.push('/contact')} name='help circle' inverted size='big' style={comStyles().helpIcon} />*/}
              {/*}<Button
                basic
                inverted
                content='Request a Photoshoot'
                style={comStyles().login}
                onClick={() => this.toggleModal(true, 'request')}
              />*/}
            {/*  <Button
                onClick={() => this.toggleModal(true, 'login')}
                style={comStyles().login}
                basic
                inverted
                content='Login'
              />*/}
              <div key='help' style={comStyles().login} onClick={() => this.props.history.push('/contact')}>
                Help
              </div>
              <div key='signup' style={comStyles().login} onClick={() => this.toggleModal(true, 'signup')}>
                Sign Up
              </div>
              <div key='login' style={comStyles().login} onClick={() => this.toggleModal(true, 'login')}>
                Log In
              </div>
            </div>
          }
          {
            this.props.rent_type === 'sublet' && this.props.force_signin && this.state.modal_name !== 'login'
            ?
            <Modal dimmer='blurring' open={true} onClose={() => this.toggleModal(false)}>
              {
                this.renderLoginSuite()
              }
     				</Modal>
            :
            null
          }
          <Modal dimmer='blurring' open={this.state.toggle_modal} onClose={() => this.toggleModal(false)}>
            {
              this.renderAppropriateModal(this.state.modal_name, this.state.context)
            }
   				</Modal>
        </div>
    );
  }
}

// defines the types of variables in this.props
Header.propTypes = {
	history: PropTypes.object.isRequired,
  location: PropTypes.object,
  authenticated: PropTypes.bool,
  tenant_profile: PropTypes.object,
  changeAppLanguage: PropTypes.func.isRequired,
  saveBuildingsToRedux: PropTypes.func.isRequired,
  current_gps_center: PropTypes.object.isRequired,
  lease_filter_params: PropTypes.object.isRequired,
  sublet_filter_params: PropTypes.object.isRequired,
  force_signin: PropTypes.bool,
  rent_type: PropTypes.string.isRequired,
}

// for all optional props, define a default value
Header.defaultProps = {
  authenticated: false,
  tenant_profile: {},
  location: {},
  search_radius: 1000,
  force_signin: false,
}

const RadiumHOC = Radium(Header)

const mapReduxToProps = (redux) => {
  return {
    tenant_profile: redux.auth.tenant_profile,
    authenticated: redux.auth.authenticated,
		current_gps_center: redux.filter.current_gps_center,
    lease_filter_params: redux.filter.lease_filter_params,
    sublet_filter_params: redux.filter.sublet_filter_params,
    rent_type: redux.filter.rent_type,
    force_signin: redux.auth.force_signin,
  }
}

export default withRouter(
  connect(mapReduxToProps, {
    changeAppLanguage,
    saveBuildingsToRedux,
  })(RadiumHOC)
)

// ===================================================

const comStyles = () => {
  return {
    fadeInDown: {
      animation: 'x 1.5s',
      animationName: Radium.keyframes(fadeInDown, 'fadeInDown')
    },
    header: {
      backgroundColor: xMidBlue,
      height: '6vh',
      width: '100%',
      zIndex: '1',
      display: 'flex',
      flexDirection: 'row',
      position: 'relative',
    },
    leftFloat: {
      float: 'left',
    },
    logo: {
      height: '100%',
      display: 'inline-block',
      width: 'auto',
      float: 'left',
      padding: '5px'
    },
    login: {
      // height: 'auto',
      // width: 'auto',
      cursor: 'pointer',
      fontWeight: 'bold',
      color: 'white',
      fontSize: '1.2rem',
      ':hover': {
				textDecoration: 'underline'
			}
    },
    tenant_thumbnail: {
      height: '6vh',
      width: 'auto',
      margin: '0.5vh'
    },
    searchContainer: {
      height: '5vh',
      width: 'auto',
    },
    rightFloat: {
      position: 'absolute',
      alignSelf: 'center',
      zIndex: 100,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '200px',
      right: '20px'
    },
    righterFloat: {
      color: 'white',
      display: 'flex',
      flexDirection: 'row',
      width: '500px',
      margin: '20px auto'
    },
    link: {
      margin: '10px',
    },
    user_container: {
      display: 'flex',
      flexDirection: 'row',
      right: '20px',
      top: '0px',
      position: 'absolute',
      maxHeight: '7vh',
      maxWidth: '350px',
      alignItems: 'center',
    },
    close_login: {
      position: 'absolute',
      top: '10px',
      right: '10px',
    },
    helpIcon: {
      cursor: 'pointer',
    },
  }
}

const profileStyles = () => {
  return {
    profile: {
      height: '100%',
      width: '200px',
      float: 'right',
      margin: 'auto 20px auto auto',
      display: 'flex',
      flexDirection: 'row',
      color: 'white',
      cursor: 'pointer',
      backgroundColor: xDeepBlue,
      justifyContent: 'space-around',
      alignItems: 'center',
    },
    thumb: {
      maxHeight: '40px',
      minHeight: '40px',
      maxWidth: '40px',
      minWidth: '40px',
      width: '40%',
    },
    icon: {
      fontSize: '2rem',
      margin: '10px auto',
      width: '40%',
      outline: '0px'
    },
    profileContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-around',
      height: '7vh',
    },
    nameContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
    name: {
      fontSize: '1.2rem',
      width: '100%',
    },
    corpname: {
      fontSize: '0.8rem',
      width: '100%'
    },
    profile_div: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    menu_icon: {
      display: '10px auto',
      width: '100%',
      height: '100%',
    }
  }
}
