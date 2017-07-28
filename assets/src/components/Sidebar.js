// This is the sidebar that enables navigation throughout the app
// React-Router 4 has a <Link to='/dashboard'> compt that acts as routing links when clicked
// Also notice that this Sidebar compt is wrapped in withRouter()
// This is because we can expose the React-Router 4 url routing history to do things such as:
// eg. this.props.history.push('/dashboard')
// which pushes our app to the '/dashboard' programatically instead of having to click <Link to='/dashboard'>

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import {
  Link,
  withRouter,
} from 'react-router-dom'

class Sidebar extends Component {

	render() {
		return (
			<div style={comStyles().container}>
        {
          this.props.authenticated_staff
          ?
          <div style={comStyles().column}>
            <Link to='/dashboard' style={comStyles().link}>Dashboard</Link>
            <Link to='/chat' style={comStyles().link}>Chat</Link>
            <Link to='/buildings' style={comStyles().link}>Buildings</Link>
          </div>
          :
          <div style={comStyles().column}>
            <Link to='/public' style={comStyles().link}>Stats</Link>
            <Link to='/register' style={comStyles().link}>Register</Link>
          </div>
        }
        {
          this.props.authenticated_staff
          ?
          <Link to='/settings' style={comStyles().bottom}>Settings</Link>
          :
          <Link to='/login' style={comStyles().bottom}>Login</Link>
        }
			</div>
		)
	}
}

Sidebar.propTypes = {
  authenticated_staff: PropTypes.bool,
}

Sidebar.defaultProps = {
  authenticated_staff: false,
}

const RadiumHOC = Radium(Sidebar)

function mapStateToProps(state) {
	return {
    authenticated_staff: state.auth.authenticated_staff
	}
}

export default withRouter(
  connect(mapStateToProps, {

  })(RadiumHOC)
)

// ===============================

const comStyles = () => {
	return {
		container: {
      backgroundColor: 'aliceblue',
      display: 'flex',
      flexDirection: 'column',
      fontSize: '1rem',
      width: '200px',
      position: 'sticky'
		},
    column: {
      display: 'flex',
      flexDirection: 'column',
    },
    link: {
      position: 'absoluve',
      padding: '10px',
      fontSize: '1.5em',
      color: 'black'
    },
    bottom: {
      position: 'absolute',
      bottom: '0px',
      left: '0px',
      margin: '10px',
      padding: '10px',
      fontSize: '1.5em',
      color: 'black',
    },
	}
}
