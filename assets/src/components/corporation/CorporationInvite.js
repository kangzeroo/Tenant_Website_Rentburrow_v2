// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import shortid from 'shortid'
import { withRouter } from 'react-router-dom'
import {
  Input,
  Button,
} from 'semantic-ui-react'
import { RegisterLandlord } from '../../api/aws/aws-cognito'

import { sendRegisterInfo } from '../../api/auth/register_api'


class CorporationInvite extends Component {

  constructor() {
		super()
		this.state = {
			staff_name: '',					        // the name typed in
      staff_email: '',                // the email typed in
      staff_title: '',                // the staff's title typed in
      temp_pass: '',                  // randomly generated short password
			errorMessage: null,							// error message to be shown
			loading: false,									// flag for loading status
      submitted: false,               // flag for submitted status
		}
	}

  componentDidMount() {
		// submits the form when you press enter
		const staffInput = document.getElementById('staff_email')
    const enterKeyPressedStream = Rx.Observable.fromEvent(staffInput, 'keyup').filter(e => e.keyCode === 13)
		enterKeyPressedStream.subscribe({
			next: () => this.inviteStaff(this.state)
		})
	}

  updateAttr(event, attr) {
		this.setState({
			[attr]: event.target.value
		})
	}

  inviteStaff(state) {
    this.setState({
      temp_pass: shortid.generate(),
      loading: true,
    }, () => {
      RegisterLandlord({
        email: this.state.staff_email,
        password: this.state.temp_pass,
      }).then(({ email, cognito_id }) => {
        // the invited staff will automatically be associated to the invitors corporation
        const registerJSON = {
          staff_id: cognito_id,
          email,
          name: this.state.staff_name,
          corporation_id: this.props.staffProfile.corporation_id,
          staff_title: this.state.staff_title,
        }
        sendRegisterInfo(registerJSON)
        this.setState({
          loading: false,
          errorMessage: '',
          submitted: true,
        })
      }).catch((err) => {
        this.setState({
          loading: false,
          errorMessage: err,
        })
      })
    })
  }

	render() {
		return (
			<div style={comStyles().container}>
        {
          this.state.submitted
          ?
          <div>
            <p>{`Successfully added ${this.state.staff_name} to your organization!
            A verification email has been sent to ${this.state.staff_email}.
            Your staff member must click on the link in the email and login with the below temporary password:`}</p>
            <h4>{`Temporary Password: ${ this.state.temp_pass }`}</h4>
            <p>{`For security reasons, we do not email this password. Please tell your staff member manually.
            If you or your staff forgets this password, they can always reset it.`}</p>
          </div>
          :
          <div>
    				<p>SEND INVITE</p>
    				<Input
              id='staff_name'
              value={this.state.staff_name}
              onChange={(e) => this.updateAttr(e, 'staff_name')}
              type='text'
              placeholder='Staff Member Name'
            />
    				<Input
              id='staff_email'
              value={this.state.staff_email}
              onChange={(e) => this.updateAttr(e, 'staff_email')}
              type='text'
              placeholder='Staff Member Email'
            />
            <Input
              id='staff_title'
              value={this.state.staff_title}
              onChange={(e) => this.updateAttr(e, 'staff_title')}
              type='text'
              placeholder='Staff Position Name'
            />
            <Button onClick={() => this.inviteStaff(this.state)} loading={this.state.loading}>
              CREATE
            </Button>
          </div>
        }
			</div>
		)
	}
}

// defines the types of variables in this.props
CorporationInvite.propTypes = {
	history: PropTypes.object.isRequired,
  staffProfile: PropTypes.object.isRequired,
}

// for all optional props, define a default value
CorporationInvite.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(CorporationInvite)

// Get access to state from the Redux store
function mapReduxToProps(state) {
	return {
    staffProfile: state.auth.staff_profile
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
