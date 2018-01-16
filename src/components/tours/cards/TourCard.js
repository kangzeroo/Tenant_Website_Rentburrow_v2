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
  Image,
  Icon,
} from 'semantic-ui-react'
import { renderProcessedThumbnail, } from '../../../api/general/general_api'

class TourCard extends Component {

  // a.tour_id, a.tenant_id, a.landlord_id, a.building_id, a.selected_date, a.created_at,
  //                           b.first_name

	render() {
    return (
			<Card id='TourCard' style={comStyles().container} onClick={() => this.props.openPopup(this.props.tour)}>
        <div style={comStyles().imageGallery} >
          <Image src={renderProcessedThumbnail(this.props.building.thumbnail)} />
        </div>
        <Card.Content>
          <Card.Header>
            <h1>{ this.props.building.building_alias }</h1>
          </Card.Header>
          <Card.Description style={comStyles().more_info}>
            {
              this.props.building.min_price && this.props.building.max_price
              ?
              <h3 style={comStyles().price}>
                {
                  this.props.building.min_price === this.props.building.max_price
                  ?
                  `Rooms from $${this.props.building.min_price}`
                  :
                  `Rooms from $${this.props.building.min_price} to $${this.props.building.max_price}`
                }
              </h3>
              :
              'Inquire Price'
            }
            <h3 style={{ color: '#33A3F4', fontWeight: 'bold', }}>Tour {moment(this.props.tour.selected_date).fromNow()}</h3>
            <h3>{`${moment(this.props.tour.selected_date).format('MMMM Do YYYY, h:mm a')}`}</h3>
          </Card.Description>
        </Card.Content>
        <Card.Content extra>
          <div style={comStyles().bottomContainer} >
            <a style={comStyles().bedContainer}>
              <Icon name='bed' />
              {
                this.props.building.min_rooms && this.props.building.max_rooms
                ?
                <div>
                  {
                    this.props.building.min_rooms === this.props.building.max_rooms
                    ?
                    `${this.props.building.min_rooms} Bed${this.props.building.min_rooms === 1 ? '' : 's'}`
                    :
                    `${this.props.building.min_rooms} to ${this.props.building.max_rooms} Beds`
                  }
                </div>
                :
                'Inquire Rooms'
              }
            </a>
            <Button
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
TourCard.propTypes = {
	history: PropTypes.object.isRequired,
  building: PropTypes.object.isRequired,    // passed in
  tour: PropTypes.object.isRequired,        // passed in
  openPopup: PropTypes.func.isRequired,     // passed in
}

// for all optional props, define a default value
TourCard.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(TourCard)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
    buildings: redux.search.buildings,
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
      margin: '30px'
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
    },
    more_info: {
      display: 'flex',
      flexDirection: 'column',
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
