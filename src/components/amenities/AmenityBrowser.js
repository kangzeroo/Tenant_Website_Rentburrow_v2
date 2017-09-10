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
      current_amenity: '',
    }
  }

  componentDidUpdate() {
    console.log(this.props.amenities)
  }

	render() {
		return (
			<div style={comStyles().container}>
        <div style={comStyles().amenities}>
          {
            this.state.current_amenity
            ?
            <div>
              <Button
                onClick={() => this.setState({ current_amenity: null })}
                content='Back'
              />
              { this.state.current_amenity.amenity_alias }
            </div>
            :
            <div>
              Building Amenities
            </div>
          }
        </div>
        {
          this.state.current_amenity
          ?
          <div style={comStyles().imageGallery}>
            <SingularImageGallery
              list_of_images={this.props.building.imgs}
            />
          </div>
          :
          <div style={comStyles().amenitiesGrid}>
            {
              this.props.amenities.map((am) => {
                return (
                  <Item onClick={() => this.setState({ current_amenity: am })} key={am.amenity_alias} style={comStyles().amenity}>
                    <Icon name='checkmark' />
                    <Item.Content verticalAlign='middle'>
                      <Item.Header>
                        { am.amenity_alias }
                      </Item.Header>
                    </Item.Content>
                  </Item>
                )
              })
            }
          </div>
        }
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
      height: '500px',
      overflow: 'scroll',
		},
		amenities: {
			fontSize: '2.5rem',
			lineHeight: '2.5rem',
			fontWeight: 'bold',
			borderTop: 'grey solid thin',
			margin: '10px 0px 10px 0px',
			padding: '5px 0px 5px 0px',
		},
    amenitiesGrid: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
		amenity: {
			fontSize: '1.5rem',
			lineHeight: '1.5rem',
			display: 'flex',
			flexDirection: 'row',
      width: '24%',
      cursor: 'pointer',
		},
	}
}
