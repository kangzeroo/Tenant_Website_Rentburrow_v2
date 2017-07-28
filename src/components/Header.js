// This is the header of rentburrow landlord's dashboard.

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import { Link, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import firebase from 'firebase'
import {
  xMidBlue,
  xDeepBlue,
} from '../styles/base_colors'
import {
  Icon,
  Image,
  Button,
  Modal,
} from 'semantic-ui-react'
import LoginPopup from './auth/LoginPopup'

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
        <LoginPopup />
      </Modal.Content>
    )
  }

  render() {
    return (
        <div style={comStyles().header}>
          <Link to='/'>
            <div style={comStyles().leftLogo}>
              <img style={comStyles().logo} src={require('../../assets/images/logo.png')} alt='logo' />
            </div>
          </Link>
          <Link to='/housing' style={comStyles().link}><h2>FIND HOUSING</h2></Link>
          <Link to='/building' style={comStyles().link}><h2>BUILDING</h2></Link>
          <Button onClick={() => this.toggleModal(true, 'login')} style={comStyles().login}>Login</Button>

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
}

// for all optional props, define a default value
Header.defaultProps = {
}


const RadiumHOC = Radium(Header)

function mapStateToProps(state){
  return {
  }
}

export default withRouter(
  connect(mapStateToProps, {
  })(RadiumHOC)
)

// ===================================================

const comStyles = () => {
  return {
    header: {
      backgroundColor: xDeepBlue,
      padding: '0px',
      height: '7vh',
      width: '100%',
      zIndex: '1',
      display: 'flex',
      flexDirection: 'row',
    },
    logo: {
      height: '6vh',
      width: 'auto',
      float: 'left',
      margin: '0.5vh auto'
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
