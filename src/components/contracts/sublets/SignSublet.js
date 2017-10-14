// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter, Route } from 'react-router-dom'
import {

} from 'semantic-ui-react'
import SubletApply from './subletee/SubletApply'
import ApplyDone from './subletee/ApplyDone'
import SubletApplication from './subletor/SubletApplication'
import ApplicationDone from './subletor/ApplicationDone'
import SubletReceipt from './SubletReceipt'
import { getSubletPostById, saveSubletApplyToDb, getSubleteeContractForSubletor, getSubletorContractForReview } from '../../../api/signing/sublet_contract_api'
import { uploadImageToS3WithEncryption } from '../../../api/aws/aws-S3'
import { generateContract } from '../../../api/pandadoc/pandadoc_api'

class SignSublet extends Component {

	constructor() {
		super()
		this.state = {
			current_form: 'subletee',
			subletee_done: false,
			subletor_done: false,
			sublet_post: {},
			subletee_contract: {},
			subletor_contract: {},
			fb_post_id: '',
			fb_user_id: '',
		}
	}

	componentWillMount() {
		this.determineActionFromUrl()
	}

	determineActionFromUrl() {
		//	the start of the sublet signing process. provides only the post_id of the facebook sublet for the subletee to fill form
		// 	'https://localhost:8082/sublet/142679255268_10155449809875269?user_id=94875275204720'

		//	the changed url when the subletee completes form. provides the unique link to give to subletor
		// 	'https://localhost:8082/sublet/142679255268_10155449809875269?contract_id=jofoalsjf8334our0fdsa'

		//	the url the subletor receives to fill form
		// 	'https://localhost:8082/sublet/142679255268_10155449809875269?contract_id=jofoalsjf8334our0fdsa&subletor_id=8759432534058430'

		// the changed url when the subletor completes form. provides the unique payment link to subletee
		// 'https://localhost:8082/sublet/142679255268_10155449809875269?user_id=94875275204720&contract_id=jofoalsjf8334our0fdsa&subletor_id=8759432534058430&payment_required=true'
		const pathname = this.props.location.pathname

		const sublet_post_id = pathname.slice(
			pathname.indexOf('/signing/sublet/') + '/signing/sublet/'.length,
			pathname.indexOf('/initiate/')
		)

		let subletor_id = ''
		if (pathname.indexOf('/apply/') > -1) {
			subletor_id = pathname.slice(pathname.indexOf('/apply/') > -1 ? pathname.indexOf('/apply/') + '/apply/'.length : '')
		}
		let application_contract_id = ''
		if (pathname.indexOf('/applications/') > -1) {
			pathname.slice(pathname.indexOf('/applications/') > -1 ? pathname.indexOf('/applications/') + '/applications/'.length : 0)
		}
		let receipt_contract_id = ''
		if (pathname.indexOf('/receipt/') > -1) {
			pathname.slice(pathname.indexOf('/receipt/') > -1 ? pathname.indexOf('/receipt/') + '/receipt/'.length : 0)
		}
		// '/signing/sublet/:post_id/initiate/apply/:subletor_id'
		// '/signing/sublet/:post_id/initiate/applications/:contract_id'
		// '/signing/sublet/:post_id/initiate/receipt/:contract_id'

		console.log('sublet_post_id', sublet_post_id)
		console.log('subletor_id', subletor_id)
		console.log('application_contract_id', application_contract_id)
		console.log('receipt_contract_id', receipt_contract_id)
		this.setState({
			fb_post_id: sublet_post_id
		})
		//	the start of the sublet signing process. provides only the post_id of the facebook sublet for the subletee to fill form

		if (sublet_post_id && subletor_id && !application_contract_id) {
		  this.initiateSubletApply(sublet_post_id)
		}
		//	the url the subletor receives to fill form
		if (sublet_post_id && !subletor_id && application_contract_id) {
			this.initiateSubletApplication(sublet_post_id, application_contract_id)
		}
	}

	initiateSubletApply(post_id) {
		this.setState({
			current_form: 'subletee',
			subletee_done: false,
			subletor_done: false,
		})
		getSubletPostById(post_id).then((data) => {
			this.setState({
				sublet_post: data
			})
		})
	}

	// for when you load a page immediately onto Subletee Done
	// initiateSubletDone(post_id, contract_id) {
	// 	getSubletPostById(post_id).then((data) => {
	// 			this.setState({
	// 				sublet_post: data
	// 			})
	// 			return getSubleteeContractForSubletor(contract_id)
	// 		})
	// 		.then((data) => {
	// 			this.setState({
	// 				current_form: 'subletee',
	// 				subletee_done: true,
	// 				subletor_done: false,
	// 				subletee_contract: JSON.parse(data),
	// 			})
	// 		})
	// }

	initiateSubletApplication(post_id, contract_id) {
		getSubletPostById(post_id)
			.then((data) => {
				this.setState({
					sublet_post: data
				})
				if (data.FB_USER_ID === this.props.tenant_profile.id) {
					return getSubleteeContractForSubletor(contract_id)
				} else {
					// do not allow progress
					// return Promise.reject()
					return getSubleteeContractForSubletor(contract_id)
				}
			})
			.then((data) => {
				this.setState({
					subletee_contract: JSON.parse(data),
					current_form: 'subletor',
					subletee_done: true,
					subletor_done: false,
				})
			})
			.catch((err) => {
				this.setState({
					current_form: 'invalid_subletor'
				})
			})
	}

