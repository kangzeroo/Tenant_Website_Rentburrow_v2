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
	Header,
} from 'semantic-ui-react'
import {
	getQuickSubletorContractLink,
} from '../../../../api/application/application_api'
import {
	downloadContract,
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
		const contract_id = pathname.slice(pathname.indexOf('/sublet_applications/subletor/') + '/sublet_applications/subletor/'.length)

		console.log(contract_id)
		const application = this.props.received_applications.filter((app) => {
													return contract_id === app.contract_id
												})[0]
	  console.log(application)
		this.setState({
			application,
		})

		getQuickSubletorContractLink(contract_id,	application.tenant_id)
		.then((data) => {
			this.setState({
				link: data.contract_link
			})
		})
	}

	goBack() {
		this.props.history.push('/sublet_applications/?tab=people-want-to-live-at-mine')
	}

	downloadContractFromAPI() {
		downloadContract(this.state.application.doc_id)
	}

	render() {
		return (
			<div style={comStyles().container}>
				<div style={comStyles().headerContainer} >
					<div style={comStyles().headerButtonsContainer} >
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
								onClick={() => this.downloadContractFromAPI()}
								disabled={this.state.application.doc_status !== 'complete'}
							/>
						}
					</div>
					<div style={comStyles().headerStatus}>
						{
							this.state.application.doc_status === 'complete'
							?
							<Header
								as='h2'
								icon='checkmark'
								content='Status: COMPLETE'
								subheader='All recipients have signed this contract'
							/>
							:
							<Header
								as='h2'
								icon='wait'
								content='Status: WAIT'
								subheader='Waiting for signatures from all recipients'
							/>
						}
					</div>
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
			//margin: '30px',
			justifyContent: 'space-between'
		},
		headerButtonsContainer: {
			display: 'flex',
			flexDirection: 'row',
			margin: '30px',
		},
		headerStatus: {
			margin: '30px',
		},
		contractContainer: {
			padding: '10px 100px 10px 100px',
			height: '90%',
			width: '100%',
			background: "transparent url('https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif') center no-repeat",
		}
	}
}
