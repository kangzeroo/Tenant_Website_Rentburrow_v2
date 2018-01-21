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
	Button,
	Form,
	Input,
	Header,
	Dropdown,
	Icon,
	TextArea,
	Message,
} from 'semantic-ui-react'
import SingularImageGallery from '../../image/SingularImageGallery'
import { validateEmail, aliasToURL } from '../../../api/general/general_api'
import { check_if_building_accessible } from '../../../api/label/building_label_api'
import { collectIntel } from '../../../actions/intel/intel_actions'
import { BUILDING_INTERACTIONS } from '../../../api/intel/dynamodb_tablenames'
import { insertScheduledTour } from '../../../api/tour/tour_api'
import { insertTenantInquiry, } from '../../../api/inquiries/inquiry_api'
import { sendInitialMessage, sendTenantWaitMsg, } from '../../../api/sms/sms_api'
import { getLandlordInfo, } from '../../../api/search/search_api'

class TourPopup extends Component {

	constructor() {
		super()
		this.state = {
			phoneRequired: false,
      emailRequired: false,

      phone: '',
      email: '',

      group_size: 1,
      group_notes: '',
      acknowledge: false,

      saving: false,
      submitted: false,

      error_messages: [],
		}
		this.group_size_options = [
      { key: 'unknown', text: 'Unknown', value: 0 },
      { key: 'one', text: '1', value: 1 },
      { key: 'two', text: '2', value: 2 },
      { key: 'three', text: '3', value: 3 },
      { key: 'four', text: '4', value: 4 },
      { key: 'five', text: '5', value: 5 },
      { key: 'six', text: '6', value: 6 },
      { key: 'seven', text: '7', value: 7 },
      { key: 'eight', text: '8', value: 8 },
      { key: 'nine', text: '9', value: 9 },
      { key: 'ten', text: '10', value: 10 },
      { key: 'plus', text: '10+', value: 11 },
    ]
	}

	componentWillMount() {
		if (!this.props.tenant_profile.phone || this.props.tenant_profile.phone.length === 0) {
			// console.log('no phone')
			this.setState({
				phoneRequired: true,
			})
		} else {
			this.setState({
				phone: this.props.tenant_profile.phone,
			})
		}

		if (!this.props.tenant_profile.email || this.props.tenant_profile.email.length === 0) {
			// console.log('no email')
			this.setState({
				emailRequired: true,
			})
		} else {
			this.setState({
				email: this.props.tenant_profile.email,
			})
		}
	}

	updateAttr(e, attr) {
		this.setState({
			[attr]: e.target.value
		})
	}

	updateGroupSize(e, data, attr) {
		this.setState({
			[attr]: data.value,
		})
	}

	selectThisBuilding(building) {
		if (check_if_building_accessible(building.label)) {
			window.open(`${window.location.origin}/${aliasToURL(building.building_alias)}`, '_blank')
		} else {
			// do nothing
		}
		this.props.collectIntel({
			'TableName': BUILDING_INTERACTIONS,
			'Item': {
				'ACTION': 'BUILDING_CARD_CLICKED',
				'DATE': new Date().getTime(),
				'BUILDING_ID': building.building_id,
				'ADDRESS': building.building_address,
				'USER_ID': this.props.tenant_profile.tenant_id,
				'CORP_ID': building.corporation_id,
				'FINGERPRINT': this.props.fingerprint,
			}
		})
		// console.log(`${window.location.origin}/${aliasToURL(building.building_alias)}`)
	}

	validateForm() {
    let ok_to_proceed = true
    const error_messages = []
    if (!this.state.group_size) {
      error_messages.push('You must specify a group size')
      ok_to_proceed = false
    }
    if (this.state.group_notes.length === 0) {
      error_messages.push('Please enter a Message')
      ok_to_proceed = false
    }
    if (this.state.phoneRequired && this.state.phone.length === 0) {
      error_messages.push('You must enter your phone number')
      ok_to_proceed = false
    }
    if (this.state.emailRequired && this.state.email.length === 0) {
      error_messages.push('You must enter your email address')
      ok_to_proceed = false
    }
    if (this.state.emailRequired && !validateEmail(this.state.email)) {
      error_messages.push('The email address entered is not valid')
      ok_to_proceed = false
    }
    if ((this.state.emailRequired || this.state.phoneRequired) && !this.state.acknowledge) {
      error_messages.push('Please check the checkbox')
      ok_to_proceed = false
    }
    this.setState({
      error_messages: error_messages,
      submitted: false,
    })
    return ok_to_proceed
  }

