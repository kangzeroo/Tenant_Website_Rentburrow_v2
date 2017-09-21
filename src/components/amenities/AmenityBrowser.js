// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
  Item,
  Icon,
  Button,
} from 'semantic-ui-react'
import SingularImageGallery from '../image/SingularImageGallery'


class AmenityBrowser extends Component {

  constructor() {
    super()
    this.state = {
      current_amenity: {},
    }
  }

  componentWillMount() {
    if (this.props.amenities.length > 0) {
      this.setState({
        current_amenity: this.props.amenities[0]
      })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // console.log(this.props.amenities)
    if (prevProps && (prevProps.amenities !== this.props.amenities)) {
      this.setState({
        current_amenity: this.props.amenities[0]
      })
    }
  }

	render() {
		return (
			<div style={comStyles().container}>
        <div style={comStyles().amenities}>
          Amenities
        </div>
        <div style={comStyles().box}>
          <div style={comStyles().amenitiesGrid}>
            {
              this.props.amenities.map((am, index) => {
                return (
                  <Item
                    onClick={() => {
                      this.setState({ current_amenity: am })
                    }}
                    key={am.amenity_alias || index}
                    style={amenityStyles(this.state.current_amenity, am).amenity}
                  >
                    <Icon name='checkmark' />
                    <Item.Content>
                      <Item.Header>
                        { am.amenity_alias }
                      </Item.Header>
                    </Item.Content>
                  </Item>
                )
              })
            }
          </div>
          {
            this.state.current_amenity.imgs && this.state.current_amenity.imgs.length > 0
            && this.state.current_amenity.imgs[0] !== null
            ?
            <div style={comStyles().imageGallery}>
              <SingularImageGallery
                list_of_images={this.state.current_amenity.imgs}
                image_size='thumbnail'
              />
            </div>
            :
            <div style={comStyles().imageGallery}>
              <Icon
                name='dont'
                size='huge'
                color='blue'
              />
              <h2>No Image Available</h2>
            </div>
          }
        </div>
			</div>
		)
	}
}

// defines the types of variables in this.props
AmenityBrowser.propTypes = {
	history: PropTypes.object.isRequired,
  building: PropTypes.object.isRequired,
  amenities: PropTypes.array,
}

// for all optional props, define a default value
AmenityBrowser.defaultProps = {
  amenities: [],
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(AmenityBrowser)

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
      height: '100%',
      overflow: 'scroll',
      backgroundColor: 'white',
      padding: '20px',
		},
		amenities: {
			fontSize: '2.0rem',
			lineHeight: '2.0rem',
			fontWeight: 'bold',
			margin: '10px auto',
			padding: '5px 0px 5px 0px',
		},
    amenitiesGrid: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      width: '50%',
      height: '100%',
      padding: '10px',
      border: 'black solid thin',
      borderRadius: '3px',
    },
    imageGallery: {
      width: '45%',
      height: 'auto',
      border: 'black solid thin',
      borderRadius: '3px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    box: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
	}
}

const amenityStyles = (current_amenity, this_amenity) => {
  let style = {
    backgroundColor: 'rgba(0,0,0,0)'
  }
  if (current_amenity.amenity_alias === this_amenity.amenity_alias) {
    style = {
      backgroundColor: 'rgba(153,204,255,0.8)',
      borderRadius: '3px'
    }
  }
  return {
		amenity: {
			fontSize: '1.0rem',
			lineHeight: '1.0rem',
			display: 'flex',
			flexDirection: 'row',
      width: '33%',
      cursor: 'pointer',
      padding: '10px',
      ...style,
		},
  }
}
