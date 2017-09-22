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
import SingularImageGallery from '../../image/SingularImageGallery'
import AmenityBrowser from '../../amenities/AmenityBrowser'


class AmenityProofs extends Component {

  componentWillMount() {
    // console.log(this.props.bottomContextValue)
  }

	render() {
		return (
			<div style={comStyles().container}>
        <AmenityBrowser
          amenities={this.props.bottomContextValue.map((am) => {
            return am.value
          })}
          building={this.props.building}
        />
				{/*<SingularImageGallery
					list_of_images={this.props.bottomContextValue.imgs || this.props.bottomContextValue.image_urls}
					image_size='hd'
				/>
				<h2>{ this.props.bottomContextValue.amenity_alias }</h2>*/}
			</div>
		)
	}
}

// defines the types of variables in this.props
AmenityProofs.propTypes = {
	history: PropTypes.object.isRequired,
	bottomContextValue: PropTypes.array,	             // passed in
	building: PropTypes.object.isRequired,						// passed in
}

// for all optional props, define a default value
AmenityProofs.defaultProps = {
  bottomContextValue: {},
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(AmenityProofs)

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
      padding: '20px',
		}
	}
}
