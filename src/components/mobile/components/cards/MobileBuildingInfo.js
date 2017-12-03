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


class MobileBuildingInfo extends Component {
  
  createMarkup(string) {
		return {
			__html: string,
		}
	}

	render() {
		return (
			<div id='MobileBuildingInfo' style={comStyles().container}>
        <div
          dangerouslySetInnerHTML={this.createMarkup(this.props.description)}
          style={comStyles().textMarkup}
        />
			</div>
		)
	}
}

// defines the types of variables in this.props
MobileBuildingInfo.propTypes = {
	history: PropTypes.object.isRequired,
  description: PropTypes.string.isRequired,       // passed in
}

// for all optional props, define a default value
MobileBuildingInfo.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(MobileBuildingInfo)

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
    textMarkup: {
			fontSize: '1rem',
			lineHeight: '2rem',
		},
	}
}
