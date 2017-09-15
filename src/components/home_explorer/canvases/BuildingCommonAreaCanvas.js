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
} from '../../../api/building/building_api'
import SingularImageGallery from '../../image/SingularImageGallery'
import ImageGallery from '../../image/ImageGallery'


class BuildingCommonAreaCanvas extends Component {

  constructor() {
    super()
    this.state = {
    }
  }

  componentWillMount() {
    this.summarizeBuilding()
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.building.building_id !== this.props.building.building_id) {
      this.summarizeBuilding()
    }
  }

  summarizeBuilding() {
    console.log('summarizeBuilding')
  }

	createMarkup(string) {
		return {
			__html: string,
		}
	}

	render() {
		return (
			<div style={comStyles().container}>
        <div id='containImage' style={comStyles().containImage}>
  				<SingularImageGallery
  					list_of_images={
  						([this.props.building.thumbnail]).concat(this.props.images.map((img) => {
                return img.image_url
              })).concat([this.props.building.cover_photo])
  					}
  					image_size='hd'
  				/>
          <div style={comStyles().infoBanner}>
            <h1>{ this.props.building.building_alias }</h1>
          </div>
          <div style={comStyles().scrollDown}>
            <Icon name='double angle down' size='huge' />
            <p>Scroll Down</p>
          </div>
        </div>
        <div style={comStyles().summarization}>
          <div style={comStyles().desc_upper}>
            <h3>{ this.props.building.building_address }</h3>
    				<div
    					dangerouslySetInnerHTML={this.createMarkup(this.props.building.building_desc)}
    					style={comStyles().textMarkup}
    				/>
          </div>
          <div style={comStyles().stats_lower}>
          </div>
        </div>
			</div>
		)
	}
}

// defines the types of variables in this.props
BuildingCommonAreaCanvas.propTypes = {
	history: PropTypes.object.isRequired,
	images: PropTypes.array.isRequired,	// passed in
	building: PropTypes.object.isRequired,						// passed in
}

// for all optional props, define a default value
BuildingCommonAreaCanvas.defaultProps = {
  suite: null,
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(BuildingCommonAreaCanvas)

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
		},
    containImage: {
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
		bar: {
			display: 'flex',
			flexDirection: 'row',
		},
		textMarkup: {
			fontSize: '1rem',
			lineHeight: '2rem',
		},
    summarization: {
      display: 'flex',
      flexDirection: 'column',
    },
    desc_upper: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      minHeight: '100px',
    },
    stats_lower: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
    },
    baths_summary: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      border: '1px solid black',
    },
    rooms_summary: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      border: '1px solid black',
    },
	}
}
