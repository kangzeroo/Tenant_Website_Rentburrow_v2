// Compt for copying as a PricingLandlord
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


class PricingLandlord extends Component {

	render() {
		return (
			<div id='PricingLandlord' style={comStyles().container}>
				<Card id='step1' style={comStyles().stepCard}>
					Photoshoot
				</Card>
				<Card id='step2' style={comStyles().stepCard}>
					Virtual Tour
				</Card>
				<Card id='step3' style={comStyles().stepCard}>
					Drive To Building
				</Card>
				<Card id='step4' style={comStyles().stepCard}>
					Sale & Commission
				</Card>
			</div>
		)
	}
}

// defines the types of variables in this.props
PricingLandlord.propTypes = {
	history: PropTypes.object.isRequired,
}

// for all optional props, define a default value
PricingLandlord.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(PricingLandlord)

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
			height: '90vh',
			padding: '50px',
		},
		stepCard: {
			margin: '5px auto',
		}
	}
}
