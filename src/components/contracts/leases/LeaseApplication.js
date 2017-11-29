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
import { selectBuilding, selectCorporation } from '../../../actions/selection/selection_actions'
import { getSpecificLandlord } from '../../../api/search/search_api'
import { saveMyApplicationToRedux, saveGroupApplicationToRedux, saveAppliedBuildingToRedux, } from '../../../actions/group/group_actions'
import { getBuildingById } from '../../../api/building/building_api'
import { checkWhatLandlordWantsFromTenant } from '../../../api/leasing/leasing_api'
import { checkIfUserAlreadyPartGroup, addMeToTheGroup, createGroup, getGroupMembers, } from '../../../api/group/group_api'
import { getMyApplication, } from '../../../api/application/lease_application_api'
import { sendSummaryEmailToLandlord } from '../../../api/messaging/summary_email'

class LeaseApplication extends Component {

  constructor() {
    super()
    this.state = {
      current_form: 'begin',
      group_id: '',
      required_forms: [],

      building: {},

      saved_form_state: {
        joined_group: {},
        begin: {},
        about_tenant: {},
        roommates: {},
        about_student: {},
        suite_room_preferences: {},
        emergancy_contact: {},
        witness: {},
        guarantor: {},
        medical: {},
        personality: {},
        employment: {},
      },

      loaded: false,
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
        this.setState({
          building: data,
        })
        this.props.selectBuilding(data)
        this.props.saveAppliedBuildingToRedux(data)
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
          loaded: true,
        }, () => {
          this.autoAssociateGroup()
        })
        return getSpecificLandlord({ building_id: this.state.building.building_id })
      })
  		.then((corporation) => {
  			this.props.selectCorporation(corporation)
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
            // console.log('User Already Joined!')
            this.setState({
              group_id: group_id,
            })
            getGroupMembers(group_id)
            .then((data) => {
              this.props.saveGroupApplicationToRedux(data)
              return getMyApplication({ group_id, tenant_id: this.props.tenant_profile.tenant_id })
            })
            .then((data) => {
              this.props.saveMyApplicationToRedux(data.application_id)
            })
          } else if (data.user_does_not_exist) {
            // console.log('User does not exist in the group!')
            createGroup(this.props.tenant_profile.tenant_id, this.state.building.corporation_id, this.state.building.building_id)
              .then((data) => {
                this.setState({
                  group_id: data.group_id
                })
                this.props.saveMyApplicationToRedux(data.application_id)
                localStorage.setItem('leasing_group_id', data.group_id)
              })
          } else {
            // console.log('Add User To the Group!')
            addMeToTheGroup(this.props.tenant_profile.tenant_id, group_id)
            .then((data) => {
              this.setState({
                group_id: data.group_id,
              })
              this.props.saveMyApplicationToRedux(data.application_id)
              localStorage.setItem('leasing_group_id', data.group_id)
              this.clickedFormStep('joined_group')
            })
          }
        })
        .catch((err) => {
          // console.log(err)
        })
    } else {
      createGroup(this.props.tenant_profile.tenant_id, this.state.building.corporation_id, this.state.building.building_id)
      .then((data) => {
        // console.log(data)
        this.setState({
          group_id: data.group_id
        })
        // console.log(data)
        this.props.saveMyApplicationToRedux(data.application_id)
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

  goToNextForm(form_key, state) {
    let next_form_key = 'begin'
    // console.log(form_key)
    this.setState({
      saved_form_state: {
        ...this.state.saved_form_state,
        [form_key]: state,
      }
    })
    this.state.required_forms.forEach((form, index) => {
      if (form.key === form_key) {
        next_form_key = this.state.required_forms[index + 1].key
      }
    })
    // console.log(next_form_key)
    this.clickedFormStep(next_form_key)
  }

  isActiveStep(form_key) {
    return form_key === this.state.current_form
  }

  generateSteps() {
    return (
      <div style={imageBackground().steps}>
        <Step.Group vertical>
          {
            this.state.required_forms.map((form) => {
              return (
                <Step key={form.key} active={this.isActiveStep(form.key)} completed={this.isCompleted(form.key)} onClick={() => this.clickedFormStep(form.key)}>
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
        <BeginForm
          building={this.state.building}
          goToNextForm={(state) => this.goToNextForm(this.state.current_form, state)}
        />
      )
    } else if (this.state.current_form === 'joined_group') {
      return (
        <JoinedGroup
          group_id={this.state.group_id}
          goToNextForm={(state) => this.goToNextForm(this.state.current_form, state)}
        />
      )
    } else if (this.state.current_form === 'about_tenant' && this.props.tenant_profile && this.props.tenant_profile.tenant_id !== '') {
      return (
        <AboutTenantForm
          goToNextForm={(state) => this.goToNextForm(this.state.current_form, state)}
        />
      )
    } else if (this.state.current_form === 'roommates' && this.state.group_id) {
      return (
        <RoommateGroupForm
          group_id={this.state.group_id}
          goToNextForm={(state) => this.goToNextForm(this.state.current_form, state)}
        />
      )
    } else if (this.state.current_form === 'about_student') {
      return (
        <AboutStudentForm
          goToNextForm={(state) => this.goToNextForm(this.state.current_form, state)}
        />
      )
    } else if (this.state.current_form === 'suite_room_preferences') {
      return (
        <SuitePreferencesForm
          group_id={this.state.group_id}
          goToNextForm={(state) => this.goToNextForm(this.state.current_form, state)}
          building={this.props.applied_building}
        />
      )
    } else if (this.state.current_form === 'witness') {
      return (
        <WitnessForm
          goToNextForm={(state) => this.goToNextForm(this.state.current_form, state)}
        />
      )
    } else if (this.state.current_form === 'guarantor' && this.props.my_application_id !== '') {
      return (
        <GuarantorForm
          goToNextForm={(state) => this.goToNextForm(this.state.current_form, state)}
        />
      )
    } else if (this.state.current_form === 'medical_history') {
      return (
        <MedicalHistoryForm
          goToNextForm={(state) => this.goToNextForm(this.state.current_form, state)}
        />
      )
    } else if (this.state.current_form === 'emergancy_contact') {
      return (
        <EmergancyContactForm
          goToNextForm={(state) => this.goToNextForm(this.state.current_form, state)}
        />
      )
    } else if (this.state.current_form === 'personality') {
      return (
        <PersonalityForm
          goToNextForm={(state) => this.goToNextForm(this.state.current_form, state)}
        />
      )
    } else if (this.state.current_form === 'employment') {
      return (
        <EmploymentForm
          goToNextForm={(state) => this.goToNextForm(this.state.current_form, state)}
        />
      )
    } else if (this.state.current_form === 'submit') {
      return (
        <SubmitLeaseApplication
          sendSummaryEmail={() => sendSummaryEmailToLandlord(this.state.saved_form_state, this.state.building)}
        />
      )
    }
  }

  isCompleted(attr) {
    if (this.state.saved_form_state[attr]) {
      return this.state.saved_form_state[attr].parent_component_saved
    } else {
      return false
    }
  }

	render() {
		return (
			<div id='LeaseApplication' style={comStyles().container}>
        <div style={imageBackground(this.props.applied_building.cover_photo).grayscale}>
        </div>
        {
          this.state.loaded
          ?
          <div style={comStyles().inner_container}>
            <div style={imageBackground().sidebar}>
      				{
                this.generateSteps()
              }
            </div>
            <div style={imageBackground().form_output}>
              {
                this.generateForm()
              }
            </div>
          </div>
          :
          <div style={comStyles().inner_container}>
            <div style={comStyles().hidden_loading}>
              <img src='https://s3.amazonaws.com/rentburrow-static-assets/Loading+Icons/loading-blue-clock.gif' width='50px' height='auto' />
            </div>
          </div>
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
  applyToLiveAtThisBuilding: PropTypes.func.isRequired,
  location_forwarding: PropTypes.string.isRequired,
  saveMyApplicationToRedux: PropTypes.func.isRequired,
  saveGroupApplicationToRedux: PropTypes.func.isRequired,
  saveAppliedBuildingToRedux: PropTypes.func.isRequired,
  my_application_id: PropTypes.string,
  selectBuilding: PropTypes.func.isRequired,
  selectCorporation: PropTypes.func.isRequired,
}

// for all optional props, define a default value
LeaseApplication.defaultProps = {
  my_application_id: ''
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(LeaseApplication)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
    tenant_profile: redux.auth.tenant_profile,
    applied_building: redux.contract.selected_building_to_apply_for,
    location_forwarding: redux.auth.location_forwarding,
    my_application_id: redux.group.my_application_id,
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
    applyToLiveAtThisBuilding,
    saveMyApplicationToRedux,
    saveGroupApplicationToRedux,
    saveAppliedBuildingToRedux,
    selectBuilding,
    selectCorporation,
	})(RadiumHOC)
)

// ===============================

// the JS function that returns Radium JS styling
const comStyles = () => {
	return {
		container: {
      display: 'flex',
      flexDirection: 'row',
      width: '95%',
		},
    inner_container: {
      display: 'flex',
      flexDirection: 'row',
      position: 'absolute',
      width: '100vw',
      height: '93vh',
    },
    hidden_loading: {
      position: 'absolute',
      // zIndex: 5,
      minWidth: '100%',
      minHeight: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
	}
}

const imageBackground = (img, open) => {
  let form_output_styles = {
    minWidth: '100vw',
    maxWidth: '100vw',
  }
  let sidebar_styles = {
    minWidth: '0vw',
    maxWidth: '0vw',
  }
  if (open) {
    sidebar_styles.midWidth = '15vw'
    sidebar_styles.maxWidth = '15vw'
    form_output_styles.midWidth = '85vw'
    form_output_styles.maxWidth = '85vw'
  }
  return {
    form_output: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '93vh',
      maxHeight: '93vh',
      // overflowY: 'scroll',
      padding: '20px 20px 50px 150px',
      ...form_output_styles,
    },
    sidebar: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      ...sidebar_styles,
    },
    grayscale: {
      backgroundImage: `url('${img}')`,
      backgroundSize: 'cover',
      position: 'absolute',
      width: '100vw',
      height: '93vh',
      filter: 'grayscale(20%)',
    },
    steps: {
    },
    condom: {
      filter: 'none',
    }
  }
}
