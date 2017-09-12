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


class MainAmenitiesBar extends Component {

	render() {
		return (
			<div style={comStyles().container}>
        <div style={comStyles().iconBox}>
          <i className='ion-thermometer' style={comStyles().icon}></i>
          Utilities Included
        </div>
        <div style={comStyles().iconBox}>
          <i className='ion-wifi' style={comStyles().icon}></i>
          Internet Included
        </div>
        <div style={comStyles().iconBox}>
          <i className='ion-outlet' style={comStyles().icon}></i>
          Electricity Included
        </div>
        <div style={comStyles().iconBox}>
          <i className='ion-model-s' style={comStyles().icon}></i>
          Paid Parking
        </div>
			</div>
		)
	}
}

// defines the types of variables in this.props
MainAmenitiesBar.propTypes = {
	history: PropTypes.object.isRequired,
  building: PropTypes.object.isRequired,
  amenities: PropTypes.array,
}

// for all optional props, define a default value
MainAmenitiesBar.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(MainAmenitiesBar)

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
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-around',
      padding: '30px',
		},
    icon: {
      fontSize: '3rem',
    },
    iconBox: {
      display: 'flex',
      flexDirection: 'column',
      textAlign: 'center',
    }
	}
}