	saveSubletApply(formObj) {
		uploadImageToS3WithEncryption(formObj.subletee_student_card, `${this.props.tenant_profile.id}/`, 'student_card-')
			.then((S3Obj) => {
				return saveSubletApplyToDb({
					...formObj,
					subletee_student_card: S3Obj.Location,
          fb_post_id: this.state.fb_post_id,
			    fb_user_id: this.props.tenant_profile.id,
					student_id: this.props.tenant_profile.student_id,
				})
			})
			.then((data) => {
				this.props.history.push(`${this.props.location.pathname}?contract_id=${data.contract_id}`)
				return getSubleteeContractForSubletor(data.contract_id)
			})
			.then((data) => {
				this.setState({
					current_form: 'subletee',
					subletee_done: true,
					subletee_student_card: '',
					subletor_done: false,
					subletee_contract: JSON.parse(data),
				})
			})
			.catch((err) => {
				console.log(err)
			})
	}

	saveSubletorForm(formObj) {
		uploadImageToS3WithEncryption(formObj.subletor_student_card, `${this.props.tenant_profile.id}/`, 'student_card-')
			.then((S3Obj) => {
				return saveSubletApplyToDb({
					...formObj,
					subletor_student_card: S3Obj.Location,
					fb_post_id: this.state.fb_post_id,
			    fb_user_id: this.props.tenant_profile.id,
					student_id: this.props.tenant_profile.student_id,
					contract_id: this.state.subletee_contract.contract_id,
				})
			})
			.then((data) => {
				generateContract(this.state.subletee_contract.contract_id)
				return getSubletorContractForReview(data.contract_id)
			})
			.then((data) => {
				this.setState({
					current_form: 'subletor',
					subletee_done: false,
					subletor_done: true,
					subletor_contract: JSON.parse(data),
				})
			})
			.catch((err) => {
				console.log(err)
			})
	}

	// renderSubleteeForm() {
	// 	if (this.state.sublet_post.POST_ID) {
	// 		if (this.state.subletee_done && this.state.subletee_contract && this.state.subletee_contract.contract_id) {
	// 			return (
	// 				<SubleteeDone
	// 					sublet_post={this.state.sublet_post}
	// 					subletee_contract={this.state.subletee_contract}
	// 				/>
	// 			)
	// 		} else if (this.state.subletee_done && this.state.subletee_contract && !this.state.subletee_contract.contract_id) {
	// 			return (
	// 				<div>Failed to get contract</div>
	// 			)
	// 		} else {
	// 			return (
	// 				<SubleteeForm
	// 					sublet_post={this.state.sublet_post}
	// 					saveSubletApply={(formObj) => this.saveSubletApply(formObj)}
	// 				/>
	// 			)
	// 		}
	// 	} else {
	// 		return (
	// 			<div>Loading Subletee Form...</div>
	// 		)
	// 	}
	// }
	//
	// renderSubletorForm() {
	// 	if (this.state.sublet_post.POST_ID && this.state.subletee_contract && this.state.subletee_contract.contract_id) {
	// 		if (this.state.subletor_done && this.state.subletor_contract && this.state.subletor_contract.contract_id) {
	// 			return (
	// 				<SubletorDone
	// 					sublet_post={this.state.sublet_post}
	// 					subletor_contract={this.state.subletor_contract}
	// 				/>
	// 			)
	// 		} else {
	// 			return (
	// 				<SubletorForm
	// 					sublet_post={this.state.sublet_post}
	// 					subletee_contract={this.state.subletee_contract}
	// 					saveSubletorForm={(formObj) => this.saveSubletorForm(formObj)}
	// 				/>
	// 			)
	// 		}
	// 	} else {
	// 		return (
	// 			<div>Loading Subletor Form...</div>
	// 		)
	// 	}
	// }
	//
	// renderInvalidSubletor() {
	// 	return (
	// 		<div>INVALID SUBLETOR, YOU ARE NOT THE ORIGINAL POSTER</div>
	// 	)
	// }

	render() {
		return (
			<div style={comStyles().container}>
				<Route exact path='/signing/sublet/:post_id/initiate/apply/:subletor_id'>
					{
						this.state.current_form === 'subletee' && this.state.sublet_post.POST_ID
						?
						<SubletApply
							sublet_post={this.state.sublet_post}
							saveSubletApply={(formObj) => this.saveSubletApply(formObj)}
						/>
						:
						null
					}
				</Route>
				<Route exact path='/signing/sublet/:post_id/initiate/applications/:contract_id'>
					{
						this.state.current_form === 'subletor' && this.state.sublet_post.POST_ID
						?
						<SubletApplication
							sublet_post={this.state.sublet_post}
							subletee_contract={this.state.subletee_contract}
							saveSubletorForm={(formObj) => this.saveSubletorForm(formObj)}
						/>
						:
						null
					}
				</Route>
				<Route exact path='/signing/sublet/:post_id/initiate/receipt/:contract_id'>
					<SubletReceipt />
				</Route>
			</div>
		)
	}
}

// defines the types of variables in this.props
SignSublet.propTypes = {
	history: PropTypes.object.isRequired,
	tenant_profile: PropTypes.object,
}

// for all optional props, define a default value
SignSublet.defaultProps = {
	tenant_profile: {},
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(SignSublet)

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
		}
	}
}
