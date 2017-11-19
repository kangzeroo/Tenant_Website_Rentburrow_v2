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
} from 'semantic-ui-react'
import LeaseApplicationsTab from './tabs/LeaseApplicationsTab'
import { authenticateTenant, } from '../../../api/general/general_api'
import { updateLeaseDocumentStatus } from '../../../api/pandadoc/pandadoc_api'

class TenantLeaseApplications extends Component {

	constructor() {
		super()
		this.state = {
			fully_loaded: false,
			// defaultActiveIndex: 0,
		}
	}

	componentWillMount() {
		if (authenticateTenant(this.props.tenant_profile)) {
	    // const chosenTab_loc = this.props.location.search.indexOf('?tab=')
	    // const chosenTab = this.props.location.search.slice(chosenTab_loc + '?tab='.length)
			updateLeaseDocumentStatus(this.props.tenant_profile.tenant_id)
			.then((data) => {
				this.setState({
					// defaultActiveIndex: this.determineWhichTabOpen(chosenTab),
					fully_loaded: true,
				})
			})
		} else {
			this.props.history.push('/')
		}
	}

	renderTabs() {
		return [
			{ index: 0, code: 'lease-applications', menuItem: 'Lease Applications', render: () => <Tab.Pane attached={false}>{ this.renderMyLeaseApplicationsTab() }</Tab.Pane> },
			]
		}

	renderMyLeaseApplicationsTab() {
		return (
			<LeaseApplicationsTab

			/>
		)
	}


	render() {
		return (
			<div id='TenantLeaseApplications' style={comStyles().container}>
				<div style={comStyles().tabsContainer} >
					{
						this.state.fully_loaded
						?
						<Tab
							menu={{ secondary: true, pointing: true }}
							defaultActiveIndex={0}
							panes={this.renderTabs()}
							onTabChange={(e, d) => this.tabChanged(e, d)}
						/>
						:
						null
					}
				</div>
			</div>
		)
	}
}

// defines the types of variables in this.props
TenantLeaseApplications.propTypes = {
	history: PropTypes.object.isRequired,
	tenant_profile: PropTypes.object.isRequired,
}

// for all optional props, define a default value
TenantLeaseApplications.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(TenantLeaseApplications)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
		tenant_profile: redux.auth.tenant_profile,
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
