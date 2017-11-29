// Compt for copying as a LandlordTourConfirmation
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import moment from 'moment'
import { withRouter } from 'react-router-dom'
import {
  Header,
  Image,
  Form,
  Button,
  Modal,
  Input,
  Message,
  Dropdown,
  Checkbox,
  Segment,
  Card,
  Dimmer,
  Loader,
} from 'semantic-ui-react'
import {
  getTourById, insertTourDetails, getTourDetailsById, sendTourConfirmationEmailToTenant,
} from '../../../api/tour/tour_api'
import {
  getBuildingById,
} from '../../../api/search/search_api'
import {
  renderProcessedThumbnail,
} from '../../../api/general/general_api'

class LandlordTourConfirmation extends Component {

  constructor() {
    super()
    this.state = {
      tour: {},

      building: {},
      invalid: false,

      toggle_modal: false,
      modal_name: '',
      context: {},

      selected_slot: {},

      meet_at_property: true,
      meet_at_location: false,

      meetup_address: '',
      notes: '',

      saving: false,
      submitted: false,

      error_messages: [],
      loading: true,

      time_options: [
        { key: '1000', text: '10:00 AM', value: '1000' },
        { key: '1015', text: '10:15 AM', value: '1015' },
        { key: '1030', text: '10:30 AM', value: '1030' },
        { key: '1045', text: '10:45 AM', value: '1045' },
        { key: '1100', text: '11:00 AM', value: '1100' },
        { key: '1115', text: '11:15 AM', value: '1115' },
        { key: '1130', text: '11:30 AM', value: '1130' },
        { key: '1145', text: '11:45 AM', value: '1145' },
        { key: '1200', text: '12:00 PM', value: '1200' },
        { key: '1215', text: '12:15 PM', value: '1215' },
        { key: '1230', text: '12:30 PM', value: '1230' },
        { key: '1245', text: '12:45 PM', value: '1245' },
        { key: '1300', text: '1:00 PM', value: '1300' },
        { key: '1315', text: '1:15 PM', value: '1315' },
        { key: '1330', text: '1:30 PM', value: '1330' },
        { key: '1345', text: '1:45 PM', value: '1345' },
        { key: '1400', text: '2:00 PM', value: '1400' },
        { key: '1415', text: '2:15 PM', value: '1415' },
        { key: '1430', text: '2:30 PM', value: '1430' },
        { key: '1445', text: '2:45 PM', value: '1445' },
        { key: '1500', text: '3:00 PM', value: '1500' },
        { key: '1515', text: '3:15 PM', value: '1515' },
        { key: '1530', text: '3:30 PM', value: '1530' },
        { key: '1545', text: '3:45 PM', value: '1545' },
        { key: '1600', text: '4:00 PM', value: '1600' },
        { key: '1615', text: '4:15 PM', value: '1615' },
        { key: '1630', text: '4:30 PM', value: '1630' },
        { key: '1645', text: '4:45 PM', value: '1645' },
        { key: '1700', text: '5:00 PM', value: '1700' },
        { key: '1715', text: '5:15 PM', value: '1715' },
        { key: '1730', text: '5:30 PM', value: '1730' },
        { key: '1745', text: '5:45 PM', value: '1745' },
        { key: '1800', text: '6:00 PM', value: '1800' },
        { key: '1815', text: '6:15 PM', value: '1815' },
        { key: '1830', text: '6:30 PM', value: '1830' }
      ]
    }
  }

  componentWillMount() {
    const pathname = this.props.location.pathname
    let tour_id = pathname.slice(pathname.indexOf('/landlord-confirm-tour/') + '/landlord-confirm-tour/'.length)
    if (tour_id[tour_id.length - 1] === '/') {
      tour_id = tour_id.slice(0, -1)
		}

    this.setState({
      loading: true,
    })

    getTourDetailsById(tour_id)
    .then((data) => {
      if (data && data.tour_date) {
        this.setState({
          invalid: true,
          loading: false,
        })
      } else {
        getTourById(tour_id)
        .then((data) => {
          if (data) {
            this.setState({
              tour: data,
              loading: false,
            }, () => this.getBuilding(data.building_id))
          } else {
            this.setState({
              invalid: true,
              loading: false,
            })
          }
        })
      }
    })
  }

