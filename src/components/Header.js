// This is the header of rentburrow landlord's dashboard.

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import { fadeInDown } from 'react-animations'
import { Link, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
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
import FavoriteForceSignin from './tenant/favorites/FavoriteForceSignin'
import i18n from '../i18n/translator'
import { languageOptions } from '../i18n/language_options'
import {
  WELCOME_MESSAGE,
} from '../i18n/phrases/Header_i18n'
import { changeAppLanguage } from '../actions/app/app_actions'
import SearchInput from './filter/SearchInput'
import ContactUsForm from './community/student_info/forms/ContactUsForm'
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

      show_favorites_header: true,
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
      // return this.renderLoginSuite('signup')
    } else if (modal_name === 'post_ad') {
      return this.renderPostAd()
    } else if (modal_name === 'contact') {
      return this.renderContact()
    } else if (modal_name === 'request') {
      return this.renderRequest()
    } else if (modal_name === 'sublet') {
      return this.renderSubletForm()
    }
    return null
  }

  renderPostAd() {
    return (
      <Modal.Content inverted>
        <div style={comStyles().post_ad}>
          <div onClick={() => this.clickedPostStudentSublet()} style={comStyles().post_ad_option}>
            <b>Students</b>
            <br/>
            Post a 4 Month Sublet
            <br/>
            <h5 style={{ color: 'white' }}>* Facebook login required</h5>
          </div>
          <div onClick={() => this.toggleModal(true, 'contact')} style={comStyles().post_ad_option}>
            <b>Landlords</b>
            <br/>
            Contact us
          </div>
        </div>
      </Modal.Content>
    )
  }

  clickedPostStudentSublet() {
    this.toggleModal(false)
    this.props.history.push('/postsublet')
  }

  renderContact() {
    return (
      <Modal.Content inverted>
        <ContactUsForm />
      </Modal.Content>
    )
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

  showFavorites() {
    const favs = JSON.parse(localStorage.getItem('favorites')).map(s => s.building_id)
    const buildings = this.props.building_search_results.filter((building) => {
      return favs.indexOf(building.building_id) > -1
    })

    Promise.all(buildings)
    .then((data) => {
      this.props.saveBuildingsToRedux(data)
      this.setState({
        show_favorites_header: false,
      })
    })
  }

  showAllBuildings() {
    this.refreshEverything()
    this.setState({
      show_favorites_header: true,
    })
  }

  renderProfileDropdown() {
    const trigger = (
      <span style={profileStyles().profile_div}>
        {
          this.props.tenant_profile.thumbnail
          ?
          <Image
            src={this.props.tenant_profile.thumbnail}
            shape='circular'
            bordered
            style={comStyles().tenant_thumbnail}
          />
          :
          <h3 style={comStyles().tenant_name}>{this.props.tenant_profile.first_name}</h3>
        }
        <Icon name='content' inverted size='big' />
      </span>
    )

    const options = [
      { key: 'user', value: 'account', text: 'Edit Profile', icon: 'user' },
      // { key: 'favorites', value: 'favorites', text: 'Favorites', icon: 'heart' },
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
        floating
        onChange={(e, value) => this.handleTenantChange(e, value)}
      />
    )
  }

  render() {
    return (
        <div id='Header' style={comStyles().header}>
          <div style={comStyles().leftFloat}>
            <Link to='/' onClick={() => this.refreshEverything()}>
              {/*<img style={comStyles().logo} src='https://s3.amazonaws.com/rentburrow-static-assets/Logos/rbdesktop.png' alt='logo' />*/}
              <h1 style={comStyles().font_logo}>Rent Hero</h1>
            </Link>
          </div>
          {
            (this.props.history.location.pathname === '/' || this.props.history.location.pathname === '/lease' ||
            this.props.history.location.pathname === '/leases' || this.props.history.location.pathname === '/sublet' ||
            this.props.history.location.pathname === '/sublets')
            ?
            <SearchInput
              style={comStyles().searchContainer}
            />
            :
            null
          }


          {
            this.props.authenticated
            ?
            <div style={comStyles().user_container} >
              <div role='button' tabIndex={0} key='tours' style={comStyles().login} onClick={() => this.props.history.push('/tours')}>
                Local Tours
              </div>
              {
                (this.props.history.location.pathname === '/' || this.props.history.location.pathname === '/lease' ||
                this.props.history.location.pathname === '/leases')
                ?
                <div>
                  {
                    this.state.show_favorites_header
                    ?
                    <div role='button' tabIndex={0} key='favorites' style={comStyles().login} onClick={() => { this.showFavorites() }}>
                      My Favorites
                    </div>
                    :
                    <div role='button' tabIndex={0} key='show_all' style={comStyles().login} onClick={() => { this.showAllBuildings() }}>
                      All Buildings
                    </div>
                  }
                </div>
                :
                null
              }
              <div role='button' tabIndex={0} key='post_add' style={comStyles().login} onClick={() => this.toggleModal(true, 'post_ad')}>
                Post Ad
              </div>
              <div role='button' tabIndex={0} key='help' style={comStyles().login} onClick={() => this.props.history.push('/contact')}>
                Help
              </div>

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
              <div role='button' tabIndex={0} key='tours' style={comStyles().login} onClick={() => this.props.history.push('/tours')}>
                Local Tours
              </div>
              <div role='button' tabIndex={0} key='post_add' style={comStyles().login} onClick={() => this.toggleModal(true, 'post_ad')}>
                Post Ad
              </div>
              <div role='button' tabIndex={0} key='help' style={comStyles().login} onClick={() => this.props.history.push('/contact')}>
                Help
              </div>
              <div role='button' tabIndex={0} key='login' style={comStyles().login} onClick={() => this.toggleModal(true, 'login')}>
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
          {
            this.props.temporary_favorite_force_signin && this.props.temporary_favorite_force_signin.building_id
            ?
            <FavoriteForceSignin />
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
  temporary_favorite_force_signin: PropTypes.object,
  building_search_results: PropTypes.array.isRequired,
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
    temporary_favorite_force_signin: redux.auth.temporary_favorite_force_signin,
    building_search_results: redux.search.building_search_results,
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
      minHeight: '7vh',
      maxHeight: '7vh',
      minWidth: '100vw',
      maxWidth: '100vw',
      zIndex: '1',
      display: 'flex',
      flexDirection: 'row',
      position: 'relative',
    },
    leftFloat: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      float: 'left',
    },
    logo: {
      minHeight: '50px',
      maxHeight: '50px',
      display: 'inline-block',
      minWidth: '225px',
      maxWidth: 'auto',
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
      margin: '0.5vh',
    },
    tenant_name: {
      height: '6vh',
      width: 'auto',
      margin: '0.5vh',
      color: 'white',
      lineHeight: '6vh',
      fontWeight: 'bold',
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
      width: '300px',
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
      justifyContent: 'space-around',
      right: '20px',
      top: '0px',
      position: 'absolute',
      maxHeight: '7vh',
      minWidth: '500px',
      maxWidth: '500px',
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
    font_logo: {
      color: 'white',
      fontFamily: `'Carter One', cursive`,
      margin: '0px 0px 0px 20px',
    },
    post_ad: {
      display: 'flex',
      flexDirection: 'row',
    },
    post_ad_option: {
      padding: '30px',
      fontSize: '2rem',
      fontWeight: 'bold',
      width: '48%',
      margin: '5px auto',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      backgroundColor: xMidBlue,
      cursor: 'pointer',
      borderRadius: '10px',
    }
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
