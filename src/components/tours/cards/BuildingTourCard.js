// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import moment from 'moment'
import { withRouter } from 'react-router-dom'
import {
  Card,
  Button,
} from 'semantic-ui-react'
import { triggerForcedSigninFavorite } from '../../../actions/auth/auth_actions'

class BuildingTourCard extends Component {

  determineIfPopup() {
    if (this.props.authenticated) {
      return this.props.openPopup({ tour: this.props.tour, building: this.props.building })
    } else {
      this.props.triggerForcedSigninFavorite({
				building_id: this.props.building.building_id,
			})
    }
  }

	render() {
    return (
			<Card
        id='BuildingTourCard'
        style={comStyles().container}
        onClick={() => this.determineIfPopup()}
        style={comStyles(this.props.building.label).hardCard}
        raised
      >
        <Card.Content style={comStyles().info}>
          <Card.Description style={comStyles().more_info}>
            <h3 style={{ color: '#33A3F4', fontWeight: 'bold', padding: '2.5px' }}>Tour {moment(this.props.tour.selected_date).fromNow()}</h3>
            <h3 style={{ padding: '2.5px' }}>{`${moment(this.props.tour.selected_date).format('MMMM Do YYYY, h:mm a')}`}</h3>
          </Card.Description>
        </Card.Content>
        <Card.Content extra>
          <div style={comStyles().bottomContainer} >
            <Button
              fluid
              color='orange'
              content='Join Tour'
            />
          </div>
        </Card.Content>
			</Card>
		)
  }
}

// defines the types of variables in this.props
BuildingTourCard.propTypes = {
	history: PropTypes.object.isRequired,
  authenticated: PropTypes.bool.isRequired,
  triggerForcedSigninFavorite: PropTypes.func.isRequired,
  building: PropTypes.object.isRequired,    // passed in
  tour: PropTypes.object.isRequired,        // passed in
  openPopup: PropTypes.func.isRequired,     // passed in
}

// for all optional props, define a default value
BuildingTourCard.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(BuildingTourCard)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
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
      display: 'flex',
      flexDirection: 'column',
      margin: '30px'
		},
    hardCard: {
      minWidth: '310px',
      maxWidth: 'auto',
      minHeight: '150px',
      maxHeight: '150px',
      margin: '30px',
    },
    info: {
      backgroundColor: 'rgba(0,0,0,0)',
      display: 'flex',
      flexDirection: 'column',
      // padding: '30px 10px 10px 10px',
    },
    details: {
      color: 'black',
      display: 'flex',
      flexDirection: 'column',
      width: '90%',
    },
    imageGallery: {
      height: '170px'
    },
    address: {
      width: '70%',
      display: 'flex',
      flexWrap: 'wrap',
      fontSize: '1.3rem',
    },
    price: {
      width: '100%',
      padding: '2.5px',
    },
    more_info: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerPrint: {
      fontSize: '1rem',
    },
    bedContainer: {
      display: 'flex',
      flexDirection: 'row',
    },
    bottomContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    }
	}
}
