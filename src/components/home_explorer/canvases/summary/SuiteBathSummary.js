// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
	Statistic,
} from 'semantic-ui-react'


class SuiteBathSummary extends Component {

	render() {
		return (
			<div style={comStyles().baths_summary}>
				{
					this.props.baths_summary.full_baths > 0
					?
					<Statistic>
			      <Statistic.Value>{`${this.props.baths_summary.full_baths}`}</Statistic.Value>
			      <Statistic.Label>{`Full Bathroom${this.props.baths_summary.full_baths > 0 ? 's' : ''}`}</Statistic.Label>
			    </Statistic>
					:
					null
				}
				{
					this.props.baths_summary.half_baths > 0
					?
					<h2>{`${this.props.baths_summary.half_baths} half bathroom${this.props.baths_summary.half_baths > 0 ? 's' : ''}`}</h2>
					:
					null
				}
				{
					this.props.baths_summary.shared_baths > 0
					?
					<h2>{`${this.props.baths_summary.shared_baths} suite bathroom${this.props.baths_summary.shared_baths > 0 ? 's' : ''} shared with a bedroom`}</h2>
					:
					null
				}
			</div>
		)
	}
}

// defines the types of variables in this.props
SuiteBathSummary.propTypes = {
	history: PropTypes.object.isRequired,
	baths_summary: PropTypes.object,
}

// for all optional props, define a default value
SuiteBathSummary.defaultProps = {
	baths_summary: {
		full_baths: 0,
		half_baths: 0,
		shared_baths: 0,
	}
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(SuiteBathSummary)

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
		baths_summary: {
      display: 'flex',
      flexDirection: 'row',
			justifyContent: 'center',
      height: '100%',
			padding: '30px',
    },
	}
}
