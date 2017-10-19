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
import RoommateGroupForm from './forms/RoommateGroupForm'
import JoinedGroup from './forms/JoinedGroup'
import SubmitLeaseApplication from './forms/SubmitLeaseApplication'
import { applyToLiveAtThisBuilding } from '../../../actions/contract/contract_actions'
import { getBuildingById } from '../../../api/building/building_api'
import { checkWhatLandlordWantsFromTenant } from '../../../api/leasing/leasing_api'
import { checkIfUserAlreadyPartGroup, addMeToTheGroup, autoGenerateGroup, createGroup, } from '../../../api/group/group_api'

class LeaseApplication extends Component {

  constructor() {
    super()
    this.state = {
      current_form: 'begin',
      group_id: '',
      required_forms: [],
      // {
      //   joined_group: true,
      //   begin: true,
      //   about_tenant: true,
      //   roommates: true,
      //   about_student: true,
      //   suite_room_preferences: true,
      //   emergancy_contact: true,
      //   witness: true,
      //   guarantor: true,
      //   medical: true,
      //   personality: true,
      //   employment: true
      //   submit: true,
      // }
    }
  }

  componentWillMount() {
    const building_id = this.props.location.pathname.slice(this.props.location.pathname.indexOf('/lease/') + '/lease/'.length)
    let current_form = ''
    if (this.props.location_forwarding.indexOf('form=') > -1) {
      current_form = this.props.location_forwarding.slice(this.props.location_forwarding.indexOf('form=') + 'form='.length)
    } else {
      current_form = 'begin'
    }
    getBuildingById(building_id)
      .then((data) => {
        this.props.applyToLiveAtThisBuilding(data)
        return checkWhatLandlordWantsFromTenant(building_id)
      })
      .then((data) => {
        const forms = []
        for (const key in data) {
          const obj = data[key]
          forms.push(obj)
        }
        this.setState({
          required_forms: forms,
          current_form: current_form,
        }, () => {
          this.autoAssociateGroup()
        })
      })
  }

  autoAssociateGroup() {
    if (this.props.location_forwarding.indexOf('group=') > -1 || localStorage.getItem('leasing_group_id')) {
      let group_id = ''
      if (localStorage.getItem('leasing_group_id')) {
        group_id = localStorage.getItem('leasing_group_id')
      }
      if (this.props.location_forwarding.indexOf('group=') > -1) {
        group_id = this.props.location.search.slice(this.props.location.search.indexOf('group=') + 'group='.length)
      }
      checkIfUserAlreadyPartGroup(group_id, this.props.tenant_profile.tenant_id)
        .then((data) => {
          if (data.already_joined) {
            console.log('User Already Joined!')
            this.setState({
              group_id: group_id,
            })
          } else if (data.user_does_not_exist) {
            console.log('User does not exist in the group!')
            createGroup(this.props.tenant_profile.tenant_id)
              .then((data) => {
                this.setState({
                  group_id: data.group_id
                })
                localStorage.setItem('leasing_group_id', data.group_id)
              })
          } else {
            console.log('Add User To the Group!')
            addMeToTheGroup(this.props.tenant_profile.tenant_id, group_id)
            .then((data) => {
              this.setState({
                group_id: data.group_id,
              })
              localStorage.setItem('leasing_group_id', data.group_id)
              this.clickedFormStep('joined_group')
            })
          }
        })
        .catch((err) => {
          console.log(err)
        })
    } else {
      createGroup(this.props.tenant_profile.tenant_id)
      .then((data) => {
        this.setState({
          group_id: data.group_id
        })
        localStorage.setItem('leasing_group_id', data.group_id)
      })
    }
  }

  updateUrlToForm(form_key) {
    // set the url to a different one
    history.pushState(null, null, `${this.props.location.pathname}?form=${form_key}`)
  }

  clickedFormStep(form_key) {
    this.updateUrlToForm(form_key)
    this.setState({
      current_form: form_key
    })
  }

