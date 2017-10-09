// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
  Image,
} from 'semantic-ui-react'


class TenantAccount extends Component {

	render() {
		return (
			<div style={comStyles().container}>
				<Image
          src={this.props.tenant_profile.picurl}
          shape='circular'
          size='small'
        />
        <div>{this.props.tenant_profile.name}</div>
			</div>
		)
	}
}

// defines the types of variables in this.props
TenantAccount.propTypes = {
	history: PropTypes.object.isRequired,
  tenant_profile: PropTypes.object,
}

// for all optional props, define a default value
TenantAccount.defaultProps = {
  tenant_profile: {}
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(TenantAccount)

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
