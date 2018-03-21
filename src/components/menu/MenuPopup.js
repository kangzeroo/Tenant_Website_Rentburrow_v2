// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
  xMidBlue,
  xLightBlue,
  xDeepBlue,
} from '../../styles/base_colors'
import {
  Menu,
} from 'antd'
import {
  Icon,
  Transition,
  Button,
} from 'semantic-ui-react'
import 'antd/lib/menu/style/css'
import { toggleMenuOff } from '../../actions/menu/menu_actions'

const { SubMenu } = Menu

class MenuPopup extends Component {

  openLinkInNewTab(url) {
    const win = window.open(url, '_blank')
    win.focus()
  }

  logout() {
    this.props.toggleMenuOff()
    this.props.history.push('/logout')
  }

  renderTenant() {
    return (
      <SubMenu
        key='tenant'
        title={
          <div style={comStyles().rowContainer}>
            <Icon name='user' />
            <div style={comStyles().textStyle}>{`${this.props.tenant_profile.first_name}'s Account`}</div>
          </div>
        }
      >
        <Menu.Item key='tenant1' onClick={() => this.props.history.push('/account')}>
          <div style={comStyles().rowContainer} onClick={() => this.props.history.push('/account')}>
            <Icon name='settings' />
            <div style={comStyles().textStyle}>Account Settings</div>
          </div>
        </Menu.Item>
        <Menu.Item key='tenant2' onClick={() => this.props.history.push('/my-ads')}>
          <div style={comStyles().rowContainer} onClick={() => this.props.history.push('/my-ads')}>
            <Icon name='file text' />
            <div style={comStyles().textStyle}>My Ads</div>
          </div>
        </Menu.Item>
      </SubMenu>
    )
  }

	render() {
		return (
      <Menu
        id='MenuPopup'
        style={comStyles().menuContainer}
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        mode='vertical-right'
        theme='light'
      >
        <Menu.Item key="1" onClick={() => this.openLinkInNewTab('https://search.renthero.ca/tours')}>
          <div style={comStyles().rowContainer} onClick={() => this.openLinkInNewTab('https://search.renthero.ca/tours')}>
            <Icon name='suitcase' />
            <div style={comStyles().textStyle}>Local Tours</div>
          </div>
        </Menu.Item>
        <Menu.Item key="2" onClick={() => this.openLinkInNewTab('https://prizes.renthero.ca')}>
          <div style={comStyles().rowContainer} onClick={() => this.openLinkInNewTab('https://prizes.renthero.ca')}>
            <Icon name='gift' />
            <div style={comStyles().textStyle}>Redeem Prize</div>
          </div>
        </Menu.Item>
        <SubMenu
          key='sub1'
          title={<div style={comStyles().rowContainer}>
            <Icon name='newspaper' />
            <div style={comStyles().textStyle}>Post Ad</div>
            </div>}
          >
          <Menu.Item key='sub11'>
            <div style={comStyles().textStyle} onClick={() => this.openLinkInNewTab('https://search.renthero.ca/postsublet')}>Post Sublet</div>
          </Menu.Item>
          <Menu.Item key='sub12'>
            <div style={comStyles().textStyle} onClick={() => this.openLinkInNewTab('https://contact.renthero.ca')}>Post Lease</div>
          </Menu.Item>
        </SubMenu>
        <Menu.Item key="4" onClick={() => this.openLinkInNewTab('https://help.renthero.ca')}>
          <div style={comStyles().rowContainer} onClick={() => this.openLinkInNewTab('https://help.renthero.ca')}>
            <Icon name='help circle' />
            <div style={comStyles().textStyle}>Help Center</div>
          </div>
        </Menu.Item>
        {
          this.props.authenticated && this.props.tenant_profile && this.props.tenant_profile.tenant_id
          ?
          this.renderTenant()
          :
          null
        }
        {
          this.props.authenticated && this.props.tenant_profile && this.props.tenant_profile.tenant_id
          ?
          <Menu.Item key='logout' onClick={() => this.logout()} style={{ position: 'absolute', bottom: '10px', width: '100%' }}>
            <Button negative fluid content='Logout' onClick={() => this.logout()} icon='sign out' />
          </Menu.Item>
          :
          null
        }
      </Menu>
		)
	}
}

// defines the types of variables in this.props
MenuPopup.propTypes = {
	history: PropTypes.object.isRequired,
  menu: PropTypes.bool.isRequired,
  authenticated: PropTypes.bool.isRequired,
  tenant_profile: PropTypes.object.isRequired,
  toggleMenuOff: PropTypes.func.isRequired,
}

// for all optional props, define a default value
MenuPopup.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(MenuPopup)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
    menu: redux.menu.menu,
    authenticated: redux.auth.authenticated,
    tenant_profile: redux.auth.tenant_profile,
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
    toggleMenuOff,
	})(RadiumHOC)
)

// ===============================

// the JS function that returns Radium JS styling
const comStyles = () => {
	return {
		container: {
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Helvetica Neue',
		},
    menuContainer: {
      width: 256,
      zIndex: 9999999999999999,
      position: 'absolute',
      right: 0,
      top: '7vh',
      height: '93vh',
    },
    rowContainer: {
      display: 'flex',
      flexDirection: 'row',
      fontSize: '1.2rem'
    },
    font_logo: {
      color: xMidBlue,
      fontFamily: `'Carter One', cursive`,
      margin: '0px 0px 0px 20px',
    },
    logoContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'white',
      margin: '5px'
    },
    textStyle: {
      fontFamily: 'Helvetica Neue',
    }
	}
}