  initiateGoogleAddress() {
    // google address autocomplete
    setTimeout(() => {
      this.autocomplete = new google.maps.places.Autocomplete(
              /** @type {!HTMLInputElement} */(document.getElementById('meetup_address')),
              { types: ['geocode'] });
      // When the user selects an address from the dropdown, populate the address
      // fields in the form.
      this.autocomplete.addListener('place_changed', this.fillInAddress.bind(this));
    }, 100)
  }

  getBuilding(building_id) {
    getBuildingById(building_id)
    .then((data) => {
      this.setState({
        building: data,
      })
    })
  }

  // fill in address from google autocomplete dropdown
  fillInAddress() {
    const place = this.autocomplete.getPlace()

    this.setState({
      meetup_address: place.formatted_address,
    })
  }

  updateAttr(event, attr) {
    this.setState({
      [attr]: event.target.value
    })
  }

  updateTime(event, data, attr) {
    this.setState({
      selected_slot: {
        ...this.state.selected_slot,
        [attr]: data.value,
      }
    })
  }

  confirmTimeSelection() {
    this.setState({
      saving: true,
    })
    let meetup_address
    if (this.state.meet_at_property) {
      meetup_address = this.state.building.building_address
    } else {
      meetup_address = this.state.meetup_address
    }

    if (this.validationCheck()) {
      insertTourDetails({
        tour_id: this.state.tour.tour_id,
        date: this.state.selected_slot.date,
        time_begin: this.state.selected_slot.time_begin,
        time_end: this.state.selected_slot.time_end,
        notes: this.state.selected_slot.notes,
        meetup_address: meetup_address,
      })
      .then((data) => {
        const tourObj = {
          meetup_address: meetup_address,
          date: this.state.selected_slot.date,
          time_begin: this.state.selected_slot.time_begin,
          time_end: this.state.selected_slot.time_end,
          notes: this.state.notes,
        }
        const mailObj = { email: this.state.tour.email, }

        return sendTourConfirmationEmailToTenant(tourObj, mailObj, this.state.building)
      })
      .then((data) => {
        this.setState({
          saving: false,
          submitted: true,
          submitted_at: moment().format('MMMM Do YYYY, h:mm a'),
        }, () => this.toggleModal(false))
      })
    } else {
      this.setState({
        saving: false,
      })
    }
  }

  buttonOne() {
    this.setState({
      selected_slot: {
        date: this.state.tour.date_1,
        time_begin: this.state.tour.time_1_begin,
        time_end: this.state.tour.time_1_end,
      }
    }, () => this.toggleModal(true, 'confirm_time', this.state.selected_slot))
  }

  buttonTwo() {
    this.setState({
      selected_slot: {
        date: this.state.tour.date_2,
        time_begin: this.state.tour.time_2_begin,
        time_end: this.state.tour.time_2_end,
      }
    }, () => this.toggleModal(true, 'confirm_time', this.state.selected_slot))
  }

  buttonThree() {
    this.setState({
      selected_slot: {
        date: this.state.tour.date_3,
        time_begin: this.state.tour.time_3_begin,
        time_end: this.state.tour.time_3_end,
      }
    }, () => this.toggleModal(true, 'confirm_time', this.state.selected_slot))
  }

  validationCheck() {
    const error_messages = []
    if (this.state.meet_at_location && (this.state.meetup_address.length === 0)) {
      error_messages.push('You must enter the address of the other location')
    }
    this.setState({
      error_messages: error_messages
    })
    if (error_messages.length > 0) {
      return false
    } else {
      return true
    }
  }

  toggleModal(bool, attr, context) {
    this.setState({
      toggle_modal: bool,
      modal_name: attr,
      context,
    })
  }

  anotherLocationCheck() {
    this.setState({
      meet_at_location: !this.state.meet_at_location,
      meet_at_property: !this.state.meet_at_property,
    }, () => this.initiateGoogleAddress())
  }

