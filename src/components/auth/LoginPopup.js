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
  Header,
} from 'semantic-ui-react'
import { loginFacebook, insertUser, initiateFacebook } from '../../api/auth/facebook_auth'
import { saveTenantToRedux, triggerForcedSignin, triggerForcedSigninFavorite } from '../../actions/auth/auth_actions'
import { saveTenantProfile, getTenantProfile } from '../../api/auth/tenant_api'
import { insertBuildingFavorite, insertSuiteFavorite } from '../../api/tenant/favorite_api'
import Login from './Login'
import Signup from './Signup'
import ForgotPassword from './ForgotPassword'

class LoginPopup extends Component {

  constructor() {
    super()
    this.state = {
      signup: false,
      forgot_password: false,

      loading: false,
    }
  }

  componentWillMount() {
    if (this.props.context === 'signup') {
      this.setState({
        signup: true,
      })
    }
  }

  loginWithFacebook() {
    this.setState({
      loading: true,
    })
    localStorage.removeItem('fbToken')
    initiateFacebook()
    .then(() => {
      return loginFacebook()
    })
    .then((fbProfile) => {
      // insertUser(fbProfile)
      return saveTenantProfile(fbProfile)
    })
    .then((data) => {
      if (this.props.temporary_favorite_force_signin.fav_type === 'building') {
        insertBuildingFavorite(data.tenant_id, this.props.temporary_favorite_force_signin.building_id)
        // const favs = JSON.parse(localStorage.getItem('favorites'))
        // localStorage.setItem('favorites', JSON.stringify([{ building_id: this.props.temporary_favorite_force_signin.building_id }]))
        this.props.triggerForcedSigninFavorite({})
      } else if (this.props.temporary_favorite_force_signin.fav_type === 'suite') {
        insertSuiteFavorite(data.tenant_id, this.props.temporary_favorite_force_signin.building_id, this.props.temporary_favorite_force_signin.suite_id)
        // const favs = JSON.parse(localStorage.getItem('favorites'))
        // localStorage.setItem('favorites', JSON.stringify([{ building_id: this.props.temporary_favorite_force_signin.building_id, suite_id: this.props.temporary_favorite_force_signin.suite_id, }]))
        this.props.triggerForcedSigninFavorite({})
      }
      return getTenantProfile({ tenant_id: data.tenant_id, })
    })
    .then((data) => {
      this.props.saveTenantToRedux(data)
      this.props.toggleModal(false)
      this.props.triggerForcedSignin(false)
      this.setState({
        loading: false,
      })
    })
  }

  renderLoginAndSignUp() {
    return (
      <div>
        {
          this.props.rent_type === 'sublet' && this.props.force_signin
          ?
          <h4>RentHero pulls sublets from Facebook. By signing in, you help make this service possible. You the real hero, thank you.</h4>
          :
          null
        }
        {
          this.state.signup
          ?
          <Header as='h2' content='Sign Up' />
          :
          <Header as='h2' content='Log In' />
        }
        <div style={comStyles().social_container} >
          <Button
            onClick={() => this.loginWithFacebook()}
            content={this.state.signup ? 'Sign Up with Facebook' : 'Log In with Facebook'}
            color='facebook'
            icon='facebook'
            size='medium'
            loading={this.state.loading}
          />
          {/*<Button
            content='Login with Google'
            color='google plus'
            icon='google plus'
            disabled
          />*/}
        </div>
        {
          this.props.rent_type === 'sublet' && this.props.force_signin
          ?
          null
          :
          <div>
            <Divider horizontal>Or</Divider>
            {
              this.state.signup
              ?
              <Signup
                loginComp={() => this.setState({ signup: false, })}
                closeModal={() => this.props.toggleModal(false)}
              />
              :
              <Login
                closeModal={() => this.props.toggleModal(false)}
                signupState={() => this.setState({ signup: true, })}
                forgotPassword={() => this.setState({ forgot_password: true, })}
              />
            }
          </div>
        }
      </div>
    )
  }

  renderForgotPassword() {
    return (
      <ForgotPassword
        backToLogin={() => this.setState({ forgot_password: false, })}
      />
    )
  }

	render() {
		return (
			<div id='LoginPopup' style={comStyles().container}>
        {
          this.state.forgot_password
          ?
          this.renderForgotPassword()
          :
          this.renderLoginAndSignUp()
        }
			</div>
		)
	}
}

// defines the types of variables in this.props
LoginPopup.propTypes = {
	history: PropTypes.object.isRequired,
  toggleModal: PropTypes.func.isRequired,           // passed in
  context: PropTypes.string.isRequired,             // passed in
  saveTenantToRedux: PropTypes.func.isRequired,
  triggerForcedSignin: PropTypes.func.isRequired,
  force_signin: PropTypes.bool,
  rent_type: PropTypes.string.isRequired,
  temporary_favorite_force_signin: PropTypes.object,
  triggerForcedSigninFavorite: PropTypes.func.isRequired,
}

// for all optional props, define a default value
LoginPopup.defaultProps = {
  force_signin: false,
  temporary_favorite_force_signin: null,
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(LoginPopup)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
    rent_type: redux.filter.rent_type,
    force_signin: redux.auth.force_signin,
    temporary_favorite_force_signin: redux.auth.temporary_favorite_force_signin,
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
    saveTenantToRedux,
    triggerForcedSignin,
    triggerForcedSigninFavorite,
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
      padding: '25px 50px 25px 50px',
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
