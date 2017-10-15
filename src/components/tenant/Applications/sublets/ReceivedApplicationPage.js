// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import {
	Button,
} from 'semantic-ui-react'
import {
	getQuickSubletorContractLink,
} from '../../../../api/application/application_api'
import {
	generateNewTokens,
} from '../../../../api/pandadoc/pandadoc_api'

class ReceivedSentApplicationPage extends Component {

	constructor() {
		super()
		this.state = {
			application: {},
			link: '',
		}
	}

	componentWillMount() {
		const pathname = this.props.location.pathname
		const contract_id = pathname.slice(pathname.indexOf('/applications/subletor/') + '/applications/subletor/'.length)

		const application = this.props.received_applications.filter((app) => {
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
		getQuickSubletorContractLink(contract_id,	application.student_id)
		.then((data) => {
			this.setState({
				link: JSON.parse(data).contract_link
			})
		})
	}

	goBack() {
		this.props.history.push('/applications/?tab=people-want-to-live-at-mine')
	}

	downloadContract() {
		generateNewTokens()
		.then((data) => {
			console.log(`https://api.pandadoc.com/public/v1/documents/${this.state.application.doc_id}/download`)
			
			window.open(`https://api.pandadoc.com/public/v1/documents/${this.state.application.doc_id}/download`,
								{ headers: { 'Authorization': `Bearer ${data.access_token}` } })
			//  axios.get(`https://api.pandadoc.com/public/v1/documents/${this.state.application.doc_id}/download`,
			//  					{ headers: { 'Authorization': `Bearer ${data.access_token}` } })
			// .then((data) => {
			// 	console.log(data)
			// 	window.open(`https://api.pandadoc.com/public/v1/documents/${this.state.application.doc_id}/download`)
			// })
		})
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
						this.state.link !== null
						?
						<Button
							primary
							icon='cloud download'
							content='Download Contract'
							onClick={() => this.downloadContract()}
						/>
						:
						null
					}
				</div>
				<div style={comStyles().contractContainer} >
				{
					this.state.link !== null
					?
					<iframe
						src={this.state.link}
						height={`900px`}
						width={`100%`}
					>
					</iframe>
					:
					<h2>Contract Not Available</h2>
				}
				</div>
			</div>
		)
	}
}

// defines the types of variables in this.props
ReceivedSentApplicationPage.propTypes = {
	history: PropTypes.object.isRequired,
	received_applications: PropTypes.array,
}

// for all optional props, define a default value
ReceivedSentApplicationPage.defaultProps = {
	received_applications: [],
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(ReceivedSentApplicationPage)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
		received_applications: redux.contract.received_applications,
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