  renderAppropriateModal(modal_name, context) {
    if (modal_name === 'confirm_time') {
      return (
        <Modal
          dimmer
          open={this.state.toggle_modal}
          onClose={() => this.toggleModal(false)}
          closeIcon
          size='small'
        >
          <Modal.Header>
            <Header
              as='h3'
              icon='add to calendar'
              content='Timeslot Confirmation'
            />
          </Modal.Header>
          <Modal.Content>
            <p>{`Confirming Tour for ${moment(context.date).format('MMMM Do YYYY')} from`}</p>
            <Form>
              <Form.Group widths='equal'>
                <Form.Field>
                  <label>Begin Time</label>
                  <Dropdown
                    id='time_2_begin'
                    placeholder='Time Begin'
                    selection
                    compact
                    options={this.state.time_options}
                    value={this.state.selected_slot.time_begin}
                    onChange={(e, d) => { this.updateTime(e, d, 'time_begin') }}
                  />
                </Form.Field>
                <Form.Field>
                  <label>End Time</label>
                  <Dropdown
                    id='time_2_begin'
                    placeholder='Time End'
                    selection
                    compact
                    options={this.state.time_options}
                    value={this.state.selected_slot.time_end}
                    onChange={(e, d) => { this.updateTime(e, d, 'time_end') }}
                  />
                </Form.Field>
              </Form.Group>
            </Form>
            <div style={comStyles().meetContainer}>
              <label>Where should {this.state.tour.first_name} meet you?</label>
              <Checkbox
                label={`Meet at ${this.state.building.building_address}`}
                checked={this.state.meet_at_property}
                onClick={() => this.setState({ meet_at_property: !this.state.meet_at_property, meet_at_location: !this.state.meet_at_location })}
              />
              <div>
                <Checkbox
                  label={`Meet at Another Location`}
                  checked={this.state.meet_at_location}
                  onClick={() => this.anotherLocationCheck()}
                />
                {
                  this.state.meet_at_location
                  ?
                  <Input
                    id='meetup_address'
                    value={this.state.meetup_address}
                    onChange={(e) => { this.updateAttr(e, 'meetup_address') }}
                    type='text'
                    placeholder='Office Address'
                    style={comStyles().textArea}
                  />
                  :
                  null
                }
              </div>
              <br />
              <Form.Field>
                <label>Any instructions for the student?</label>
                <Form.TextArea placeholder='Call me at (xxx)-xxx-xxxx when you arrive' onChange={(e) => { this.updateAttr(e, 'notes') }} style={comStyles().textArea}/>
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
            </div>
          </Modal.Content>
          <Modal.Actions>
            <Button
              color='red'
              content='Cancel'
              onClick={() => this.toggleModal(false)}
            />
            <Button
              positive
              loading={this.state.saving}
              icon='checkmark'
              labelPosition='right'
              content='Confirm'
              onClick={() => this.confirmTimeSelection()}
            />
          </Modal.Actions>
        </Modal>
      )
    }
  }

