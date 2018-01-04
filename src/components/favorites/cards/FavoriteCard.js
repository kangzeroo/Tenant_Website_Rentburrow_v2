// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
  Card,
  Image,
} from 'semantic-ui-react'
import { renderProcessedThumbnail, shortenAddress, aliasToURL, } from '../../../api/general/general_api'

class FavoriteCard extends Component {

  goToBuilding(building_alias) {
    window.open(`${window.location.origin}/${aliasToURL(building_alias)}`, '_blank')
  }

	render() {
		return (
			<Card id='FavoriteCard' style={comStyles().container} onClick={() => this.goToBuilding(this.props.favorite.building_alias)}>
        <div style={comStyles().imageGallery}>
          <Image src={renderProcessedThumbnail(this.props.favorite.thumbnail)} />
        </div>
        <Card.Content style={comStyles().info}>
          <div style={comStyles().details}>
            <Card.Header style={comStyles().headerPrint}>
              <h1 style={comStyles().address}>{ this.props.favorite.building_alias ? this.props.favorite.building_alias : shortenAddress(this.props.favorite.building_address) }</h1>
            </Card.Header>
          </div>
        </Card.Content>
			</Card>
		)
	}
}

// defines the types of variables in this.props
FavoriteCard.propTypes = {
	history: PropTypes.object.isRequired,
  favorite: PropTypes.object.isRequired,    // passed in
}

// for all optional props, define a default value
FavoriteCard.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(FavoriteCard)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {

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
