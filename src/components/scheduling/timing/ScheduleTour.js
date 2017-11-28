// Compt for copying as a ScheduleTour
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import moment from 'moment'
import { withRouter } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import TimePicker from 'rc-time-picker'
import 'react-datepicker/dist/react-datepicker.css'
import 'rc-time-picker/assets/index.css'
import {
  Header,
  Button,
  Form,
  Dropdown,
  Message,
  Icon,
} from 'semantic-ui-react'
import { insertTour, } from '../../../api/tour/tour_api'

class ScheduleTour extends Component {

  constructor() {
    super()
    this.state = {
			date_1: moment().add(36, 'h'),
			date_2: moment().add(36, 'h'),
			date_3: moment().add(36, 'h'),


      time_1_begin: '',
      time_2_begin: '',
      time_3_begin: '',

      time_1_end: '',
      time_2_end: '',
      time_3_end: '',

      notes: '',

      saving: false,
      submitted: false,
      error_messages: [],

      time_options: [
        { key: '1000', text: '10:00 AM', value: '1000' },
        { key: '1030', text: '10:30 AM', value: '1030' },
        { key: '1100', text: '11:00 AM', value: '1100' },
        { key: '1130', text: '11:30 AM', value: '1130' },
        { key: '1200', text: '12:00 PM', value: '1200' },
        { key: '1230', text: '12:30 PM', value: '1230' },
        { key: '1300', text: '1:00 PM', value: '1300' },
        { key: '1330', text: '1:30 PM', value: '1330' },
        { key: '1400', text: '2:00 PM', value: '1400' },
        { key: '1430', text: '2:30 PM', value: '1430' },
        { key: '1500', text: '3:00 PM', value: '1500' },
        { key: '1530', text: '3:30 PM', value: '1530' },
        { key: '1600', text: '4:00 PM', value: '1600' },
        { key: '1630', text: '4:30 PM', value: '1630' },
        { key: '1700', text: '5:00 PM', value: '1700' },
        { key: '1730', text: '5:30 PM', value: '1730' },
        { key: '1800', text: '6:00 PM', value: '1800' },
        { key: '1830', text: '6:30 PM', value: '1830' }
      ]
    }
  }

  updateAttr(event, attr) {
    this.setState({
      [attr]: event.target.value
    })
  }

  updateDate(date, attr) {
		this.setState({
			[attr]: date,
		})
	}

  updateTime(event, data, attr) {
    this.setState({
      [attr]: data.value
    })
  }

