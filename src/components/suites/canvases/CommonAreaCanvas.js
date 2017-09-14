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
import { getSuiteInfo } from '../../../api/building/building_api'
import SingularImageGallery from '../../image/SingularImageGallery'
import ImageGallery from '../../image/ImageGallery'


class CommonAreaCanvas extends Component {

  componentWillMount() {
    console.log(JSON.parse(this.props.bottomContextValue))
    console.log(this.props.building)
    console.log(JSON.parse(this.props.suite))
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
  						(this.props.suite ? [] : [this.props.building.thumbnail]).concat(JSON.parse(this.props.bottomContextValue).map((img) => {
                return img.image_url
              })).concat([this.props.building.cover_photo])
  					}
  					image_size='hd'
  				/>
          <div style={comStyles().infoBanner}>
            {
              this.props.suite
              ?
  				    <h1>{ `${JSON.parse(this.props.suite).suite_alias} Unit` || `Unit ${JSON.parse(this.props.suite).suite_code}` }</h1>
              :
  				    <h1>{ this.props.building.building_alias }</h1>
            }
          </div>
          <div style={comStyles().scrollDown}>
            <Icon name='double angle down' size='huge' />
            <p>Scroll Down</p>
          </div>
        </div>
        {
          this.props.suite
          ?
          null
          :
  				<h3>{ this.props.building.building_address }</h3>
        }
				<div
					dangerouslySetInnerHTML={this.createMarkup(this.props.suite ? JSON.parse(this.props.suite).suite_desc : this.props.building.building_desc)}
					style={comStyles().textMarkup}
				/>
			</div>
		)
	}
}

// defines the types of variables in this.props
CommonAreaCanvas.propTypes = {
	history: PropTypes.object.isRequired,
	bottomContextValue: PropTypes.string.isRequired,	// passed in
	building: PropTypes.object.isRequired,						// passed in
  suite: PropTypes.string,             // passed in, determines if <CommonAreaCanvas> refers to the building or a suites common areas. Will affect order of images displayed and desc displayed
}

// for all optional props, define a default value
CommonAreaCanvas.defaultProps = {
  suite: null,
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(CommonAreaCanvas)

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
	}
}
