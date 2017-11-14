// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import uuid from 'uuid'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import moment from 'moment'
import { withRouter } from 'react-router-dom'
import {
  Form,
  Input,
	Button,
	Message,
	Radio,
	Card,
	TextArea,
	Icon,
  Checkbox,
} from 'semantic-ui-react'
import DatePicker from 'react-datepicker'
import TimePicker from 'rc-time-picker'
import 'react-datepicker/dist/react-datepicker.css'
import 'rc-time-picker/assets/index.css'
import { validateEmail, shortenAddress } from '../../../../api/general/general_api'
import { bookPhotoShoot } from '../../../../api/messaging/book_photoshoot_email'


class BookPhotoshootForm extends Component {

	constructor() {
    super()
    this.state = {
      filming_form: {
        landlord_name: '',
        landlord_phone: '',
        landlord_email: '',
        building_address: '',
  			building_lat: 0,
        building_long: 0,
  			building_place_id: '',
        building_notes: '',
        filming_date: moment(),
        filming_time: moment().hour(0).minute(0),
        plan_a_filming_date_later: false,
      },
      buildings: [],
			error_messages: [],
			submitted: false,
      success_message: '',
    }
		this.autocomplete = null
  }

  componentDidMount() {
    // google address autocomplete
    // restricted to only show addresses and in canada
    this.autocomplete = new google.maps.places.Autocomplete(
            /** @type {!HTMLInputElement} */(document.getElementById('building_address')),
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
      filming_form: {
        ...this.state.filming_form,
        building_address: place.formatted_address,
  			building_lat: place.geometry.location.lat().toFixed(7),
        building_long: place.geometry.location.lng().toFixed(7),
  			building_place_id: place.place_id,
      }
		})
	}

	updateApplicationAttr(e, attr) {
    this.setState({
      filming_form: {
        ...this.state.filming_form,
        [attr]: e.target.value,
      }
    })
  }

  updateApplicationDate(date) {
    this.setState({
      filming_form: {
        ...this.state.filming_form,
        filming_date: date,
      }
		})
  }

  updateApplicationTime(value) {
    this.setState({
      filming_form: {
        ...this.state.filming_form,
        filming_time: value,
      }
		})
  }

	addBuildingToList() {
		if (this.validateForm()) {
			this.setState({
				buildings: this.state.buildings.concat([{
					...this.state.filming_form,
					id: uuid.v4(),
				}]),
				filming_form: {
          ...this.state.filming_form,
          building_address: '',
    			building_lat: 0,
          building_long: 0,
    			building_place_id: '',
          filming_date: moment(),
          filming_time: moment().hour(0).minute(0),
          plan_a_filming_date_later: false,
				},
				error_messages: [],
			})
		}
	}

	removeBuildingFromList(id) {
		this.setState({
			buildings: this.state.buildings.filter((b) => {
				return b.id !== id
			})
		})
	}

	submitApplication() {
		this.setState({
			submitted: true,
      error_messages: [],
		})
    bookPhotoShoot(this.state.buildings).then((data) => {
      this.setState({
				success_message: 'Done! Successfully sent message!'
			})
    })
	}

	validateForm() {
		let ok_to_proceed = true
		const error_messages = []
    if (this.state.filming_form.landlord_name.length === 0) {
			error_messages.push('You must enter a name')
			ok_to_proceed = false
		}
    if (this.state.filming_form.building_address.length === 0 || this.state.filming_form.building_place_id.length === 0) {
			error_messages.push('You must enter an address')
			ok_to_proceed = false
		}
		if (this.state.filming_form.building_notes.length === 0) {
			error_messages.push('You must enter some notes for this building. Tell us about it.')
			ok_to_proceed = false
		}
		if (this.state.filming_form.landlord_phone.length === 0) {
			error_messages.push('You must enter a phone number')
			ok_to_proceed = false
		}
		if (this.state.filming_form.landlord_email.length === 0 || !validateEmail(this.state.filming_form.landlord_email)) {
			error_messages.push('The email entered is not valid')
			ok_to_proceed = false
		}
		this.setState({
			error_messages: error_messages,
			submitted: false,
		})
		return ok_to_proceed
	}

	render() {
		return (
			<div style={comStyles().container}>
				<div style={comStyles().title}>
					Book A Photoshoot
				</div>
				<div style={comStyles().body}>
					<Form style={comStyles().form}>
		        <Form.Field>
		          <label>Landlord Name</label>
		          <Input
		            value={this.state.filming_form.landlord_name}
		            onChange={(e) => this.updateApplicationAttr(e, 'landlord_name')}
		          />
		        </Form.Field>
		        <Form.Field>
		          <label>Phone</label>
		          <Input
		            value={this.state.filming_form.landlord_phone}
		            onChange={(e) => this.updateApplicationAttr(e, 'landlord_phone')}
		          />
		        </Form.Field>
		        <Form.Field>
		          <label>Email</label>
		          <Input
		            value={this.state.filming_form.landlord_email}
		            onChange={(e) => this.updateApplicationAttr(e, 'landlord_email')}
		          />
		        </Form.Field>
		        <Form.Field>
		          <label>Building Address For Photoshoot</label>
		          <Input
                id='building_address'
		            value={this.state.filming_form.building_address}
		            onChange={(e) => this.updateApplicationAttr(e, 'building_address')}
		          />
		        </Form.Field>
						<Form.Field>
              <div style={comStyles().filming_date}>
  		          <label>Photoshoot Date</label> &nbsp; &nbsp;
                <div style={comStyles().filming_date_row}>
                  <DatePicker
                    selected={this.state.filming_form.filming_date}
                    onChange={(d) => this.updateApplicationDate(d)}
                  />
                  &nbsp; &nbsp;
                  <TimePicker
                    showSecond={false}
                    defaultValue={this.state.filming_form.filming_time}
                    onChange={(v) => this.updateApplicationTime(v)}
                    format='h:mm a'
                    use12Hours
                  />
                  &nbsp; &nbsp; &nbsp; &nbsp;
    		          <Checkbox
                    checked={this.state.filming_form.plan_a_filming_date_later}
                    onChange={(e, d) => this.updateApplicationAttr({ target: { value: d.checked } }, 'plan_a_filming_date_later')}
                    label='Plan a filming date later'
                  />
                </div>
              </div>
		        </Form.Field>
		        <Form.Field>
		          <label>Notes</label>
              <TextArea
                rows={4}
                value={this.state.filming_form.building_notes}
                placeholder='Eg. Anything we should know about this building? Your time availability?'
                onChange={(e) => this.updateApplicationAttr(e, 'building_notes')}
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
		          <Button
								fluid
								color='blue'
								content={this.state.buildings.length > 0 ? 'Add To List' : 'Save'}
								onClick={() => this.addBuildingToList()}
							/>
		        </Form.Field>
		      </Form>
          {
            this.state.buildings.length > 0
            ?
  					<div style={comStyles().summary}>
  						<Card raised fluid>
  							<Card.Header style={comStyles().card_header}>
  								Buildings To Film
  							</Card.Header>
  							<div style={comStyles().member_list}>
  								{
  									this.state.buildings.map((building) => {
  										return (
  											<div key={building.id} style={comStyles().row_member}>
  												<div style={comStyles().row_member_name}>{ shortenAddress(building.building_address) }</div>
  												<div style={comStyles().row_member_time}>{ building.plan_a_filming_date_later ? 'Time To Be Determined' : `${building.filming_date.format('ddd MMM do')} at ${building.filming_time.format('h:mm a')}` }</div>
  												<div style={comStyles().row_member_button}>
  													<Icon name='cancel' onClick={() => this.removeBuildingFromList(building.id)} />
  												</div>
  											</div>
  										)
  									})
  								}
  							</div>
  						</Card>
  						{
  							this.state.submitted
  							?
  							<div style={comStyles().hidden_loading}>
                  {
                    this.state.success_message
                    ?
                    <div style={comStyles().success}>
                      SUCCESS! We have received your filming request and will get in contact with you soon. <br />
                      <Button primary fluid onClick={() => this.props.history.push('/contact')} content='Back' />
                    </div>
                    :
                    <img src='https://s3.amazonaws.com/rentburrow-static-assets/Loading+Icons/loading-blue-clock.gif' width='50px' height='auto' />
                  }
  							</div>
  							:
  							<Button
  								basic
  								fluid
  								color='blue'
  								onClick={() => this.submitApplication()}
  								content='Submit Application'
  							/>
  						}
  					</div>
            :
            null
          }
				</div>
			</div>
		)
	}
}

