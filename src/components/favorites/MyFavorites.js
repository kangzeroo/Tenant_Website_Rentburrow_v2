// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
  Header,
  Icon,
} from 'semantic-ui-react'
import { getAllFavoritesForTenant } from '../../api/tenant/favorite_api'
import FavoriteCard from './cards/FavoriteCard'

class MyFavorites extends Component {

  constructor() {
    super()
    this.state = {
      favorites: [],
    }
  }

  componentWillMount() {
    getAllFavoritesForTenant(this.props.tenant_profile.tenant_id)
    .then((data) => {
      this.setState({
        favorites: data,
      })
    })
  }

	render() {
		return (
			<div id='MyFavorites' style={comStyles().container}>
				<Header as='h1' >
          <Icon name='heart' style={{ color: 'red', }} />
          <Header.Content>My Favorites</Header.Content>
        </Header>
        <div style={comStyles().favoritesContainer} >
          {
            this.state.favorites.map((favorite) => {
              return (
                <FavoriteCard
                  favorite={favorite}
                />
              )
            })
          }
        </div>
			</div>
		)
	}
}

// defines the types of variables in this.props
MyFavorites.propTypes = {
	history: PropTypes.object.isRequired,
  tenant_profile: PropTypes.object.isRequired,
}

// for all optional props, define a default value
MyFavorites.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(MyFavorites)

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
      minHeight: '94vh',
      maxHeight: '100%',
      margin: '20px'
		}
	}
}
