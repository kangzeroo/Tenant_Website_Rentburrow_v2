// Compt for copying as a FavoriteForceSignin
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
  Modal,
} from 'semantic-ui-react'
import LoginPopup from '../../auth/LoginPopup'
import { triggerForcedSigninFavorite } from '../../../actions/auth/auth_actions'


class FavoriteForceSignin extends Component {

	render() {
		return (
      <Modal dimmer='blurring' open={true} onClose={() => this.props.triggerForcedSigninFavorite('')}>
        <Modal.Content>
          <LoginPopup
            toggleModal={() => this.props.triggerForcedSigninFavorite('')}
            context='signup'
          />
        </Modal.Content>
      </Modal>
		)
	}
}

// defines the types of variables in this.props
FavoriteForceSignin.propTypes = {
	history: PropTypes.object.isRequired,
  triggerForcedSigninFavorite: PropTypes.func.isRequired,
}

// for all optional props, define a default value
FavoriteForceSignin.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(FavoriteForceSignin)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {

	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
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
		}
	}
}
