// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {

} from 'semantic-ui-react'
import { getSuiteInfo } from '../../../api/building/building_api'
import SingularImageGallery from '../../image/SingularImageGallery'
import ImageGallery from '../../image/ImageGallery'


class CommonAreaCanvas extends Component {

  componentWillMount() {
    console.log(JSON.parse(this.props.bottomContextValue))
    console.log(this.props.building)
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
  				{/*<SingularImageGallery
  					list_of_images={
  						[this.props.building.thumbnail].concat(JSON.parse(this.props.bottomContextValue).map((img) => {
                return img.image_url
              })).concat([this.props.building.cover_photo])
  					}
  					image_size='hd'
  				/>*/}
          <ImageGallery
  					list_of_images={
  						[this.props.building.thumbnail].concat(JSON.parse(this.props.bottomContextValue).map((img) => {
                return img.image_url
              })).concat([this.props.building.cover_photo])
  					}
  				/>
        </div>
        {/*<div style={comStyles().details}>
  				<h1>{ this.props.building.building_alias }</h1>
  				<h3>{ this.props.building.building_address }</h3>
  				<div
  					dangerouslySetInnerHTML={this.createMarkup(this.props.building.building_desc)}
  					style={comStyles().textMarkup}
  				/>
        </div>*/}
			</div>
		)
	}
}

// defines the types of variables in this.props
CommonAreaCanvas.propTypes = {
	history: PropTypes.object.isRequired,
	bottomContextValue: PropTypes.string.isRequired,	// passed in
	building: PropTypes.object.isRequired,						// passed in
}

// for all optional props, define a default value
CommonAreaCanvas.defaultProps = {

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
    },
    details: {
      width: '100%',
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