  goToNextForm(form_key) {
    let next_form_key = 'begin'
    this.state.required_forms.forEach((form, index) => {
      if (form.key === form_key) {
        next_form_key = this.state.required_forms[index + 1].key
      }
    })
    this.clickedFormStep(next_form_key)
  }

  isActiveStep(form_key) {
    return form_key === this.state.current_form
  }

  generateSteps() {
    return (
      <Step.Group vertical>
        {
          this.state.required_forms.map((form) => {
            return (
              <Step key={form.key} active={this.isActiveStep(form.key)} completed={false} onClick={() => this.clickedFormStep(form.key)}>
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
    )
  }

  generateForm() {
    if (this.state.current_form === 'begin') {
      return (
        <BeginForm
          goToNextForm={(form_key) => this.goToNextForm(this.state.current_form)}
        />
      )
    } else if (this.state.current_form === 'joined_group') {
      return (
        <JoinedGroup
          group_id={this.state.group_id}
          goToNextForm={(form_key) => this.goToNextForm(this.state.current_form)}
        />
      )
    }else if (this.state.current_form === 'about_tenant') {
      return (
        <AboutTenantForm
          goToNextForm={(form_key) => this.goToNextForm(this.state.current_form)}
        />
      )
    } else if (this.state.current_form === 'roommates' && this.state.group_id) {
      return (
        <RoommateGroupForm
          group_id={this.state.group_id}
          goToNextForm={(form_key) => this.goToNextForm(this.state.current_form)}
        />
      )
    } else if (this.state.current_form === 'about_student') {
      return (
        <AboutStudentForm
          goToNextForm={(form_key) => this.goToNextForm(this.state.current_form)}
        />
      )
    } else if (this.state.current_form === 'suite_room_preferences') {
      return (
        <SuitePreferencesForm
          group_id={this.state.group_id}
          goToNextForm={(form_key) => this.goToNextForm(this.state.current_form)}
          building={this.props.applied_building}
        />
      )
    } else if (this.state.current_form === 'witness') {
      return (
        <WitnessForm
          goToNextForm={(form_key) => this.goToNextForm(this.state.current_form)}
        />
      )
    } else if (this.state.current_form === 'guarantor') {
      return (
        <GuarantorForm
          goToNextForm={(form_key) => this.goToNextForm(this.state.current_form)}
        />
      )
    } else if (this.state.current_form === 'medical_history') {
      return (
        <MedicalHistoryForm
          goToNextForm={(form_key) => this.goToNextForm(this.state.current_form)}
        />
      )
    } else if (this.state.current_form === 'emergancy_contact') {
      return (
        <EmergancyContactForm
          goToNextForm={(form_key) => this.goToNextForm(this.state.current_form)}
        />
      )
    } else if (this.state.current_form === 'personality') {
      return (
        <PersonalityForm
          goToNextForm={(form_key) => this.goToNextForm(this.state.current_form)}
        />
      )
    } else if (this.state.current_form === 'employment') {
      return (
        <EmploymentForm
          goToNextForm={(form_key) => this.goToNextForm(this.state.current_form)}
        />
      )
    } else if (this.state.current_form === 'submit') {
      return (
        <SubmitLeaseApplication />
      )
    }
  }

	render() {
		return (
			<div style={comStyles().container}>
        <div style={comStyles().steps}>
  				{
            this.generateSteps()
          }
        </div>
        <div style={comStyles().form_output}>
          {
            this.generateForm()
          }
        </div>
			</div>
		)
	}
}

// defines the types of variables in this.props
LeaseApplication.propTypes = {
	history: PropTypes.object.isRequired,
  tenant_profile: PropTypes.object.isRequired,
  applied_building: PropTypes.object.isRequired,
  applyToLiveAtThisBuilding: PropTypes.func.isRequired,
  location_forwarding: PropTypes.string.isRequired,
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
    location_forwarding: redux.auth.location_forwarding,
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
    applyToLiveAtThisBuilding,
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
    },
    form_output: {
      minHeight: '90vh',
      maxHeight: '90vh',
      overflowY: 'scroll',
    }
	}
}
