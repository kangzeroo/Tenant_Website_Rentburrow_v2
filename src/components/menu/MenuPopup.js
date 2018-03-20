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
} from 'semantic-ui-react'
import 'antd/lib/menu/style/css'

const SubMenu = Menu.SubMenu
import SocialMediaContainer from '../share/SocialMediaContainer'


class MenuPopup extends Component {

  openLinkInNewTab(url) {
    const win = window.open(url, '_blank')
    win.focus()
  }

	render() {
		return (
      <Transition visible={this.props.menu} animation='scale' duration={500} >
      <Menu
        id='MenuPopup'
        style={comStyles().menuContainer}
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        mode='vertical-right'
        theme='light'
      >
        <Menu.Item>
          <Icon name='user' />
          LOGIN
        </Menu.Item>
        <Menu.Item key="1" onClick={() => this.props.history.push('/tours')}>
          <div style={comStyles().rowContainer} >
            <Icon name='suitcase' />
            <div>Local Tours</div>
          </div>
        </Menu.Item>
        <Menu.Item key="2" onClick={() => this.openLinkInNewTab('https://prizes.renthero.ca')}>
          <div style={comStyles().rowContainer} >
            <Icon name='gift' />
            <div>Redeem Prize</div>
          </div>
        </Menu.Item>
        <Menu.Item key="3">
          <div style={comStyles().rowContainer} >
            <Icon name='newspaper' />
            <div>Post Ad</div>
          </div>
        </Menu.Item>
        <Menu.Item key="4" onClick={() => this.props.history.push('/contact')}>
          <div style={comStyles().rowContainer} >
            <Icon name='help circle' />
            <div>Help Center</div>
          </div>
        </Menu.Item>
      </Menu>
      </Transition>
		)
	}
}

// defines the types of variables in this.props
MenuPopup.propTypes = {
	history: PropTypes.object.isRequired,
  menu: PropTypes.bool.isRequired,
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
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {

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
    }
	}
}
