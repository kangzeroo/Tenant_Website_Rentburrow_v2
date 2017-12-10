// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import { fadeInDown } from 'react-animations'
import { Link, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import {
  xMidBlue,
  xLightBlue,
  xDeepBlue,
} from '../../../styles/base_colors'
import {

} from 'semantic-ui-react'


class MobileHeader extends Component {

	render() {
		return (
			<div id='MobileHeader' style={comStyles().header}>
        <div style={comStyles().leftFloat}>
          <Link to='/' onClick={() => this.refreshEverything()}>
            <img style={comStyles().logo} src='https://s3.amazonaws.com/rentburrow-static-assets/Logos/rbmobile.png' alt='logo' />
          </Link>
        </div>
			</div>
		)
	}
}

// defines the types of variables in this.props
MobileHeader.propTypes = {
	history: PropTypes.object.isRequired,
}

// for all optional props, define a default value
MobileHeader.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(MobileHeader)

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
    header: {
      backgroundColor: xMidBlue,
      height: '7vh',
      width: '100%',
      zIndex: '1',
      display: 'flex',
      flexDirection: 'row',
      position: 'relative',
    },
    leftFloat: {
      float: 'left',
      padding: '0px 0px 0px 30px',
    },
    logo: {
      height: '5vh',
      display: 'inline-block',
      width: 'auto',
      float: 'left',
      // padding: '0px 0px 0px 10px',
    },
	}
}
