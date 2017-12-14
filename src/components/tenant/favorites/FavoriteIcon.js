// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
  Icon,
} from 'semantic-ui-react'
import { triggerForcedSigninFavorite } from '../../../actions/auth/auth_actions'
import { saveFavorite } from '../../../api/tenant/favorite_api'


class FavoriteIcon extends Component {

  constructor() {
    super()
    this.state = {
      hovered: false,
      favorited: false,
    }
  }

  componentWillMount() {
    this.setState({
      favorited: this.props.favorited,
    })
  }

  toggleFavorite(e) {
    if (e) {
      e.stopPropagation()
    }
    if (this.state.favorited) {
      this.setState({
        favorited: false,
      })
      saveFavorite(this.props.building_id, this.props.tenant_profile.tenant_id, false)
    } else {
      if (this.props.authenticated) {
        this.setState({
          favorited: true,
        })
        saveFavorite(this.props.building_id, this.props.tenant_profile.tenant_id, true)
      } else {
        this.props.triggerForcedSigninFavorite(this.props.building_id)
      }
    }
  }

	render() {
		return (
			<Icon
        id='FavoriteIcon'
        name='heart'
        color={this.state.hovered || this.state.favorited ? 'red' : 'grey'}
        inverted={this.state.hovered || this.state.favorited ? false : true}
        size='big'
        onClick={(e) => this.toggleFavorite(e)}
        onMouseEnter={() => this.setState({ hovered: true })}
        onMouseLeave={() => this.setState({ hovered: false })}
        style={comStyles().container}
      />
		)
	}
}

// defines the types of variables in this.props
FavoriteIcon.propTypes = {
	history: PropTypes.object.isRequired,
  favorited: PropTypes.bool,                  // passed in
  authenticated: PropTypes.bool,              // passed in
  tenant_profile: PropTypes.object.isRequired,
  triggerForcedSigninFavorite: PropTypes.func.isRequired,
  building_id: PropTypes.string.isRequired,   // passed in
}

// for all optional props, define a default value
FavoriteIcon.defaultProps = {
  favorited: false,
  authenticated: false,
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(FavoriteIcon)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
    tenant_profile: redux.auth.tenant_profile,
    authenticated: redux.auth.authenticated,
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
      position: 'absolute',
      zIndex: 20,
      right: '5px',
      top: '5px',
		}
	}
}