  renderTour() {
    return (
      <div style={comStyles().tourContainer} >
        <div style={comStyles().headerContainer} >
          <Header
            as='h2'
            icon='calendar'
            content={`Schedule and Confirm Tour for ${this.state.building.building_alias}`}
            subheader='The student has selected three available time slots'
          />
        </div>
        <div style={comStyles().infoImageContainer} >
          <Image
            src={renderProcessedThumbnail(this.state.building.thumbnail)}
            size='medium'
            style={comStyles().image}
          />
          <Form style={comStyles().infoContainer} >
            <Form.Field>
              <label>Building Address</label>
              <div>{ this.state.building.building_address }</div>
            </Form.Field>
            <Form.Group widths='equal'>
              <Form.Field>
                <label>Name</label>
                <div>{ [this.state.tour.first_name, this.state.tour.last_name].join(' ')} </div>
              </Form.Field>
              <Form.Field>
                <label>School</label>
                <div>{ this.state.tour.school } </div>
              </Form.Field>
              <Form.Field>
                <label>Group Size</label>
                <div>{ this.state.tour.group_size } </div>
              </Form.Field>
            </Form.Group>
            <Form.Field>
              <label>Notes</label>
              <div>{ this.state.tour.group_notes }</div>
            </Form.Field>
          </Form>
        </div>
        <Card raised fluid>
        <Form style={comStyles().scheduleContainer} >
          <Form.Group widths='equal'>
            <Form.Field>
              <label>Requested Tour Date 1</label>
              <div>{moment(this.state.tour.date_1).format('MMMM Do YYYY')}</div>
            </Form.Field>
            <Form.Field>
              <label>Requested Begin Time</label>
              <div>{moment(this.state.tour.time_1_begin, 'HHmm').format('h:mm a')}</div>
            </Form.Field>
            <Form.Field>
              <label>Requested End Time</label>
              <div>{moment(this.state.tour.time_1_end, 'HHmm').format('h:mm a')}</div>
            </Form.Field>
            <Form.Field>
              <Button
                primary
                content='Select This Slot'
                onClick={() => this.buttonOne()}
              />
            </Form.Field>
          </Form.Group>
          <Form.Group widths='equal'>
            <Form.Field>
              <label>Requested Tour Date 2</label>
              <div>{moment(this.state.tour.date_2).format('MMMM Do YYYY')}</div>
            </Form.Field>
            <Form.Field>
              <label>Requested Begin Time</label>
              <div>{moment(this.state.tour.time_2_begin, 'HHmm').format('h:mm a')}</div>
            </Form.Field>
            <Form.Field>
              <label>Requested End Time</label>
              <div>{moment(this.state.tour.time_2_end, 'HHmm').format('h:mm a')}</div>
            </Form.Field>
            <Form.Field>
              <Button
                primary
                content='Select This Slot'
                onClick={() => this.buttonTwo()}
              />
            </Form.Field>
          </Form.Group>
          <Form.Group widths='equal'>
            <Form.Field>
              <label>Requested Tour Date 3</label>
              <div>{moment(this.state.tour.date_3).format('MMMM Do YYYY')}</div>
            </Form.Field>
            <Form.Field>
              <label>Requested Begin Time</label>
              <div>{moment(this.state.tour.time_3_begin, 'HHmm').format('h:mm a')}</div>
            </Form.Field>
            <Form.Field>
              <label>Requested End Time</label>
              <div>{moment(this.state.tour.time_3_end, 'HHmm').format('h:mm a')}</div>
            </Form.Field>
            <Form.Field>
              <Button
                primary
                content='Select This Slot'
                onClick={() => this.buttonThree()}
              />
            </Form.Field>
          </Form.Group>
        </Form>
        </Card>
      </div>
    )
  }

  renderSubmittedTour() {
    return (
      <div style={comStyles().canvasContainer}>
        <Message positive>
          <Header
            as='h1'
            icon='checked calendar'
            content={`Success! Your Tour has been Book and Confirmed`}
            subheader={`Confirmed at ${this.state.submitted_at}, Expect a confirmation Email soon`}
          />
        </Message>
      </div>
    )
  }

  goToInvalidPage() {
    this.props.history.push('/invalid')
  }

	render() {
		return (
			<div id='LandlordTourConfirmation' style={comStyles().container}>
        {
          this.state.loading
          ?
          <div style={comStyles().canvasContainer} >
            <Segment>
              <Dimmer active inverted>
                <Loader>Loading</Loader>
              </Dimmer>
            </Segment>
          </div>
          :
          <div>
            {
              this.state.invalid
              ?
              this.goToInvalidPage()
              :
              <div>
                {
                  this.state.submitted
                  ?
                  this.renderSubmittedTour()
                  :
                  this.renderTour()
                }
              </div>
            }
          </div>
        }
        {
          this.renderAppropriateModal(this.state.modal_name, this.state.context)
        }
			</div>
		)
	}
}

// defines the types of variables in this.props
LandlordTourConfirmation.propTypes = {
	history: PropTypes.object.isRequired,
}

// for all optional props, define a default value
LandlordTourConfirmation.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(LandlordTourConfirmation)

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
      margin: '20px',
      minHeight: '80vh',
		},
    tourContainer: {
      display: 'flex',
      flexDirection: 'column',
      margin: '20px'
    },
    infoImageContainer: {
      display: 'flex',
      flexDirection: 'row',
      margin: '20px'
    },
    infoContainer: {
      display: 'flex',
      flexDirection: 'column',
      margin: '20px',
      width: '60%',
    },
    scheduleContainer: {
      margin: '20px'
    },
    meetContainer: {
      display: 'flex',
      flexDirection: 'column',
      margin: '20px',
      justifyContent: 'space-around',
      minHeight: '170px',
      maxHeight: 'auto'
    },
    textArea: {
      width: '100%',
      margin: '5px'
    },
    image: {
      background: "transparent url('https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif') center no-repeat",
    },
    canvasContainer: {
      minHeight: '80vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }
	}
}