  validationCheck() {
    const error_messages = []
    if (moment(this.state.date_1.format('L')).isBefore(moment().add(36, 'h').format('L'))) {
      error_messages.push('Date 1 must be at least 36 hours from now')
    }
    if (moment(this.state.date_2.format('L')).isBefore(moment().add(36, 'h').format('L'))) {
      error_messages.push('Date 2 must be at least 36 hours from now')
    }
    if (moment(this.state.date_3.format('L')).isBefore(moment().add(36, 'h').format('L'))) {
      error_messages.push('Date 3 must be at least 36 hours from now')
    }
    if (this.state.time_1_begin.length === 0 || this.state.time_1_end.length === 0) {
      error_messages.push('You must select your available begin & end time for tour date 1')
    }
    if (this.state.time_2_begin.length === 0 || this.state.time_2_end.length === 0) {
      error_messages.push('You must select your available begin & end time for tour date 2')
    }
    if (this.state.time_3_begin.length === 0 || this.state.time_3_end.length === 0) {
      error_messages.push('You must select your available begin & end time for tour date 3')
    }
    if ((moment(this.state.date_1.format('L')).isSame(moment(this.state.date_2.format('L'))) && (this.state.time_1_begin === this.state.time_2_begin)) ||
        (moment(this.state.date_2.format('L')).isSame(moment(this.state.date_3.format('L'))) && (this.state.time_2_begin === this.state.time_3_begin)) ||
        (moment(this.state.date_1.format('L')).isSame(moment(this.state.date_3.format('L'))) && (this.state.time_3_begin === this.state.time_1_begin))) {
      error_messages.push('Conflicting preferred tour date and time')
    }
    if (moment(this.state.time_1_begin, 'HH:mm').isAfter(moment(this.state.time_1_end, 'HH:mm')) ||
        moment(this.state.time_2_begin, 'HH:mm').isAfter(moment(this.state.time_2_end, 'HH:mm')) ||
        moment(this.state.time_3_begin, 'HH:mm').isAfter(moment(this.state.time_2_end, 'HH:mm'))) {
      error_messages.push('Begin time cannot be after End time')
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

  submitSchedule() {
    // const datetime_1_begin = moment([this.state.date_1.format('L'), this.state.time_1_begin].join(' '), 'MM/DD/YYYY HH:mm').format('MMMM Do YYYY, hh:mm a')
    // const datetime_1_end = moment([this.state.date_1.format('L'), this.state.time_1_end].join(' '), 'MM/DD/YYYY HH:mm').format('MMMM Do YYYY, hh:mm a')
    if (this.validationCheck()) {
      this.setState({
        saving: true,
      })
      insertTour({
        inquiry_id: this.props.application.id,
        date_1: moment(this.state.date_1).format('L'),
  			date_2: moment(this.state.date_2).format('L'),
  			date_3: moment(this.state.date_3).format('L'),
        time_1_begin: this.state.time_1_begin,
        time_2_begin: this.state.time_2_begin,
        time_3_begin: this.state.time_3_begin,
        time_1_end: this.state.time_1_end,
        time_2_end: this.state.time_2_end,
        time_3_end: this.state.time_3_end,
        notes: this.state.notes,
      })
      .then((data) => {
        this.setState({
          submitted: true,
          saving: false,
          submitted_at: moment().format('LLL')
        })
      })
    }
  }


	render() {
		return (
			<div id='ScheduleTour' style={comStyles().container}>
        <Header
          as='h2'
          icon='street view'
          content='Schedule A Tour'
          textAlign='center'
        />
        <Message floating>
          <Message.Content>
            <Message.Header>{`Rank 3 Dates You Can Tour for ${this.props.building.building_alias || this.props.building.building_address}`}</Message.Header>
            <Message.List>
              <Message.Item>The Landlord will confirm which time is available.</Message.Item>
              <Message.Item>Only 1 person needs to go.</Message.Item>
              <Message.Item>All tours must be at least 36 hours in advance to allow current tenants to be notified.</Message.Item>
            </Message.List>
          </Message.Content>
        </Message>
        <br />
        <Form>
          <Form.Group widths='equal'>
            <Form.Field>
              <label>Preferred Tour Date 1</label>
              <DatePicker
                selected={this.state.date_1}
                onChange={(d) => this.updateDate(d, 'date_1')}
              />
            </Form.Field>
            <Form.Field>
              <label>Available Begin Time</label>
              <Dropdown
                id='time_1_begin'
                placeholder='Time Begin'
                selection
                compact
                options={this.state.time_options}
                onChange={(e, d) => { this.updateTime(e, d, 'time_1_begin') }}
              />
            </Form.Field>
            <Form.Field>
              <label>Available End Time</label>
              <Dropdown
                id='time_1_end'
                placeholder='Time End'
                selection
                compact
                options={this.state.time_options}
                onChange={(e, d) => { this.updateTime(e, d, 'time_1_end') }}
              />
            </Form.Field>
          </Form.Group>
          <br/>
          <Form.Group widths='equal'>
            <Form.Field>
              <label>Preferred Tour Date 2</label>
              <DatePicker
                selected={this.state.date_2}
                onChange={(d) => this.updateDate(d, 'date_2')}
              />
            </Form.Field>
            <Form.Field>
              <label>Available Begin Time</label>
              <Dropdown
                id='time_2_begin'
                placeholder='Time Begin'
                selection
                compact
                options={this.state.time_options}
                onChange={(e, d) => { this.updateTime(e, d, 'time_2_begin') }}
              />
            </Form.Field>
            <Form.Field>
              <label>Available End Time</label>
              <Dropdown
                id='time_2_end'
                placeholder='Time End'
                selection
                compact
                options={this.state.time_options}
                onChange={(e, d) => { this.updateTime(e, d, 'time_2_end') }}
              />
            </Form.Field>
          </Form.Group>
          <br />
          <Form.Group widths='equal'>
            <Form.Field>
              <label>Preferred Tour Date 3</label>
              <DatePicker
                selected={this.state.date_3}
                onChange={(d) => this.updateDate(d, 'date_3')}
              />
            </Form.Field>
            <Form.Field>
              <label>Available Begin Time</label>
              <Dropdown
                id='time_3_begin'
                placeholder='Time Begin'
                selection
                compact
                options={this.state.time_options}
                onChange={(e, d) => { this.updateTime(e, d, 'time_3_begin') }}
              />
            </Form.Field>
            <Form.Field>
              <label>Available End Time</label>
              <Dropdown
                id='time_3_end'
                placeholder='Time End'
                selection
                compact
                options={this.state.time_options}
                onChange={(e, d) => { this.updateTime(e, d, 'time_3_end') }}
              />
            </Form.Field>
          </Form.Group>
          <br/>
          <Form.Field>
            <label>Notes for Landlord</label>
            <Form.TextArea
              placeholder='I have a group of 5 wanting to tour unit 101...'
              onChange={(e) => { this.updateAttr(e, 'notes') }}
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
        </Form>
        <div style={comStyles().bottomContainer} >
        {
          this.state.submitted
          ?
          <div>
            <Message positive>
              <Header
                as='h3'
                icon='checkmark box'
                content={`Success! Your Tour Dates & Time have been sent to the Landlord`}
                subheader={`Submitted at ${this.state.submitted_at}, Expect an email soon!`}
              />
            </Message>
            <Button
              primary
              basic
              fluid
              icon='cancel'
              content='Close'
              onClick={() => this.props.closeModal()}
            />
          </div>
          :
          <Button
            primary
            fluid
            loading={this.state.saving}
            content='Book Tours'
            onClick={() => this.submitSchedule()}
          />
        }
        </div>
			</div>
		)
	}
}

// defines the types of variables in this.props
ScheduleTour.propTypes = {
	history: PropTypes.object.isRequired,
  building: PropTypes.object.isRequired,      // passed in
  application: PropTypes.object.isRequired,   // passed in
  closeModal: PropTypes.func.isRequired,      // passed in
}

// for all optional props, define a default value
ScheduleTour.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(ScheduleTour)

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
      justifyContent: 'center',
      alignItems: 'center',
      margin: 'auto',
		},
    datetime: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    bottomContainer: {
      margin: '10px 0px 0px 0px',
      width: '500px'
    }
	}
}
