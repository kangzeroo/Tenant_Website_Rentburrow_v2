// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
  Step,
  Icon,
} from 'semantic-ui-react'
import { checkWhatLandlordWantsFromTenant } from '../../../api/leasing/leasing_api'
import BeginForm from './forms/BeginForm'
import AboutTenantForm from './forms/AboutTenantForm'
import AboutStudentForm from './forms/AboutStudentForm'
import SuitePreferencesForm from './forms/SuitePreferencesForm'
import WitnessForm from './forms/WitnessForm'
import GuarantorForm from './forms/GuarantorForm'
import MedicalHistoryForm from './forms/MedicalHistoryForm'
import EmergancyContactForm from './forms/EmergancyContactForm'
import PersonalityForm from './forms/PersonalityForm'
import EmploymentForm from './forms/EmploymentForm'


class LeaseApplication extends Component {

  constructor() {
    super()
    this.state = {
      current_form: 'begin',
      required_forms: []
      // {
      //   begin: true,
      //   about_tenant: true,
      //   about_student: true,
      //   suite_room_preferences: true,
      //   emergancy_contact: true,
      //   witness: true,
      //   guarantor: true,
      //   medical: true,
      //   personality: true,
      //   employment: true
      // }
    }
  }

  componentWillMount() {
    const building_id = this.props.location.pathname.slice(this.props.location.pathname.indexOf('/lease/') + '/lease/'.length)
    checkWhatLandlordWantsFromTenant(building_id)
      .then((data) => {
        const forms = []
        for (const key in data) {
          console.log(key)
          const obj = data[key]
          forms.push(obj)
        }
        this.setState({
          required_forms: forms,
        }, () => console.log(this.state.required_forms))
      })
  }

  generateSteps() {
    return (
      <div style={comStyles().steps}>
        <Step.Group vertical>
          {
            this.state.required_forms.map((form) => {
              return (
                <Step key={form.key} active={false} completed={false} onClick={() => this.setState({ current_form: form.key })}>
                  <Icon name={form.icon} />
                  <Step.Content>
                    <Step.Title>{ form.title }</Step.Title>
                    <Step.Description>{ form.desc }</Step.Description>
                  </Step.Content>
                </Step>
              )
            })
          }
        </Step.Group>
      </div>
    )
  }

  generateForm() {
    if (this.state.current_form === 'begin') {
      return (
        <BeginForm />
      )
    } else if (this.state.current_form === 'about_tenant') {
      return (
        <AboutTenantForm />
      )
    } else if (this.state.current_form === 'about_student') {
      return (
        <AboutStudentForm />
      )
    } else if (this.state.current_form === 'suite_room_preferences') {
      return (
        <SuitePreferencesForm />
      )
    } else if (this.state.current_form === 'witness') {
      return (
        <WitnessForm />
      )
    } else if (this.state.current_form === 'guarantor') {
      return (
        <GuarantorForm />
      )
    } else if (this.state.current_form === 'medical_history') {
      return (
        <MedicalHistoryForm />
      )
    } else if (this.state.current_form === 'emergancy_contact') {
      return (
        <EmergancyContactForm />
      )
    } else if (this.state.current_form === 'personality') {
      return (
        <PersonalityForm />
      )
    } else if (this.state.current_form === 'employment') {
      return (
        <EmploymentForm />
      )
    }
  }

	render() {
		return (
			<div style={comStyles().container}>
				{
          this.generateSteps()
        }
        {
          this.generateForm()
        }
			</div>
		)
	}
}

// defines the types of variables in this.props
LeaseApplication.propTypes = {
	history: PropTypes.object.isRequired,
  tenant_profile: PropTypes.object.isRequired,
  applied_building: PropTypes.object.isRequired,
}

// for all optional props, define a default value
LeaseApplication.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(LeaseApplication)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
    tenant_profile: redux.auth.tenant_profile,
    applied_building: redux.contract.selected_building_to_apply_for,
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
      flexDirection: 'row',
      padding: '10px',
		},
    steps: {
      minWidth: '200px',
      maxWidth: '200px',
      height: '90vh',
      overflowY: 'scroll',
    }
	}
}
