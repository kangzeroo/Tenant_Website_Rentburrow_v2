// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
  Card,
} from 'semantic-ui-react'


class AllLandlords extends Component {

	render() {
		return (
			<Card id='AllLandlords' style={comStyles().container}>
				AllLandlords - This component should display all landlords/property managers. For example 30 Hickory St W has many suites managed by Domus and Atlas and small independent landlords.
        This component should also display sublets scrapped from facebook.
			</Card>
		)
	}
}

// defines the types of variables in this.props
AllLandlords.propTypes = {
	history: PropTypes.object.isRequired,
}

// for all optional props, define a default value
AllLandlords.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(AllLandlords)

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
      margin: '30px auto',
		}
	}
}
