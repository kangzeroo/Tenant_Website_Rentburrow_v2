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
import PlacesIAppliedToLive from './tabs/PlacesIAppliedToLive'
import PeopleWhoWantToSubletMine from './tabs/PeopleWhoWantToSubletMine'
import CompletedApplications from './tabs/CompletedApplications'
import LeaseApplications from './tabs/LeaseApplications'
import { authenticateTenant, } from '../../../api/general/general_api'

class TenantApplications extends Component {

	constructor() {
		super()
		this.state = {
			fully_loaded: false,
			defaultActiveIndex: 0,
		}
	}

	componentWillMount() {
		if (authenticateTenant(this.props.tenant_profile)) {
	    const chosenTab_loc = this.props.location.search.indexOf('?tab=')
	    const chosenTab = this.props.location.search.slice(chosenTab_loc + '?tab='.length)
			this.setState({
				defaultActiveIndex: this.determineWhichTabOpen(chosenTab),
				fully_loaded: true,
			})
		} else {
			this.props.history.push('/')
		}
	}

	determineWhichTabOpen(chosenTab) {
    let activeIndex = 0
    this.renderTabs().forEach((tab) => {
      if (tab.code === chosenTab) {
        activeIndex = tab.index
      }
    })
    return activeIndex
  }

	redirectToTab(identifier) {
    // set the url to a different one
    history.pushState(null, null, `${this.props.location.pathname}?${identifier}`)
  }

	tabChanged(e, data) {
    this.redirectToTab(`tab=${data.panes[data.activeIndex].code}`)
  }

	renderTabs() {
		return [
			{ index: 0, code: 'lease-applications', menuItem: 'Lease Applications', render: () => <Tab.Pane attached={false}>{ this.renderMyLeaseApplications() }</Tab.Pane> },
			{ index: 1, code: 'where-i-want-to-live', menuItem: 'Places I have applied to live', render: () => <Tab.Pane attached={false}>{ this.renderPlacesIAppliedToLive() }</Tab.Pane> },
			{ index: 2, code: 'people-want-to-live-at-mine', menuItem: 'People who want to sublet my place', render: () => <Tab.Pane attached={false}>{ this.renderReceivedApplications() }</Tab.Pane> },
			// { index: 2, code: 'completed-apps', menuItem: 'Completed Applications', render: () => <Tab.Pane attached={false}>{ this.renderCompletedApplications() }</Tab.Pane> },
		]
	}

	renderMyLeaseApplications() {
		return (
			<LeaseApplications

			/>
		)
	}

	renderPlacesIAppliedToLive() {
		return (
			<PlacesIAppliedToLive

			/>
		)
	}

	renderReceivedApplications() {
		return (
			<PeopleWhoWantToSubletMine

			/>
		)
	}

	renderCompletedApplications() {
		return (
			<CompletedApplications

			/>
		)
	}

	render() {
		return (
			<div style={comStyles().container}>
				<div style={comStyles().tabsContainer} >
					{
						this.state.fully_loaded
						?
						<Tab
							menu={{ secondary: true, pointing: true }}
	            defaultActiveIndex={this.state.defaultActiveIndex}
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
TenantApplications.propTypes = {
	history: PropTypes.object.isRequired,
	tenant_profile: PropTypes.object,
}

// for all optional props, define a default value
TenantApplications.defaultProps = {
	tenant_profile: {},
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(TenantApplications)

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
