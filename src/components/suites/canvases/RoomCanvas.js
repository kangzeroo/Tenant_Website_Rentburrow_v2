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
import {
  getRoomPage, getRoomAmenities
} from '../../../api/building/building_api'
import SingularImageGallery from '../../image/SingularImageGallery'

class RoomCanvas extends Component {

	constructor() {
		super()
		this.state = {
			room: {},
      amenities: [],
		}
	}

	componentWillMount() {
		getRoomPage({
			building_id: this.props.bottomContextValue.building_id,
			suite_id: this.props.bottomContextValue.suite_id,
			room_id: this.props.bottomContextValue.room_id,
		})
		.then((data) => {
			this.setState({
				room: JSON.parse(data)
			})
			return getRoomAmenities({
  			building_id: this.props.bottomContextValue.building_id,
  			suite_id: this.props.bottomContextValue.suite_id,
  			room_id: this.props.bottomContextValue.room_id,
  		})
		})
    .then((data) => {
      this.setState({
        amenities: data.map(s => JSON.parse(s))
      })
    })
	}

	createMarkup(string) {
		return {
			__html: string,
		}
	}

	render() {
		return (
			<div style={comStyles().container}>
				<div style={comStyles().contain_image} >
					<SingularImageGallery
						list_of_images={[this.state.room.thumbnail].concat(this.state.room.imgs)}
  					image_size='hd'
					/>
          <div style={comStyles().infoBanner}>
            <h1>{ this.state.room.room_alias || `Room ${this.state.room.room_code}` }</h1>
          </div>
          <div style={comStyles().scrollDown}>
            <Icon name='double angle down' size='huge' />
            <p>Scroll Down</p>
          </div>
				</div>
				<div style={comStyles().content} >
					<div style={comStyles().content_left} >
						<h2>Room {this.state.room.room_code}</h2>
						<p>{this.state.room.room_alias}</p>
						<div style={comStyles().description} >
							<div
								dangerouslySetInnerHTML={this.createMarkup(this.state.room.room_desc)}
								style={comStyles().textMarkup}
							/>
						</div>
					</div>
					<div style={comStyles().content_right} >
            <div style={comStyles().price_box} >
              <h2>${ this.state.room.price }/month</h2>
            </div>
            <div style={comStyles().amenities} >
              <h2>Room Amenities</h2>
              {
                this.state.amenities.map((am) => {
                   return (
                     <div key={am.amenity_alias} style={comStyles().amenity}>
                      <Icon name='checkmark' />
                      { am.amenity_alias }
                     </div>
                   )
                })
              }
            </div>
					</div>
				</div>
			</div>
		)
	}
}

// defines the types of variables in this.props
RoomCanvas.propTypes = {
	history: PropTypes.object.isRequired,
	bottomContextValue: PropTypes.object.isRequired,		// passed in
}

// for all optional props, define a default value
RoomCanvas.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(RoomCanvas)

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
			overflow: 'scroll',
			maxHeight: '100%',
		},
    contain_image: {
      height: 'auto',
      position: 'relative',
    },
    infoBanner: {
      position: 'absolute',
      bottom: '50px',
      left: '0px',
      width: 'auto',
      padding: '20px',
      backgroundColor: 'rgba(0,0,0,0.5)',
      color: 'white',
    },
    scrollDown: {
      position: 'absolute',
      bottom: '10px',
      right: '50%',
      width: 'auto',
      color: 'white',
    },
    content: {
      display: 'flex',
      flexDirection: 'row',
    },
    content_left: {
      display: 'flex',
      flexDirection: 'column',
      flex: '1.5',
    },
    content_right: {
      display: 'flex',
      flexDirection: 'column',
      flex: '1.5',
    },
    price_box: {
      display: 'flex',
      justifyContent: 'flex-end',
    },
    amenities: {
      display: 'flex',
      flexDirection: 'column',
    }
	}
}
