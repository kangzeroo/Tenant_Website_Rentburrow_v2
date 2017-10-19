// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
  Button,
} from 'semantic-ui-react'
import {
  authenticateTenant,
} from '../../api/general/general_api'

const config = require('../../../credentials/pandadoc_config')


class Authenticate extends Component {

  componentWillMount() {
    if (this.props.tenant_profile.tenant_id !== '2d644a3e-0d29-4ae0-9b56-5694484f22da') {
      this.props.history.push('/')
    }
  }

  openUrl() {
		window.location.href = `https://app.pandadoc.com/oauth2/authorize?client_id=${config.pd.client_id}&redirect_uri=https://localhost:8081/authenticated/&scope=read+write&response_type=code`
	}

	render() {
		return (
			<div style={comStyles().container}>
        <div style={comStyles().button_container} >
          <Button
            content='Authenticate'
            primary
            onClick={() => this.openUrl()}
          />
        </div>
			</div>
		)
	}
}

// defines the types of variables in this.props
Authenticate.propTypes = {
	history: PropTypes.object.isRequired,
  tenant_profile: PropTypes.object,
}

// for all optional props, define a default value
Authenticate.defaultProps = {
  tenant_profile: {},
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(Authenticate)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
    tenant_profile: redux.auth.tenant_profile,
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
		},
    button_container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
    }
	}
}
