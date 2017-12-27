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
import { saveFavorite, insertBuildingFavorite, insertSuiteFavorite, deleteBuildingFavorite, deleteSuiteFavorite } from '../../../api/tenant/favorite_api'
import { BUILDING_INTERACTIONS, SUITE_INTERACTIONS } from '../../../api/intel/dynamodb_tablenames'
import { collectIntel } from '../../../actions/intel/intel_actions'
import { saveFavoritesToRedux, } from '../../../actions/favorites/favorites_actions'

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
      if (this.props.fav_type === 'building') {
        deleteBuildingFavorite(this.props.tenant_profile.tenant_id, this.props.building.building_id)
        this.props.saveFavoritesToRedux(this.props.favorites.filter((fav) => { return fav.building_id === this.props.building_id }))
      } else {
        deleteSuiteFavorite(this.props.tenant_profile.tenant_id, this.props.building.building_id, this.props.suite.suite_id)
      }
      // else { insertSuiteFavorite}
      // insertBuildingFavorite(this.props.tenant_profile.tenant_id, this.props.building.building_id)
      // saveFavorite(this.props.fav_type === 'building' ? this.props.building.building_id : this.props.suite.suite_id, this.props.fav_type, this.props.tenant_profile.tenant_id, false)
      this.trackFavorite(false)
    } else {
      if (this.props.authenticated) {
        this.setState({
          favorited: true,
        })
        // saveFavorite(this.props.fav_type === 'building' ? this.props.building.building_id : this.props.suite.suite_id, this.props.fav_type, this.props.tenant_profile.tenant_id, true)
        if (this.props.fav_type === 'building') {
          console.log('BUILDING')
          insertBuildingFavorite(this.props.tenant_profile.tenant_id, this.props.building.building_id)
          this.props.saveFavoritesToRedux(this.props.favorites.concat([{ building_id: this.props.building.building_id }]))
        } else {
          console.log('SUITE FAVS')
          insertSuiteFavorite(this.props.tenant_profile.tenant_id, this.props.building.building_id, this.props.suite.suite_id)
        }
        this.trackFavorite(true)
      } else {
        this.props.triggerForcedSigninFavorite({
          id: this.props.fav_type === 'building' ? this.props.building.building_id : this.props.suite.suite_id,
          fav_type: this.props.fav_type,
        })
      }
    }
  }

  // ADD fav_type='' and suite={}
  trackFavorite(bool) {
    if (this.props.fav_type === 'building') {
      const action = bool ? 'BUILDING_FAVORITED' : 'BUILDING_UNFAVORITED'
      this.props.collectIntel({
        'TableName': BUILDING_INTERACTIONS,
        'Item': {
          'ACTION': action,
          'DATE': new Date().getTime(),
          'BUILDING_ID': this.props.building.building_id,
          'ADDRESS': this.props.building.building_address,
          'USER_ID': this.props.tenant_profile.tenant_id || 'NONE',
          'FINGERPRINT': this.props.fingerprint,
        }
      })
    } else if (this.props.fav_type === 'suite') {
      const action = bool ? 'SUITE_FAVORITED' : 'SUITE_UNFAVORITED'
      this.props.collectIntel({
        'TableName': SUITE_INTERACTIONS,
        'Item': {
          'ACTION': action,
          'DATE': new Date().getTime(),
          'SUITE_ID': this.props.suite.suite_id,
          'SUITE_NAME': this.props.suite.suite_alias,
          'USER_ID': this.props.tenant_profile.tenant_id || 'NONE',
          'BUILDING_ID': this.props.building.building_id,
          'BUILDING_NAME': this.props.building.building_address,
          'FINGERPRINT': this.props.fingerprint,
        }
      })
    }
  }

	render() {
		return (
			<Icon
        id='FavoriteIcon'
        name='heart'
        color={this.state.hovered || this.state.favorited ? 'red' : 'grey'}
        inverted={this.state.hovered || this.state.favorited ? false : true}
        size={this.props.size}
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
  favorited: PropTypes.bool.isRequired,                  // passed in
  authenticated: PropTypes.bool,              // passed in
  tenant_profile: PropTypes.object.isRequired,
  triggerForcedSigninFavorite: PropTypes.func.isRequired,
  building: PropTypes.object,               // passed in
  suite: PropTypes.object,                  // passed in
  collectIntel: PropTypes.func.isRequired,
  fav_type: PropTypes.string.isRequired,    // passed in
  fingerprint: PropTypes.string.isRequired,
  favorites: PropTypes.array,
  saveFavoritesToRedux: PropTypes.func.isRequired,
  size: PropTypes.string,                   // passed in
}

// for all optional props, define a default value
FavoriteIcon.defaultProps = {
  // favorited: false,
  favorites: [],
  authenticated: false,
  building: null,
  suite: null,
  size: 'big',
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(FavoriteIcon)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
    tenant_profile: redux.auth.tenant_profile,
    authenticated: redux.auth.authenticated,
    fingerprint: redux.auth.browser_fingerprint,
    favorites: redux.favorites.tenant_favorites,
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
    triggerForcedSigninFavorite,
    collectIntel,
    saveFavoritesToRedux,
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
