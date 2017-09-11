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


class SuiteDescCanvas extends Component {

	createMarkup(string) {
		return {
			__html: string,
		}
	}

	render() {
		return (
			<div style={comStyles().container}>
				<SingularImageGallery
					list_of_images={
						[this.props.bottomContextValue.cover_photo].concat(this.props.bottomContextValue.imgs)
					}
					image_size='hd'
				/>
				<h1>{ this.props.bottomContextValue.suite_alias }</h1>
				<h3>{ `$${this.props.bottomContextValue.min_price} to $${this.props.bottomContextValue.max_price} per room` }</h3>
				<h3>{ `${this.props.bottomContextValue.available} of ${this.props.bottomContextValue.total} rooms available` }</h3>
				<div
					dangerouslySetInnerHTML={this.createMarkup(this.props.bottomContextValue.suite_desc)}
					style={comStyles().textMarkup}
				/>
			</div>
		)
	}
}

// defines the types of variables in this.props
SuiteDescCanvas.propTypes = {
	history: PropTypes.object.isRequired,
	bottomContextValue: PropTypes.object.isRequired,	// passed in
	building: PropTypes.object.isRequired,						// passed in
}

// for all optional props, define a default value
SuiteDescCanvas.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(SuiteDescCanvas)

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