	saveTour(tour, building) {
		let inquiry_id
		if (this.validateForm()) {
			this.setState({
				loading: true,
			})

			const body = `GROUP TOUR REQUEST: My group would like to join the tour for ${building.building_alias} that is happening on ${moment(tour.selected_date).format('MMMM Do YYYY, HH:mm a')}. That tour was originally booked by ${tour.first_name} ${tour.last_name}. My group is different and has ${this.state.group_size} people.`
			insertScheduledTour({
				tenant_id: this.props.tenant_profile.tenant_id,
	      landlord_id: tour.landlord_id,
	      building_id: tour.building_id,
	      selected_date: tour.selected_date,
			})
			.then((data) => {
				return insertTenantInquiry({
					tenant_id: this.props.tenant_profile.tenant_id,
					group_id: null,
					building_id: building.building_id,
					group_notes: body,
					group_size: this.state.group_size,
				})
			})
			.then((data) => {
				inquiry_id = data.inquiry_id
				return getLandlordInfo(building.building_id)
			})
			.then((data) => {
				if (data.corporate_landlord) {
					return sendTenantWaitMsg({
            tenant: {
              tenant_id: this.props.tenant_profile.tenant_id,
              first_name: this.props.tenant_profile.first_name,
              last_name: this.props.tenant_profile.last_name,
              phone: this.props.tenant_profile.phone ? this.props.tenant_profile.phone : this.state.phone,
            },
            building: {
              building_id: building.building_id,
              building_alias: building.building_alias,
              building_address: building.building_address,
            },
            group_notes: body,
            group_size: this.state.group_size,
            corporation_email: data.email,
            inquiry_id: inquiry_id,
          })
				} else {
					return sendInitialMessage({
            tenant_id: this.props.tenant_profile.tenant_id,
            first_name: this.props.tenant_profile.first_name,
            last_name: this.props.tenant_profile.last_name,
            email: this.state.emailRequired ? this.state.email : this.props.tenant_profile.email,
            phone: this.state.phoneRequired ? this.state.phone : this.props.tenant_profile.phone,
            group_size: this.state.group_size,
            building_id: building.building_id,
            building_address: building.building_address,
            building_alias: building.building_alias,
            group_notes: body,
          })
				}
			})
			.then((data) => {
				this.setState({
					saving: false,
					submitted: true,
				})
			})
			.catch((err) => {
				_LTracker.push({
					'error': err,
					'tag' : `${localStorage.getItem('tenant_id')}`
				})
				this.setState({
					error_messages: ['An error as occurred, please Send us a Message'],
					saving: false,
				})
			})
		}
	}


	render() {
		return (
			<div id='TourPopup' style={comStyles().container}>
				<div style={comStyles().imageGallery} >
					<SingularImageGallery
						list_of_images={[this.props.tour.building.cover_photo].concat(this.props.tour.building.imgs)}
						image_size='hd'
					/>
				</div>
				<div style={comStyles().infoContainer} >
					<div>
						<h1>{ this.props.tour.building.building_alias }</h1>
						<h3 style={{ color: '#33A3F4', fontWeight: 'bold', padding: '3px' }}>Tour {moment(this.props.tour.tour.selected_date).fromNow()}</h3>
						<h3 style={{ padding: '3px' }}>{`${moment(this.props.tour.tour.selected_date).format('MMMM Do YYYY, h:mm a')}`}</h3>

						{
							this.props.tour.tour.notes && this.props.tour.tour.notes.length > 0
							?
							<div>
								<div style={{ fontWeight: 'bold' }}>Notes</div>
								<div>{ this.props.tour.tour.notes }</div>
							</div>
							:
							null
						}
					</div>
					<div>
						{
							this.props.type === 'tours'
							?
							<Button
								primary
								basic
								content='More Property Details'
								onClick={() => this.selectThisBuilding(this.props.tour.building)}
							/>
							:
							null
						}
					</div>
				</div>
				<br />
				<Form>
					<Header as='h2' content='Join This Tour' />
					<Form.Group widths='equal'>
            <Form.Field>
              <label>Phone Number</label>
              <Input
                value={this.state.phone}
                onChange={e => this.updateAttr(e, 'phone')}
                disabled={!this.state.phoneRequired}
              />
            </Form.Field>
            <Form.Field>
              <label>Email Address</label>
              <Input
                value={this.state.email}
                onChange={e => this.updateAttr(e, 'email')}
                disabled={!this.state.phoneRequired}
              />
            </Form.Field>
          </Form.Group>
					<Form.Field>
            <label>Group Size</label>
            <Dropdown
              id='Group Size'
              placeholder='Select your Group Size'
              value={this.state.group_size}
              selection
              options={this.group_size_options}
              onChange={(e, d) => { this.updateGroupSize(e, d, 'group_size') }}
            />
          </Form.Field>
          <Form.Field>
            <label>Message</label>
            <TextArea
              rows={3}
              value={this.state.group_notes}
              placeholder='Ask some more questions about the tour'
              onChange={e => this.setState({ group_notes: e.target.value })}
              style={comStyles().textArea}
            />
          </Form.Field>
					<Form.Field>
						{
							this.state.error_messages.map((err, index) => {
								return (
									<Message
										visible
										key={index}
										error
										content={err}
									/>
								)
							})
						}
					</Form.Field>
					<Form.Field>
						{
							this.state.submitted
							?
							<Message positive>
								<Header>
									<Icon name='checkmark' color='green' />
									<Header.Content>Tour Request Sent to Landlord</Header.Content>
									<Header.Subheader>You can now chat with the landlord about the tour</Header.Subheader>
								</Header>
							</Message>
							:
							<Button
								fluid
								color='orange'
								loading={this.state.saving}
								disabled={this.state.saving}
								content='Join Tour'
								onClick={() => this.saveTour(this.props.tour.tour, this.props.tour.building)}
							/>
						}
					</Form.Field>
				</Form>
			</div>
		)
	}
}

// defines the types of variables in this.props
TourPopup.propTypes = {
	history: PropTypes.object.isRequired,
	collectIntel: PropTypes.func.isRequired,
  fingerprint: PropTypes.string.isRequired,
  tenant_profile: PropTypes.object.isRequired,
	tour: PropTypes.object.isRequired,			// passed in
	type: PropTypes.string.isRequired,			// passed in
}

// for all optional props, define a default value
TourPopup.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(TourPopup)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
		tenant_profile: redux.auth.tenant_profile,
		fingerprint: redux.auth.browser_fingerprint,
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
		collectIntel,
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
		imageGallery: {
			maxHeight: '450px',
			maxWidth: 'auto',
		},
		infoContainer: {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
		}
	}
}
