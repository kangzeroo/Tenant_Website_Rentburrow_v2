// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {

} from 'semantic-ui-react'
import { generateContract, authenticatePandaDoc } from '../../api/pandadoc/pandadoc_api'


class Authenticated extends Component {

  componentWillMount() {
    setTimeout(() => {
      if (this.props.tenant_profile.tenant_id === '2d644a3e-0d29-4ae0-9b56-5694484f22da') {
        const url_arguments = this.props.location.search
        const code_id_position = url_arguments.toLowerCase().indexOf('code=')
        const code_id = url_arguments.slice(code_id_position + 'code='.length)
        authenticatePandaDoc(code_id)
      } else {
        this.props.history.push('/')
      }
    }, 2000)
  }

	render() {
		return (
			<div style={comStyles().container}>
				Authenticated
			</div>
		)
	}
}

// defines the types of variables in this.props
Authenticated.propTypes = {
	history: PropTypes.object.isRequired,
  tenant_profile: PropTypes.object,
}

// for all optional props, define a default value
Authenticated.defaultProps = {
  tenant_profile: {},
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(Authenticated)

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
		}
	}
}
