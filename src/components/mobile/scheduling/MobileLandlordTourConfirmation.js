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
  Header,
  Image,
  Form,
  Button,
  Modal,
  Input,
  Message,
  Dropdown,
  Checkbox,
  Icon,
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

class MobileLandlordTourConfirmation extends Component {

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

      button_one_selected: false,
      button_two_selected: false,
      button_three_selected: false,

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
    }, () => this.setState({ button_one_selected: true, button_two_selected: false, button_three_selected: false, }))
  }

  buttonTwo() {
    this.setState({
      selected_slot: {
        date: this.state.tour.date_2,
        time_begin: this.state.tour.time_2_begin,
        time_end: this.state.tour.time_2_end,
      }
    }, () => this.setState({ button_one_selected: false, button_two_selected: true, button_three_selected: false, }))
  }

  buttonThree() {
    this.setState({
      selected_slot: {
        date: this.state.tour.date_3,
        time_begin: this.state.tour.time_3_begin,
        time_end: this.state.tour.time_3_end,
      }
    }, () => this.setState({ button_one_selected: false, button_two_selected: false, button_three_selected: true, }))
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
    if (modal_name === 'confirm_tour') {
      return (
        <div style={comStyles().container}>
        <Modal
          dimmer
          open={this.state.toggle_modal}
          onClose={() => this.toggleModal(false)}
          closeIcon
          size='small'
          style={comStyles().modalContainer}
        >
          <Modal.Content>
            <div style={comStyles().largeFontSize}>
              {`Confirming Tour for ${moment(this.state.selected_slot.date).format('MMMM Do YYYY')} from ${moment(this.state.selected_slot.time_begin, 'HHmm').format('HH:mm a')} to ${moment(this.state.selected_slot.time_end, 'HHmm').format('HH:mm a')}`}
            </div>
            <div style={comStyles().largeFontSize}>
              {`Meeting ${this.state.tour.first_name} at ${this.state.meet_at_property ? this.state.building.building_address : this.state.meetup_address}`}
            </div>
          </Modal.Content>
          <Modal.Actions>
            <Button
              color='red'
              content='Cancel'
              onClick={() => this.toggleModal(false)}
              size='massive'
            />
            <Button
              positive
              loading={this.state.saving}
              icon='checkmark'
              labelPosition='right'
              content='Confirm & Save'
              onClick={() => this.confirmTimeSelection()}
              size='massive'
            />
          </Modal.Actions>
        </Modal>
        </div>
      )
    }
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

  renderTourConfirmation() {
    return (
      <div style={comStyles().centerContainer} >
        <Header
          as='h1'
          icon='add to calendar'
          content={`Confirm Tour Date & Time for ${this.state.building.building_alias}`}
          textAlign='center'
        />
        <hr />
        <br />
        <div style={comStyles().confirmTourContainer}>
          <p>{`Confirming Tour for ${moment(this.state.selected_slot.date).format('MMMM Do YYYY')} from`}</p>
          <Form size='massive'>
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
            <Segment>
              <Checkbox
                label={`Meet at ${this.state.building.building_address}`}
                checked={this.state.meet_at_property}
                onClick={() => this.setState({ meet_at_property: !this.state.meet_at_property, meet_at_location: !this.state.meet_at_location })}
                style={comStyles().fontSize}
              />
            </Segment>
            <div>
              <Segment>
              <Checkbox
                label={`Meet at Another Location`}
                checked={this.state.meet_at_location}
                onClick={() => this.anotherLocationCheck()}
                style={comStyles().fontSize}
              />
              </Segment>
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
        </div>
        {
          this.renderAppropriateModal(this.state.modal_name, this.state.context)
        }
      </div>
    )
  }

  renderTourSelect() {
    return (
      <Form size='massive' style={comStyles().formContainer}>
        <Header as='h1' content='Requested Tour Dates & Time' textAlign='center' />
        <hr />
        <br />
        <Form.Group widths='equal'>
          <Form.Field>
            <label style={comStyles().textFont}>Tour Date 1</label>
            <div style={comStyles().textFont}>{moment(this.state.tour.date_1).format('MMMM Do YYYY')}</div>
          </Form.Field>
          <Form.Field>
            <label style={comStyles().textFont}>Requested Begin Time</label>
            <div style={comStyles().textFont}>{moment(this.state.tour.time_1_begin, 'HHmm').format('h:mm a')}</div>
          </Form.Field>
          <Form.Field>
            <label style={comStyles().textFont}>Requested End Time</label>
            <div style={comStyles().textFont}>{moment(this.state.tour.time_1_end, 'HHmm').format('h:mm a')}</div>
          </Form.Field>
        </Form.Group>
        <br />
        {
          this.state.button_one_selected
          ?
          this.renderTourConfirmation()
          :
          null
        }
        {
          this.state.button_one_selected
          ?
          <div style={comStyles().confirmButtonContainer}>
            <Button
              primary
              basic
              size='massive'
              content='Cancel'
              onClick={() => this.setState({ button_one_selected: false, selected_slot: {}, })}
            />
            <Button
              fluid
              color='green'
              size='massive'
              content='Confirm Slot 1'
              onClick={() => this.toggleModal(true, 'confirm_tour')}
            />
          </div>
          :
          <Button
            primary
            fluid
            content='Select Slot 1'
            onClick={() => this.buttonOne()}
            size='massive'
          />
        }
        <br />
        <hr />
        <br />
        <Form.Group widths='equal'>
          <Form.Field>
            <label style={comStyles().textFont}>Tour Date 2</label>
            <div style={comStyles().textFont}>{moment(this.state.tour.date_2).format('MMMM Do YYYY')}</div>
          </Form.Field>
          <Form.Field>
            <label style={comStyles().textFont}>Requested Begin Time</label>
            <div style={comStyles().textFont}>{moment(this.state.tour.time_2_begin, 'HHmm').format('h:mm a')}</div>
          </Form.Field>
          <Form.Field>
            <label style={comStyles().textFont}>Requested End Time</label>
            <div style={comStyles().textFont}>{moment(this.state.tour.time_2_end, 'HHmm').format('h:mm a')}</div>
          </Form.Field>
        </Form.Group>
        <br />
        {
          this.state.button_two_selected
          ?
          this.renderTourConfirmation()
          :
          null
        }
        {
          this.state.button_two_selected
          ?
          <div style={comStyles().confirmButtonContainer}>
            <Button
              primary
              basic
              size='massive'
              content='Cancel'
              onClick={() => this.setState({ button_two_selected: false, selected_slot: {}, })}
            />
            <Button
              fluid
              color='green'
              size='massive'
              content='Confirm Slot 2'
              onClick={() => this.toggleModal(true, 'confirm_tour')}
            />
          </div>
          :
          <Button
            primary
            fluid
            content='Select Slot 2'
            onClick={() => this.buttonTwo()}
            size='massive'
          />
        }
        <br />
        <hr />
        <br />
        <Form.Group widths='equal'>
          <Form.Field>
            <label style={comStyles().textFont}>Tour Date 3</label>
            <div style={comStyles().textFont}>{moment(this.state.tour.date_3).format('MMMM Do YYYY')}</div>
          </Form.Field>
          <Form.Field>
            <label style={comStyles().textFont}>Requested Begin Time</label>
            <div style={comStyles().textFont}>{moment(this.state.tour.time_3_begin, 'HHmm').format('h:mm a')}</div>
          </Form.Field>
          <Form.Field>
            <label style={comStyles().textFont}>Requested End Time</label>
            <div style={comStyles().textFont}>{moment(this.state.tour.time_3_end, 'HHmm').format('h:mm a')}</div>
          </Form.Field>
        </Form.Group>
        <br />
        {
          this.state.button_three_selected
          ?
          this.renderTourConfirmation()
          :
          null
        }
        {
          this.state.button_three_selected
          ?
          <div style={comStyles().confirmButtonContainer}>
            <Button
              primary
              basic
              size='massive'
              content='Cancel'
              onClick={() => this.setState({ button_three_selected: false, selected_slot: {}, })}
            />
            <Button
              fluid
              color='green'
              size='massive'
              content='Confirm Slot 3'
              onClick={() => this.toggleModal(true, 'confirm_tour')}
            />
          </div>
          :
          <Button
            primary
            fluid
            content='Select Slot 3'
            onClick={() => this.buttonThree()}
            size='massive'
          />
        }
        <br />
      </Form>
    )
  }

  renderTour() {
    return (
      <div >
        <Card fluid raised style={comStyles().headerContainer} >
          <Header as='h1' icon textAlign='center'>
            <Icon name='calendar' circular />
            <Header.Content>
              {`Schedule and Confirm Tour for ${this.state.building.building_alias}`}
            </Header.Content>
            <Header.Subheader style={comStyles().fontSize}>
              The student has selected three available time slots
            </Header.Subheader>
          </Header>
        </Card>
        <Card fluid raised style={comStyles().infoContainer} >
          <Form size='massive' style={comStyles().formContainer}>
            <Header as='h1' content='General Information' textAlign='center' />
            <hr />
            <br />
            <Form.Field>
              <label style={comStyles().textFont}>Requested Building</label>
              <div style={comStyles().textFont}>{ this.state.building.building_address }</div>
            </Form.Field>
            <Form.Group widths='equal' >
              <Form.Field>
                <label style={comStyles().textFont}>Name</label>
                <div style={comStyles().textFont}>{ [this.state.tour.first_name, this.state.tour.last_name].join(' ')} </div>
              </Form.Field>
              <Form.Field>
                <label style={comStyles().textFont}>School</label>
                <div style={comStyles().textFont}>{ this.state.tour.school } </div>
              </Form.Field>
              <Form.Field>
                <label style={comStyles().textFont}>Group Size</label>
                <div style={comStyles().textFont}>{ this.state.tour.group_size } </div>
              </Form.Field>
            </Form.Group>
            <Form.Field>
              <label style={comStyles().textFont}>Notes</label>
              <div>{ this.state.tour.group_notes }</div>
            </Form.Field>
          </Form>
        </Card>
        <Card fluid raised style={comStyles().infoContainer} >
        {
          this.renderTourSelect()
        }
        </Card>
      </div>
    )
  }

	render() {
		return (
			<div id='MobileLandlordTourConfirmation' style={comStyles().container}>
        {
          this.state.loading
          ?
          <div>
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
			</div>
		)
	}
}

// defines the types of variables in this.props
MobileLandlordTourConfirmation.propTypes = {
	history: PropTypes.object.isRequired,
}

// for all optional props, define a default value
MobileLandlordTourConfirmation.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(MobileLandlordTourConfirmation)

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
      minHeight: '100%',
      maxHeight: '100%',
      minWidth: '100%',
      maxWidth: '100%',
      backgroundColor: 'rgba(153,204,255,0.1)',
      overflowY: 'scroll'
		},
    headerContainer: {
      margin: '20px auto',
      padding: '20px',
    },
    centerContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
      margin: '20px auto',
      padding: '10px'
    },
    infoContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'left',
      margin: '20px auto',
      padding: '10px'
    },
    formContainer: {
      width: '100%',
      padding: '10px',
    },
    textFont: {
    //  fontSize: '1.5rem'
    },
    fontSize: {
      fontSize: '1.5rem'
    },
    largeFontSize: {
      fontSize: '2.5rem'
    },
    modalContainer: {

    },
    meetContainer: {
      display: 'flex',
      flexDirection: 'column'
    },
    confirmButtonContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between'
    }
	}
}
