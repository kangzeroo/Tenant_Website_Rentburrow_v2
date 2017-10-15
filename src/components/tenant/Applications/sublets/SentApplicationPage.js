// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
	Button,
} from 'semantic-ui-react'
import {
	getQuickSubleteeContractLink,
} from '../../../../api/application/application_api'
import {
	generateNewTokens,
} from '../../../../api/pandadoc/pandadoc_api'

class SentApplicationPage extends Component {

		constructor() {
			super()
			this.state = {
				application: {},
				link: '',
			}
		}

		componentWillMount() {
			const pathname = this.props.location.pathname
			const contract_id = pathname.slice(pathname.indexOf('/applications/subletee/') + '/applications/subletee/'.length)

			console.log(this.props.sent_applications)
			const application = this.props.sent_applications.filter((app) => {
														return contract_id === app.contract_id
													})[0]

			this.setState({
				application,
			})
			// const time = moment.duration('00:03:00');
			// const expiry_date = moment(this.props.details.session_expires_at).subtract(time).format()
			// const cur_date = moment().format()
			// if (cur_date >= expiry_date) {
			//
			// }
			getQuickSubleteeContractLink(contract_id,	application.student_id)
			.then((data) => {
				this.setState({
					link: JSON.parse(data).contract_link
				})
			})
		}

		goBack() {
			this.props.history.push('/applications/?tab=where-i-want-to-live')
		}
	render() {
		return (
			<div style={comStyles().container}>
				<div style={comStyles().headerContainer} >
					<Button
						primary
						basic
						icon='chevron left'
						content='back'
						onClick={() => this.goBack()}
					/>
					{
						this.state.link === null || this.state.link === ''
						?
						null
						:
						<Button
							primary
							icon='cloud download'
							content='Download Contract'
							onClick={() => this.downloadContract()}
						/>
					}
				</div>
				<div style={comStyles().contractContainer} >
				{
					this.state.link === null || this.state.link === ''
					?
					<h2>Contract Not Available</h2>
					:
					<iframe
						src={this.state.link}
						height={`900px`}
						width={`100%`}
					>
					</iframe>

				}
				</div>
			</div>
		)
	}
}

// defines the types of variables in this.props
SentApplicationPage.propTypes = {
	history: PropTypes.object.isRequired,
	sent_applications: PropTypes.array,
}

// for all optional props, define a default value
SentApplicationPage.defaultProps = {
	sent_applications: []
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(SentApplicationPage)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
		sent_applications: redux.contract.sent_applications,
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
		headerContainer: {
			display: 'flex',
			flexDirection: 'row',
			margin: '30px',
		},
		contractContainer: {
			padding: '10px 100px 10px 100px',
			height: '90%',
			width: '100%'
		}
	}
}