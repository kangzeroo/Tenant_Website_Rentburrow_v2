// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import StaffProfile from '../staff/StaffProfile'
import {
	Link,
	withRouter,
} from 'react-router-dom'
import {
	Button,
} from 'semantic-ui-react'


class SettingsPage extends Component {

	openUrl(url) {
		const win = window.open(url, '_blank')
		win.focus()
	}

	render() {
		return (
			<div style={comStyles().container}>
				<h2>SettingsPage</h2>

				<StaffProfile />
				{
					this.props.staffProfile.corporation_id
					?
					null
					:
					<Link to='/settings/corporation/create'>
						<Button>
		          CREATE CORPORATION
		        </Button>
					</Link>
				}
				<Button onClick={() => this.openUrl('https://beta.babylonvr.ca/')}>
	        VIRTUAL REALITY EDITOR
        </Button>
				<Link to='/settings/corporation/invite'>
					<Button>
	          INVITE STAFF
	        </Button>
				</Link>
				<Link to='/login/forgot'>
					<Button>
	          RESET PASSWORD
	        </Button>
				</Link>
				<Link to='/logout'>
					<Button>
	          LOG OUT
	        </Button>
				</Link>
			</div>
		)
	}
}

// defines the types of variables in this.props
SettingsPage.propTypes = {
	history: PropTypes.object.isRequired,
}

// for all optional props, define a default value
SettingsPage.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(SettingsPage)

// Get access to state from the Redux store
function mapStateToProps(state) {
	return {
		staffProfile: state.auth.staff_profile
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapStateToProps, {

	})(RadiumHOC)
)

// ===============================

// the JS function that returns Radium JS styling
const comStyles = () => {
	return {
		container: {
			display: 'flex',
			flexDirection: 'column',
		}
	}
}
