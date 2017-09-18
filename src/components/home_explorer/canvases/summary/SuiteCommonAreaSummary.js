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


class SuiteCommonAreaSummary extends Component {

	render() {
		return (
			<div style={comStyles().common_areas_summary}>
				{
					this.props.common_areas_summary.kitchen
					?
					<Statistic color='orange' value={this.props.common_areas_summary.kitchen} label={`Kitchen${this.props.common_areas_summary.kitchen > 0 ? 's' : ''}`} />
					:
					null
				}
				{
					this.props.common_areas_summary.living_room
					?
					<Statistic color='red' value={this.props.common_areas_summary.living_room} label={`Living Room${this.props.common_areas_summary.living_room > 0 ? 's' : ''}`} />
					:
					null
				}
				{
					this.props.common_areas_summary.study_den
					?
					<Statistic color='yellow' value={this.props.common_areas_summary.study_den} label={`Study Den${this.props.common_areas_summary.study_den > 0 ? 's' : ''}`} />
					:
					null
				}
				{
					this.props.common_areas_summary.patio
					?
					<Statistic color='olive' value={this.props.common_areas_summary.patio} label={`Patio${this.props.common_areas_summary.patio > 0 ? 's' : ''}`} />
					:
					null
				}
				{
					this.props.common_areas_summary.balcony
					?
					<Statistic color='green' value={this.props.common_areas_summary.balcony} label={`Balcon${this.props.common_areas_summary.balcony > 0 ? 'ies' : 'y'}`} />
					:
					null
				}
				{
					this.props.common_areas_summary.spare_rooms
					?
					<Statistic color='teal' value={this.props.common_areas_summary.spare_rooms} label={`Spare Room${this.props.common_areas_summary.spare_rooms > 0 ? 's' : ''}`} />
					:
					null
				}
				{
					this.props.common_areas_summary.common_storage_closets
					?
					<Statistic color='blue' value={this.props.common_areas_summary.common_storage_closets} label={`Storage Closet${this.props.common_areas_summary.common_storage_closets > 0 ? 's' : ''}`} />
					:
					null
				}
			</div>
		)
	}
}

// defines the types of variables in this.props
SuiteCommonAreaSummary.propTypes = {
	history: PropTypes.object.isRequired,
	common_areas_summary: PropTypes.object,
}

// for all optional props, define a default value
SuiteCommonAreaSummary.defaultProps = {
	common_areas_summary: {
		kitchen: 0,
		living_room: 0,
		study_den: 0,
		patio: 0,
		balcony: 0,
		ensuite_laundry: false,
		spare_rooms: 0,
		common_storage_closets: 0,
	}
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(SuiteCommonAreaSummary)

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
    common_areas_summary: {
      display: 'flex',
      flexDirection: 'row',
			justifyContent: 'center',
			padding: '30px',
    },
	}
}
