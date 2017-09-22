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
	Icon,
} from 'semantic-ui-react'


class SuiteBedSummary extends Component {

	render() {
		return (
			<div style={comStyles().rooms_summary}>
				{
					this.props.rooms_summary.total_rooms
					?
					<Statistic size='small'>
			      <Statistic.Value>
							<Icon name='bed' />
			        {this.props.rooms_summary.total_rooms}
			      </Statistic.Value>
			      <Statistic.Label>Bedrooms <br /> { this.props.rooms_summary.total_ensuite_baths > 0 ? `with ${this.props.rooms_summary.total_ensuite_baths} ensuite baths` : null }</Statistic.Label>
			    </Statistic>
					:
					null
				}
				{
					this.props.rooms_summary.standard_price !== 0
					?
					<Statistic size='small'>
			      <Statistic.Value>
			        ${this.props.rooms_summary.standard_price}
			      </Statistic.Value>
			      <Statistic.Label>Per Room</Statistic.Label>
			    </Statistic>
					:
					<div>
						{
							this.props.rooms_summary.min_price !== 0
							?
							<Statistic size='small'>
								<Statistic.Value>
									{`$${this.props.rooms_summary.min_price}+`}
								</Statistic.Value>
								<Statistic.Label>Per Room</Statistic.Label>
							</Statistic>
							:
							null
						}
					</div>
				}
			</div>
		)
	}
}

// defines the types of variables in this.props
SuiteBedSummary.propTypes = {
	history: PropTypes.object.isRequired,
	rooms_summary: PropTypes.object,
}

// for all optional props, define a default value
SuiteBedSummary.defaultProps = {
	rooms_summary: {
		total_rooms: 0,
		total_ensuite_baths: 0,
		standard_price: 0,
		min_price: 0,
		max_price: 0,
	}
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(SuiteBedSummary)

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
    rooms_summary: {
      display: 'flex',
      flexDirection: 'row',
			justifyContent: 'center',
      height: '100%',
			width: '100%',
    },
	}
}
