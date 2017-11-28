// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
  Button,
  Icon,
  Header,
  Message,
} from 'semantic-ui-react'
import ScheduleTour from '../../scheduling/timing/ScheduleTour'

class ApplicationComplete extends Component {
  constructor() {
    super()
    this.state = {
      user_wants_tour: false,
    }
  }

  renderBody() {
    return (
      <div>
        <Header as='h1'>
          <Icon name='checkmark box' color='green' />
          <Header.Content>{`Success! The landlord has received your application.`}</Header.Content>
          <Header.Subheader>{`Submitted on ${this.props.completed_at} EDT, expect to hear from us soon!`}</Header.Subheader>
        </Header>
        <Message floating>
          <Message.Header>Next Steps</Message.Header>
          <Message.List>
            <Message.Item>The Landlord is confirming renewals right now, expect to hear from them soon</Message.Item>
            <Message.Item>Book a physical tour</Message.Item>
            <Message.Item>Every user will receive one free Uber ride to and back a property for a tour!</Message.Item>
          </Message.List>
        </Message>
        <div style={comStyles().mainButtonContainer} >
          <Button
            color='teal'
            icon='street view'
            content='Book A Tour'
            size='huge'
            onClick={() => this.setState({ user_wants_tour: true, })}
            style={comStyles().button}
          />
          <Button
            primary
            basic
            content={`No I don't need a tour`}
            onClick={() => this.props.closeModal()}
            style={comStyles().button}
          />
        </div>
        <div style={comStyles().successContainer}>
          <Button
            primary
            fluid
            icon='cancel'
            content='Close'
            onClick={() => this.props.closeModal()}
            style={comStyles().bottomButton}
          />
        </div>
      </div>
    )
  }

  renderScheduleTour() {
    return (
      <ScheduleTour
        building={this.props.building}
        application={this.props.application}
        closeModal={() => this.props.closeModal()}
      />
    )
  }

	render() {
		return (
			<div id='ApplicationComplete' style={comStyles().container}>
        {
          this.state.user_wants_tour
          ?
          this.renderScheduleTour()
          :
          this.renderBody()
        }
			</div>
		)
	}
}

// defines the types of variables in this.props
ApplicationComplete.propTypes = {
	history: PropTypes.object.isRequired,
  building: PropTypes.object.isRequired,        // passed in
  application: PropTypes.object.isRequired,     // passed in
  closeModal: PropTypes.func.isRequired,        // passed in
  completed_at: PropTypes.string.isRequired,    // passed in
}

// for all optional props, define a default value
ApplicationComplete.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(ApplicationComplete)

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
      margin: '10px'
		},
    mainButtonContainer: {
      display: 'flex',
      flexDirection: 'column'
    },
    successContainer: {
      margin: '10px 0px'
    },
    button: {
      margin: '5px 0px 5px 0px'
    },
    bottomButton: {
      margin: '20px 0px 0px 0px'
    }
	}
}