// defines the types of variables in this.props
BookPhotoshootForm.propTypes = {
	history: PropTypes.object.isRequired,
}

// for all optional props, define a default value
BookPhotoshootForm.defaultProps = {
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(BookPhotoshootForm)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
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
		title: {
      display: 'flex',
      flexDirection: 'column',
			fontSize: '2rem',
			fontWeight: 'bold',
			padding: '20px 20px 50px 20px',
			width: '100%',
			justifyContent: 'center',
			alignItems: 'center',
		},
		body: {
      display: 'flex',
      flexDirection: 'row',
		},
		form: {
      display: 'flex',
      flexDirection: 'column',
			flexGrow: 1,
		},
		summary: {
      display: 'flex',
      flexDirection: 'column',
			flexGrow: 1,
			padding: '15px',
		},
		row_member: {
			padding: '10px',
			width: '95%',
			display: 'flex',
			flexDirection: 'row',
			borderRadius: '5px',
			backgroundColor: 'rgba(0,0,0,0.1)',
      margin: '10px',
		},
		row_member_name: {
			width: '40%',
			padding: '0px 0px 0px 20px',
		},
		row_member_time: {
			width: '50%',
			padding: '0px 0px 0px 20px',
		},
		row_member_button: {
			width: '10%',
			cursor: 'pointer',
		},
		card_header: {
			padding: '10px',
			fontSize: '1.3rem',
			fontWeight: 'bold',
		},
		member_list: {
			minHeight: '100px',
		},
		hidden_loading: {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'center',
			alignItems: 'center',
			padding: '20px',
		},
    success: {
      width: '100%',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
			fontSize: '1rem',
			fontWeight: 'bold',
    },
    filming_date: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      justifyContent: 'flex-start',
    },
    filming_date_row: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
		textArea: {
			border: '1px solid gray',
			padding: '10px',
		},
	}
}
