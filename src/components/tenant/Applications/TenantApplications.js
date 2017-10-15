// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
	Tab,
	Label,
	Menu,
} from 'semantic-ui-react'
import SentApplications from './tabs/SentApplications'
import ReceivedApplications from './tabs/ReceivedApplications'

class TenantApplications extends Component {

	renderTabs() {
		return [
			{ menuItem: 'Sent Applications', render: () => <Tab.Pane attached={false}>{ this.renderSentApplications() }</Tab.Pane> },
			{ menuItem: 'Received Applications', render: () => <Tab.Pane attached={false}>{ this.renderReceivedApplications() }</Tab.Pane> },
		]
	}

	renderSentApplications() {
		return (
			<SentApplications

			/>
		)
	}

	renderReceivedApplications() {
		return (
			<ReceivedApplications

			/>
		)
	}

	render() {
		return (
			<div style={comStyles().container}>
				<div style={comStyles().tabsContainer} >
					<Tab
						menu={{ secondary: true, pointing: true }}
						panes={this.renderTabs()}
					/>
				</div>
			</div>
		)
	}
}

// defines the types of variables in this.props
TenantApplications.propTypes = {
	history: PropTypes.object.isRequired,
}

// for all optional props, define a default value
TenantApplications.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(TenantApplications)

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
		tabsContainer: {
			margin: '50px'
		}
	}
}
