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
  Divider,
  Form,
} from 'semantic-ui-react'
import { loginFacebook, convertTokenIntoLongLived } from '../../api/auth/facebook_auth'
import { saveTenantToRedux } from '../../actions/auth/auth_actions'


class LoginPopup extends Component {

  loginWithFacebook() {
    loginFacebook().then((fbProfile) => {
      this.props.saveTenantToRedux(fbProfile)
      this.props.toggleModal(false)
      return convertTokenIntoLongLived(fbProfile.fbToken)
    })
  }

	render() {
		return (
			<div style={comStyles().container}>
        <div style={comStyles().social_container} >
  				<Button
            onClick={() => this.loginWithFacebook()}
            content='Login with Facebook'
            color='facebook'
            icon='facebook'
          />
          <Button
            content='Login with Google'
            color='google plus'
            icon='google plus'
          />
        </div>
        <Divider horizontal>Or</Divider>
        <Form>
          <Form.Input
            label='Email'
          />
          <Form.Input
            label='Password'
          />
          <div style={comStyles().buttons_container}>
            <Button
              primary
              basic
              content='Cancel'
              fluid
              onClick={() => this.props.toggleModal(false)}
            />
            <Button
              primary
              content='Sign In'
              fluid
            />
          </div>
        </Form>
			</div>
		)
	}
}

// defines the types of variables in this.props
LoginPopup.propTypes = {
	history: PropTypes.object.isRequired,
  toggleModal: PropTypes.func.isRequired,
  saveTenantToRedux: PropTypes.func.isRequired,
}

// for all optional props, define a default value
LoginPopup.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(LoginPopup)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {

	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
    saveTenantToRedux,
	})(RadiumHOC)
)

// ===============================

// the JS function that returns Radium JS styling
const comStyles = () => {
	return {
		container: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '25px 100px 25px 100px',
		},
    social_container: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-around',
      height: '100px'
    },
    buttons_container: {
      display: 'flex',
      flexDirection: 'row',
    }
	}
}
