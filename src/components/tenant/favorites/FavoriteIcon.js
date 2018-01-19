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
    if (this.props.fav_type === 'suite') {
      const favs = JSON.parse(localStorage.getItem('favorites'))
      if (favs && favs.length > 0) {
        this.setState({
          favorited: favs.some((fav) => { return fav.suite_id === this.props.suite.suite_id }),
        })
      } else {
        this.setState({
          favorited: false,
        })
      }
    } else if (this.props.fav_type === 'building') {
      const favs = JSON.parse(localStorage.getItem('favorites'))
      if (favs && favs.length > 0) {
        this.setState({
          favorited: favs.some((fav) => { return fav.building_id === this.props.building.building_id }),
        })
      } else {
        this.setState({
          favorited: false,
        })
      }
    }
  }

  toggleFavorite(e) {
    if (e) {
      e.stopPropagation()
    }
    const building_id = this.props.building.building_id
    const tenant_id = this.props.tenant_profile.tenant_id
    if (this.state.favorited) {
      this.setState({
        favorited: false,
      })
      if (this.props.fav_type === 'building') {
        // delete the favorite from the database
        deleteBuildingFavorite(tenant_id, building_id)

        // modify local storage
        const favs = JSON.parse(localStorage.getItem('favorites'))
        const modifiedFavs = favs.filter((fav) => {
          return !(fav.building_id === building_id && !fav.suite_id)
        })
        localStorage.setItem('favorites', JSON.stringify(modifiedFavs))
      } else if (this.props.fav_type === 'suite') {
        // delete the suite favorite from the database
        deleteSuiteFavorite(tenant_id, building_id, this.props.suite.suite_id)

        // modify local storage
        const favs = JSON.parse(localStorage.getItem('favorites'))
        const modifiedFavs = favs.filter((fav) => {
          return !(fav.building_id === building_id && fav.suite_id === this.props.suite.suite_id)
        })
        localStorage.setItem('favorites', JSON.stringify(modifiedFavs))
      }
      this.trackFavorite(false)
    } else {
      if (this.props.authenticated) {
        this.setState({
          favorited: true,
        })
        if (this.props.fav_type === 'building') {
          // insert the building favorite to the database
          insertBuildingFavorite(tenant_id, building_id)

          // modify the favorites in localStorage
          const favs = JSON.parse(localStorage.getItem('favorites'))
          localStorage.setItem('favorites', JSON.stringify(favs.concat([{ building_id: building_id }])))
        } else {
          // insert the suite favorite into the database
          insertSuiteFavorite(tenant_id, building_id, this.props.suite.suite_id)

          // modify the favorites in localStorage
          const favs = JSON.parse(localStorage.getItem('favorites'))
          localStorage.setItem('favorites', JSON.stringify(favs.concat([{ building_id: building_id, suite_id: this.props.suite.suite_id }])))
        }
        this.trackFavorite(true)
      } else {
        this.props.triggerForcedSigninFavorite({
          building_id: this.props.building.building_id,
          suite_id: this.props.suite ? this.props.suite.suite_id : '',
          fav_type: this.props.fav_type,
        })
        this.setState({
          favorited: true,
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
  authenticated: PropTypes.bool,              // passed in
  fav_type: PropTypes.string.isRequired,      // passed in
  tenant_profile: PropTypes.object.isRequired,
  triggerForcedSigninFavorite: PropTypes.func.isRequired,
  building: PropTypes.object,               // passed in
  suite: PropTypes.object,                  // passed in
  collectIntel: PropTypes.func.isRequired,
  fingerprint: PropTypes.string.isRequired,
  size: PropTypes.string,                   // passed in
}

// for all optional props, define a default value
FavoriteIcon.defaultProps = {

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
      zIndex: 1,
      right: '5px',
      top: '5px',
		}
	}
}
