// This is the header of rentburrow landlord's dashboard.

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
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
} from 'semantic-ui-react'
import LoginPopup from './auth/LoginPopup'
import i18n from '../i18n/translator'
import { languageOptions } from '../i18n/language_options'
import {
  WELCOME_MESSAGE,
} from '../i18n/phrases/Header_i18n'
import { changeAppLanguage } from '../actions/app/app_actions'

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
      return this.renderLoginSuite()
    }
    return null
  }

  renderLoginSuite() {
    return (
      <Modal.Content>
        <LoginPopup toggleModal={() => this.toggleModal()} />
      </Modal.Content>
    )
  }

  render() {
    return (
        <div style={comStyles().header}>
          <div style={comStyles().leftFloat}>
            <Link to='/'>
              <img style={comStyles().logo} src='https://s3.amazonaws.com/rentburrow-static-assets/Logos/rbdesktop.png' alt='logo' />
            </Link>
          </div>
          {/*
          <div style={comStyles().righterFloat}>
            <h3> { i18n(WELCOME_MESSAGE) } </h3>
            <Dropdown placeholder='Change Language' onChange={(e, data) => this.props.changeAppLanguage(data.value)} selection options={languageOptions()} />
          </div>*/}
          <div style={comStyles().rightFloat}>
            {
              this.props.authenticated
              ?
              <div>
                <Image src={this.props.tenant_profile.picurl} />
                { this.props.tenant_profile.name }
              </div>
              :
              <Button onClick={() => this.toggleModal(true, 'login')} style={comStyles().login}>Login</Button>
            }
          </div>


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
  authenticated: PropTypes.bool,
  tenant_profile: PropTypes.object,
  changeAppLanguage: PropTypes.func.isRequired,
}

// for all optional props, define a default value
Header.defaultProps = {
  authenticated: false,
  tenant_profile: {},
}

const RadiumHOC = Radium(Header)

const mapReduxToProps = (redux) => {
  return {
    tenant_profile: redux.auth.tenant_profile,
    authenticated: redux.auth.authenticated,
  }
}

export default withRouter(
  connect(mapReduxToProps, {
    changeAppLanguage,
  })(RadiumHOC)
)

// ===================================================

const comStyles = () => {
  return {
    header: {
      backgroundColor: xMidBlue,
      padding: '0px',
      height: '7vh',
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
      height: '5vh',
      width: 'auto',
      float: 'left',
      margin: '1vh'
    },
    rightFloat: {
      position: 'absolute',
      right: '0px',
      top: '0px',
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
    }
  }
}
