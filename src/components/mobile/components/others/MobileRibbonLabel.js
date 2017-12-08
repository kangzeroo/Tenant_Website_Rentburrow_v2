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


class MobileRibbonLabel extends Component {

  determineColor(label) {
    if (label.toLowerCase().indexOf('waitlist') > -1) {
      return 'violet'
    } else if (label === 'Apply Now') {
      return 'blue'
    } else if (label === 'Sold Out') {
      return 'red'
    } else if (label.toLowerCase().indexOf('not yet') > -1) {
      return 'purple'
    } else {
      return 'yellow'
    }
  }

	render() {
		return (
			<div id='MobileRibbonLabel' style={comStyles().container}>
        <Label color={this.determineColor(this.props.label)} ribbon='right'>
          <div style={comStyles().label}>{ this.props.label }</div>
        </Label>
			</div>
		)
	}
}

// defines the types of variables in this.props
MobileRibbonLabel.propTypes = {
	history: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,       // passed in
  size: PropTypes.string,                   // passed in
}

// for all optional props, define a default value
MobileRibbonLabel.defaultProps = {
  label: '',
  size: 'large',
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(MobileRibbonLabel)

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
    label: {
      fontSize: '3.5rem',
      padding: '10px',
    }
	}
}
