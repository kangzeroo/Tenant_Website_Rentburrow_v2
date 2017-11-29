// Compt for copying as a PrizeBlowup
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import { xMidBlue, xDeepBlue } from '../../styles/base_colors'
import {
  Button,
} from 'semantic-ui-react'


class PrizeBlowup extends Component {

  constructor() {
    super()
    this.state = {
      expanded: false,
    }
  }

	render() {
		return (
			<div id='PrizeBlowup' style={comStyles(this.state.expanded).container}>
        <Button color='blue' onClick={() => this.setState({ expanded: !this.state.expanded })} circular size='massive' icon={this.state.expanded ? 'chevron down' : 'chevron up'} style={comStyles().show_or_hide} />
			</div>
		)
	}
}

// defines the types of variables in this.props
PrizeBlowup.propTypes = {
	history: PropTypes.object.isRequired,
}

// for all optional props, define a default value
PrizeBlowup.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(PrizeBlowup)

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
const comStyles = (expanded) => {
  let expandedStyles = {
    height: '20px',
  }
  if (expanded) {
    expandedStyles = {
      ...expandedStyles,
      height: '80vh',
    }
  }
	return {
		container: {
      ...expandedStyles,
      display: 'flex',
      flexDirection: 'column',
      width: '100vw',
      backgroundColor: xMidBlue,
      zIndex: 20,
		},
    show_or_hide: {
      position: 'absolute',
      top: '-30px',
      left: '50vw',
    }
	}
}
