// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import moment from 'moment'
import { withRouter } from 'react-router-dom'
import {
	Card,
	Image,
	Button,
} from 'semantic-ui-react'
import {
  shortenAddress,
} from '../../../../api/general/general_api'
import {
	generateNewSubletorSession,
} from '../../../../api/pandadoc/pandadoc_api'
import {
	saveReceivedApplicationsToRedux,
} from '../../../../actions/contract/contract_actions'
import {
	getReceivedApplications,
} from '../../../../api/application/application_api'

class ReceivedApplicationCard extends Component {

	goToOriginalPost(e, post_id) {
		if (e) {
			e.stopPropagation()
		}
		window.open(`https://www.facebook.com/${post_id}`, '_blank')
	}

	goToFacebookUser(e, fb_user_id) {
		if (e) {
			e.stopPropagation()
		}
		window.open(`https://www.facebook.com/${fb_user_id}`, '_blank')
	}

	goToPage(contract_id) {
		this.props.history.push(`/applications/subletor/${contract_id}`)
	}

	newSession(contract_id) {
		// PandaDoc's time is in Zulu time (WTF). The time to live is indicated in the backend in seconds...
		// Zulu time is 4 hours ahead of EDT time. We'll give a generous 4 Hr & 15 min to generate a new session.
		const time = moment.duration('04:15:00');
		const generated_expiry_date = moment(this.props.details.session_expires_at, 'YYYY-MM-DD HH:mm').subtract(time)
		const cur_date = moment()

		if (cur_date.isAfter(generated_expiry_date)) {
			console.log('generating new session...')
			generateNewSubletorSession({
				subletor_id: this.props.details.subletor_id,
				doc_id: this.props.details.doc_id,
				email: this.props.details.my_email,
			})
			.then(() => {
				getReceivedApplications({ student_id: this.props.details.student_id })
				.then((data) => {
					saveReceivedApplicationsToRedux(data.map(s => JSON.parse(s)))
				})
			})
			.then(() => {
				this.props.history.push(`/applications/subletor/${contract_id}`)
			})
		} else {
			this.props.history.push(`/applications/subletor/${contract_id}`)
		}
	}

	render() {
		return (
			<div style={comStyles().container}>
			<Card raised onClick={() => this.newSession(this.props.details.contract_id)}>
				<Card.Content>
					<Card.Header>
						{shortenAddress(this.props.details.building_address)}
						<Image
							shape='circular'
							src={this.props.details.subletee_fb_pic}
							size='tiny'
							bordered
							onClick={(e) => this.goToFacebookUser(e, this.props.details.subletee_fb_id)}
							style={comStyles().subletor_pic}
						/>
					</Card.Header>
					<Card.Meta>{this.props.details.suite_num ? 'Suite ' + this.props.details.suite_num : ''}</Card.Meta>
					<Card.Meta>{this.props.details.room_num ? 'Room ' + this.props.details.room_num : ''}</Card.Meta>
					<Card.Meta>{'Applied On ' + moment(this.props.details.created_at).format('MMM Do YYYY')}</Card.Meta>
					<Card.Description>{'Begin Date:  ' + moment(this.props.details.begin_date).format('MMM Do YYYY')}</Card.Description>
					<Card.Description>{'End Date:  ' + moment(this.props.details.end_date).format('MMM Do YYYY')}</Card.Description>
					<Card.Description>{'Monthly Rent:  $' + this.props.details.rent_price}</Card.Description>
					<div style={comStyles().buttons_container}>
						<Button
							primary
							basic
							content='Original Post'
							onClick={(e) => this.goToOriginalPost(e, this.props.details.fb_post_id)}
						/>
						{
							this.props.details.contract_link
							?
							<Button
								primary
								basic
								content='View Contract'
							/>
							:
							null
						}
					</div>
				</Card.Content>
			</Card>
			</div>
		)
	}
}

// defines the types of variables in this.props
ReceivedApplicationCard.propTypes = {
	history: PropTypes.object.isRequired,
	details: PropTypes.object.isRequired, 												// passed in
	saveReceivedApplicationsToRedux: PropTypes.func.isRequired,
}

// for all optional props, define a default value
ReceivedApplicationCard.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(ReceivedApplicationCard)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {

	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
		saveReceivedApplicationsToRedux,
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
		buttons_container: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: '10px 0px 10px 0px'
    },
    subletor_pic: {
      position: 'absolute',
      top: '5px',
      right: '5px'
    }
	}
}
