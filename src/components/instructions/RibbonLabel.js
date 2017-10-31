// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
  Label,
} from 'semantic-ui-react'


class RibbonLabel extends Component {

  determineColor(label) {
    if (label.toLowerCase().indexOf('waitlist') > -1) {
      return 'violet'
    } else if (label === 'Apply Now') {
      return 'blue'
    } else if (label === 'Sold Out') {
      return 'red'
    } else {
      return 'yellow'
    }
  }

	render() {
		return (
			<div style={comStyles().container}>
        <Label color={this.determineColor(this.props.label)} ribbon='right'>{ this.props.label }</Label>
			</div>
		)
	}
}

// defines the types of variables in this.props
RibbonLabel.propTypes = {
	history: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,       // passed in
  size: PropTypes.string,                   // passed in
}

// for all optional props, define a default value
RibbonLabel.defaultProps = {
  label: '',
  size: 'large',
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(RibbonLabel)

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
		}
	}
}
