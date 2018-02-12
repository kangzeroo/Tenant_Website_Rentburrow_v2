// Compt for copying as a RedeemGift
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import uuid from 'uuid'
import { withRouter } from 'react-router-dom'
import {
	Header,
	Icon,
	Form,
	Input,
	Message,
	Button,
	Dropdown,
} from 'semantic-ui-react'


class RedeemGift extends Component {

	constructor() {
		super()
		this.autocomplete = null
		this.state = {
			tenant_id: '',
			leader_name: '',
			leader_phone: '',
			group_size: 1,
			address: '',
			place_id: '',
			unit: '',
			roommates: [],
			roommate_form: {
				full_name: '',
				legal_name: '',
			},
			error_messages: [],
			show_roommates: false,
			show_suite: false,
			show_submit_button: false,
		}
    this.group_size_options = [
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
		this.fillInName()
	}

	componentDidMount() {
		this.establishGoogleAddressAutoComplete()
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.tenant_profile !== prevProps.tenant_profile) {
			this.fillInName()
		}
	}

	establishGoogleAddressAutoComplete() {
		// google address autocomplete
    // restricted to only show addresses and in canada
    this.autocomplete = new google.maps.places.Autocomplete(
            /** @type {!HTMLInputElement} */(document.getElementById('address')),
            {
              types: ['address'],
              componentRestrictions: { country: 'ca' },
              // bounds: new google.maps.LatLngBounds(
              //   new google.maps.LatLng(-80.671519, 43.522913),
              //   new google.maps.LatLng(-80.344067, 43.436979)
              // )
            }
          );
    // When the user selects an address from the dropdown, populate the address
    // fields in the form.
    this.autocomplete.addListener('place_changed', this.fillInAddress.bind(this));
	}

  // fill in address from google autocomplete dropdown
  fillInAddress() {
		const place = this.autocomplete.getPlace()
		this.setState({
      address: place.formatted_address,
			place_id: place.place_id,
			show_roommates: true,
			roommate_form: {
				full_name: this.state.leader_name,
				legal_name: '',
			}
		})
	}

	fillInName() {
		if (this.props.tenant_profile && !this.props.tenant_profile.unauthRoleStudent && this.props.tenant_profile.first_name && this.props.tenant_profile.last_name) {
			this.setState({
				tenant_id: this.props.tenant_profile.tenant_id,
				leader_name: `${this.props.tenant_profile.first_name} ${this.props.tenant_profile.last_name}`,
				leader_phone: this.props.tenant_profile.phone,
			})
		}
	}

	updateAttr(e, attr) {
		this.setState({
			[attr]: e.target.value,
		})
	}

	addAnotherRoommate() {
		if (this.state.roommate_form.full_name) {
			this.setState({
				roommates: this.state.roommates.concat([
					{
						id: uuid.v4(),
						full_name: this.state.roommate_form.full_name,
						legal_name: this.state.roommate_form.legal_name,
					}
				]),
				roommate_form: {
					full_name: '',
					legal_name: '',
				}
			})
		}
	}

	deleteRoommate(id) {
		this.setState({
			roommates: this.state.roommates.filter((rm) => {
				return rm.id !== id
			})
		})
	}

	updateRoommateForm(e, attr) {
		this.setState({
			roommate_form: {
				...this.state.roommate_form,
				[attr]: e.target.value,
			}
		})
	}

	nextStep() {
		this.setState({
			show_suite: true,
			show_submit_button: true,
		})
	}

	redeemGift() {
		if (this.validateForm()) {
			console.log('redeemGift')
		}
	}

	validateForm() {
		const error_messages = []
		if (!this.state.leader_name) {
			error_messages.push('You must provide the name of the group leader')
		}
		if (!this.state.leader_phone) {
			error_messages.push('You must provide a contact number to reach you at')
		}
		if (!this.state.address) {
			error_messages.push('You must enter an address')
		}
		if (!this.state.group_size) {
			error_messages.push('You must specify your group size')
		}
		this.setState({
			error_messages
		})
		return error_messages.length === 0
	}

