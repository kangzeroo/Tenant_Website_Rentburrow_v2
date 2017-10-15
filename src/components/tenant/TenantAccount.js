// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
  Image,
  Form,
  Button,
  Header,
  Icon,
  Progress,
} from 'semantic-ui-react'
import {
  updateStudentProfile,
} from '../../api/signing/sublet_contract_api'

class TenantAccount extends Component {

  constructor() {
    super()
    this.state = {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',

      saving: false,
      profile_saved: false,
    }
  }

  componentWillMount() {
    this.setState({
      first_name: this.props.tenant_profile.first_name,
      last_name: this.props.tenant_profile.last_name,
      email: this.props.tenant_profile.email ? this.props.tenant_profile.email : '',
      phone: this.props.tenant_profile.phone ? this.props.tenant_profile.phone : '',
    })
  }

  updateAttr(e, attr) {
		this.setState({
			[attr]: e.target.value,
		})
	}

  saveProfile() {
    this.setState({
      saving: true
    }, () => {
      updateStudentProfile({
        student_id: this.props.tenant_profile.student_id,
        first_name: this.state.first_name,
        last_name: this.state.last_name,
        email: this.state.email,
        phone: this.state.phone,
      })
      .then(() => {
        this.setState({
          profile_saved: true,
        })
      })
    })
  }

	render() {
		return (
			<div style={comStyles().container}>
        {
          this.state.saving
          ?
          <Progress
            percent={this.state.profile_saved ? 100 : 50}
            active
            success={this.state.profile_saved}
          >
            {
              this.state.profile_saved
              ?
              <div style={comStyles().success}>
                <Button
                  primary
                  basic
                  content='Back to Dashboard'
                  onClick={() => this.props.history.push('/')}
                />
                Profile Updated
              </div>
              :
              <div>
              Saving Profile...
              </div>
            }
          </Progress>
          :
          null
        }
        <div style={comStyles().formContainer} >
          <Header as='h2'>
            <Image
              shape='circular'
              src={this.props.tenant_profile.thumbnail}
            />
            Update Profile
          </Header>
          <Form>
            <Form.Field>
              <Form.Input
                label='First Name'
                placeholder='First name'
                value={this.state.first_name}
                onChange={(e) => this.updateAttr(e, 'first_name')}
              />
              <Form.Input
                label='Last Name'
                placeholder='Last Name'
                value={this.state.last_name}
                onChange={(e) => this.updateAttr(e, 'last_name')}
              />
              <Form.Input
                label='Email'
                placeholder='Email'
                value={this.state.email}
                onChange={(e) => this.updateAttr(e, 'email')}
              />
              <Form.Input
                label='Phone Number'
                placeholder='Phone Number'
                value={this.state.phone}
                onChange={(e) => this.updateAttr(e, 'phone')}
              />
            </Form.Field>
          </Form>
          <div style={comStyles().buttons_container} >
            <Button
              primary
              content='Save Profile'
              onClick={() => this.saveProfile()}
            />
          </div>
        </div>
			</div>
		)
	}
}

// defines the types of variables in this.props
TenantAccount.propTypes = {
	history: PropTypes.object.isRequired,
  tenant_profile: PropTypes.object,
}

// for all optional props, define a default value
TenantAccount.defaultProps = {
  tenant_profile: {}
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(TenantAccount)

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
		},
    success: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    formContainer: {
      display: 'flex',
      flexDirection: 'column',
      margin: '30px',
    },
    buttonsContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      margin: '30px 0px 0px 0px'
    },
	}
}
