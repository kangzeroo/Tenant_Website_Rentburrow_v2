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
  Message,
} from 'semantic-ui-react'
import { getBuildingById } from '../../../api/building/building_api'


class ScheduleTour extends Component {

  constructor() {
    super()
    this.state = {
			date_1: moment(),
			date_2: moment(),
			date_3: moment(),


      time_1: moment().hour(0).minute(0),
      time_2: moment().hour(0).minute(0),
      time_3: moment().hour(0).minute(0),

      building: {},
      submitted: false,
      error_messages: [],
    }
  }

  componentWillMount() {
    console.log(this.props.location)
    const building_id = this.props.location.search.slice('/building='.length)
    getBuildingById(building_id).then((data) => {
      console.log(data)
      this.setState({
        building: data
      })
    })
  }

  updateDate(date, attr) {
		this.setState({
			[attr]: date,
		})
	}

  validationCheck() {
    const error_messages = []
    if (this.state.date_1 < moment().add(36, 'h')) {
      error_messages.push('Date 1 must be more than 36 hours from now')
    }
    if (this.state.date_2 < moment().add(36, 'h')) {
      error_messages.push('Date 2 must be more than 36 hours from now')
    }
    if (this.state.date_3 < moment().add(36, 'h')) {
      error_messages.push('Date 3 must be more than 36 hours from now')
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
    if (this.validationCheck()) {
      this.setState({
        submitted: true,
        error_messages: []
      })
    }
  }

	render() {
		return (
			<div id='ScheduleTour' style={comStyles().container}>
        <Header as='h1' content={`Rank 3 Dates You Can Tour for ${this.state.building.building_alias || this.state.building.building_address}`} subheader='The Landlord will confirm which time is available. Only 1 person needs to go. All tours must be at least 36 hours in advance to allow current tenants to be notified.' style={comStyles().sign_header} />
        <Form.Field>
          <label>Tour Date 1</label>
          <div style={comStyles().datetime}>
            <DatePicker
              selected={this.state.date_1}
              onChange={(d) => this.updateDate(d, 'date_1')}
            />
            <TimePicker
              showSecond={false}
              defaultValue={this.state.time_1}
              onChange={(v) => this.updateDate(v, 'time_1')}
              format='h:mm a'
              use12Hours
            />
          </div>
        </Form.Field>
        <br/>
        <Form.Field>
          <label>Tour Date 2</label>
          <div style={comStyles().datetime}>
            <DatePicker
              selected={this.state.date_2}
              onChange={(d) => this.updateDate(d, 'date_2')}
            />
            <TimePicker
              showSecond={false}
              defaultValue={this.state.time_2}
              onChange={(v) => this.updateDate(v, 'time_2')}
              format='h:mm a'
              use12Hours
            />
          </div>
        </Form.Field>
        <br/>
        <Form.Field>
          <label>Tour Date 3</label>
          <div style={comStyles().datetime}>
            <DatePicker
              selected={this.state.date_3}
              onChange={(d) => this.updateDate(d, 'date_3')}
            />
            <TimePicker
              showSecond={false}
              defaultValue={this.state.time_3}
              onChange={(v) => this.updateDate(v, 'time_3')}
              format='h:mm a'
              use12Hours
            />
          </div>
        </Form.Field>
        <br/>
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
        <br/>
        {
          this.state.submitted
          ?
          'Submitted! You will get an email when the landlord confirms'
          :
          <Button onClick={() => this.submitSchedule()} content='Submit' primary />
        }
			</div>
		)
	}
}

// defines the types of variables in this.props
ScheduleTour.propTypes = {
	history: PropTypes.object.isRequired,
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
      height: '90vh',
      width: '600px',
      justifyContent: 'center',
      alignItems: 'center',
      margin: 'auto',
		},
    datetime: {
      display: 'flex',
      flexDirection: 'row',
    }
	}
}