	render() {
		return (
			<div id='RedeemGift' className='pretty_scrollbar' style={comStyles().container}>
				<Header as='h2' icon style={{ margin: '20px auto' }}>
					<Icon name='gift' />
					Redeem Your House Warming Gift
					<Header.Subheader>
						Every roommate gets one after completing their lease.<br/>
						Eligible on select properties or units.
					</Header.Subheader>
				</Header>
				<br />
				<Form style={{ width: '80%' }}>
					<Form.Field style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
						<div style={{ width: '35%', display: 'flex', flexDirection: 'column' }}>
							<label>Group Leader Name (Your Name)</label>
							<Input id='leader_name' value={this.state.leader_name} onChange={(e) => this.updateAttr(e, 'leader_name')} style={{ width: '100%' }} />
						</div>
						<div style={{ width: '35%', display: 'flex', flexDirection: 'column' }}>
							<label>Contact Phone #</label>
							<Input id='leader_phone' type='number' value={this.state.leader_phone} onChange={(e) => this.updateAttr(e, 'leader_phone')} style={{ width: '100%' }} />
						</div>
						<div style={{ width: '25%', display: 'flex', flexDirection: 'column' }}>
              <label>Group Size</label>
              <Dropdown
                id='group_size'
                placeholder='Select your Group Size'
                value={this.state.group_size}
                selection
                options={this.group_size_options}
                onChange={(e, d) => { this.updateAttr({ target: { value: d.value } }, 'group_size') }}
              />
            </div>
					</Form.Field>
					<Form.Field style={{ width: '100%' }}>
						<label>Address</label>
						<Input id='address' value={this.state.address} onChange={(e) => this.updateAttr(e, 'address')} style={{ width: '100%' }} />
					</Form.Field>
					{
						this.state.show_roommates
						?
						<div>
							<Form.Field style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
								<label>Name of Roommates</label>
								{
									this.state.roommates.map((rm) => {
										return (
											<div key={rm.id} style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
												<div style={{ width: '45%' }}>{rm.full_name}</div> &nbsp;
												<div style={{ width: '45%' }}>Legal Name: {rm.legal_name}</div> &nbsp; &nbsp;
												<div style={{ width: '5%' }}><Icon onClick={() => this.deleteRoommate(rm.id)} name='delete' size='big' /></div>
											</div>
										)
									})
								}
							</Form.Field>
							<Form.Field style={{ width: '100%' }}>
								<div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
									<Input id='full_name' value={this.state.roommate_form.full_name} placeholder='Full Name' onChange={(e) => this.updateRoommateForm(e, 'full_name')} style={{ width: '45%' }} /> &nbsp;
									<Input id='legal_name' value={this.state.roommate_form.legal_name} placeholder='Legal Name (if applicable)' onChange={(e) => this.updateRoommateForm(e, 'legal_name')} style={{ width: '45%' }} /> &nbsp; &nbsp;
									<div style={{ width: '5%' }}><Icon onClick={() => this.addAnotherRoommate()} name='checkmark' size='big' /></div>
								</div>
							</Form.Field>
							<Form.Field style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
								<Button onClick={() => this.nextStep()}>Done Adding</Button>
							</Form.Field>
						</div>
						:
						null
					}
					<br /><br />
					{
						this.state.show_suite
						?
						<Form.Field style={{ width: '100%' }}>
							<label>Unit #</label>
							<Input value={this.state.unit} onChange={(e) => this.updateAttr(e, 'unit')} style={{ width: '100%' }} />
						</Form.Field>
						:
						null
					}
					{
						this.state.error_messages.length > 0
						?
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
						:
						null
					}
					{
						this.state.show_submit_button
						?
						<Form.Field style={{ width: '100%' }}>
							<Button primary onClick={() => this.redeemGift()} style={{ width: '100%' }}>Redeem Gift</Button>
						</Form.Field>
						:
						null
					}
				</Form>
			</div>
		)
	}
}

// defines the types of variables in this.props
RedeemGift.propTypes = {
	history: PropTypes.object.isRequired,
	tenant_profile: PropTypes.object.isRequired,
}

// for all optional props, define a default value
RedeemGift.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(RedeemGift)

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
			minHeight: '100vh',
			maxHeight: '100vh',
			overflowY: 'scroll',
			width: '100%',
			justifyContent: 'flex-start',
			alignItems: 'center',
			padding: '20px',
		}
	}
}
