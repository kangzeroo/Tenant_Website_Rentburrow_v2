// This is the header of rentburrow landlord's dashboard.

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import { Link, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import {
  xMidBlue,
  xDeepBlue,
} from '../styles/base_colors'
import {
  Icon,
  Image,
} from 'semantic-ui-react'
import { toggleAccountPopup } from '../actions/staff/staff_actions'

class Header extends Component {

  render() {
    return (
        <div style={comStyles().header}>
          <Link to='/'>
            <div style={comStyles().leftLogo}>
                <img style={comStyles().logo} src={require('../../assets/images/rentburrow_title.png')} alt="logo" />
            </div>
          </Link>
          <div style={profileStyles().profileContainer}>
            <div onClick={() => this.props.toggleAccountPopup(!this.props.account_popup)} style={profileStyles().profile}>
            <div style={profileStyles().nameContainer}>
              <div style={profileStyles().name}>{ this.props.staffProfile.name }</div>
              <div style={profileStyles().corpname}>{ this.props.corpProfile.corp_name }</div>
            </div>
              {
                this.props.staffProfile.thumbnail
                ?
                <Image
  								src={this.props.staffProfile.thumbnail}
  								shape='circular'
                  spaced
                  style={profileStyles().thumb}
  							/>
                :
                <Icon circular color='yellow' name='user' size='tiny' style={profileStyles().icon} />
              }
            </div>
          </div>
        </div>
    );
  }
}

// defines the types of variables in this.props
Header.propTypes = {
	history: PropTypes.object.isRequired,
  staffProfile: PropTypes.object.isRequired,
  corpProfile: PropTypes.object.isRequired,
  toggleAccountPopup: PropTypes.func.isRequired,
  account_popup: PropTypes.bool,
}

// for all optional props, define a default value
Header.defaultProps = {
  account_popup: false,
}


const RadiumHOC = Radium(Header)

function mapStateToProps(state){
  return {
    staffProfile: state.auth.staff_profile,
    corpProfile: state.auth.corporation_profile,
    account_popup: state.staff.account_popup,
  }
}

export default withRouter(
  connect(mapStateToProps, {
    toggleAccountPopup,
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
      position: 'fixed',
      zIndex: '1'
    },
    logo: {
      height: '75%',
      width: 'auto',
    },
    leftLogo: {
      width: '200px',
      height: '100%',
      float: 'left',
      backgroundColor: xDeepBlue
    }
  }
}

const profileStyles = () => {
  return {
    profile: {
      height: '100%',
      width: '200px',
      float: 'right',
      margin: 'auto',
      display: 'flex',
      flexDirection: 'row',
      color: 'white',
      cursor: 'pointer',
      backgroundColor: xDeepBlue,
      justifyContent: 'space-around',
      alignItems: 'center',
      marginRight: '20px',
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
