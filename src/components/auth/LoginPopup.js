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
import { loginFacebook, insertUser } from '../../api/auth/facebook_auth'
import { saveTenantToRedux, triggerForcedSignin } from '../../actions/auth/auth_actions'
import { saveStudentProfile, } from '../../api/auth/auth_api'

class LoginPopup extends Component {

  loginWithFacebook() {
    loginFacebook().then((fbProfile) => {
      saveStudentProfile(fbProfile)
      this.props.saveTenantToRedux(fbProfile)
      this.props.toggleModal(false)
      this.props.triggerForcedSignin(false)
      insertUser(fbProfile)
    })
  }

	render() {
		return (
			<div style={comStyles().container}>
        {
          this.props.rent_type === 'sublet' && this.props.force_signin
          ?
          <h4>Rentburrow pulls sublets from Facebook. By signing in, you help make this service possible. Thank you.</h4>
          :
          null
        }
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
            disabled
          />
        </div>
        <Divider horizontal>Or</Divider>
        <Form>
          <Form.Input
            label='Email'
            disabled
          />
          <Form.Input
            label='Password'
            disabled
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
              disabled
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
  triggerForcedSignin: PropTypes.func.isRequired,
  force_signin: PropTypes.bool,
  rent_type: PropTypes.string.isRequired,
}

// for all optional props, define a default value
LoginPopup.defaultProps = {
  force_signin: false,
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(LoginPopup)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
    rent_type: redux.filter.rent_type,
    force_signin: redux.auth.force_signin,
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
    saveTenantToRedux,
    triggerForcedSignin,
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
