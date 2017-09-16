// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
  Icon,
  Modal,
} from 'semantic-ui-react'
import { calculateBuildingQuickAmenities } from '../../api/amenities/amenity_calculations'
import { temperatureIcon, wifiIcon, electricityIcon, parkingIcon, seeFullListIcon, } from '../../api/amenities/amenity_icons'
import HomeExplorer from '../home_explorer/HomeExplorer'


class BuildingQuickAmenitiesBar extends Component {

  constructor() {
    super()
    this.state = {
      elec_incl: false,
      water_incl: false,
      heat_incl: false,
      internet_incl: false,
      free_parking: false,
      paid_parking: false,

      toggle_modal: false,
      modal_name: '',
      context: {},
    }
  }

  componentWillMount() {
    Promise.all(this.props.promise_array_of_suite_amenities_with_id).then((all_results) => {
			const all_suite_amenities = all_results.map((amenity_summary) => {
				return {
					suite_id: amenity_summary.suite_id,
					amenities: amenity_summary.amenities.map((amenity_string) => {
						return JSON.parse(amenity_string)
					})
				}
			})
      this.setState({
        ...calculateBuildingQuickAmenities(this.props.building_amenities, all_suite_amenities)
      })
		})
  }

  toggleModal(bool, attr, context) {
		this.setState({
      toggle_modal: bool,
      modal_name: attr,
      context,
    })
  }

	renderAppropriateModal(modal_name, context) {
		if (modal_name === 'building_amenities') {
	    return (
	      <Modal
					dimmer
					open={this.state.toggle_modal}
					onClose={() => this.toggleModal(false)}
					closeIcon
					size='fullscreen'
				>
	        <Modal.Content>
						<HomeExplorer
							building={this.props.building}
							all_suites={this.props.suites}
              showBuildingAmenitiesFirst
						/>
	        </Modal.Content>
	      </Modal>
	    )
		}
  }

	render() {
		return (
			<div style={comStyles().container}>
        <div style={comStyles().iconBox}>
          <img
            className='icon icons8-Temperature'
            width='75'
            height='75'
            src={temperatureIcon(this.state).icon}
          />
          <h5>{ temperatureIcon(this.state).text }</h5>
        </div>
        <div style={comStyles().iconBox}>
          <img
            className='icon icons8-Temperature'
            width='75'
            height='75'
            src={wifiIcon(this.state).icon}
          />
          <h5>{ wifiIcon(this.state).text }</h5>
        </div>
        <div style={comStyles().iconBox}>
          <img
            className='icon icons8-Temperature'
            width='75'
            height='75'
            src={electricityIcon(this.state).icon}
          />
          <h5>{ electricityIcon(this.state).text }</h5>
        </div>
        <div style={comStyles().iconBox}>
          <img
            className='icon icons8-Temperature'
            width='75'
            height='75'
            src={parkingIcon(this.state).icon}
          />
          <h5>{ parkingIcon(this.state).text }</h5>
        </div>
        <div
          onClick={() => this.toggleModal(true, 'building_amenities')}
          style={comStyles().iconBox_fullList}
        >
          <img
            className='icon icons8-Temperature'
            width='75'
            height='75'
            src={seeFullListIcon().icon}
          />
          <h5>{ seeFullListIcon().text }</h5>
        </div>
        {
          this.renderAppropriateModal(this.state.modal_name, this.state.context)
        }
			</div>
		)
	}
}

// defines the types of variables in this.props
BuildingQuickAmenitiesBar.propTypes = {
	history: PropTypes.object.isRequired,
  building: PropTypes.object.isRequired,
  building_amenities: PropTypes.array,
  suite_amenities: PropTypes.array,
  promise_array_of_suite_amenities_with_id: PropTypes.array,
}

// for all optional props, define a default value
BuildingQuickAmenitiesBar.defaultProps = {
  building_amenities: [],
  suite_amenities: [],
  promise_array_of_suite_amenities_with_id: []
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(BuildingQuickAmenitiesBar)

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
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-around',
      padding: '30px',
		},
    icon: {
      fontSize: '3rem',
      margin: 'auto',
    },
    iconBox: {
      display: 'flex',
      flexDirection: 'column',
      textAlign: 'center',
      flexWrap: 'wrap',
      width: '20%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    iconBox_fullList: {
       color: '#3498db',
       display: 'flex',
       flexDirection: 'column',
       textAlign: 'center',
       flexWrap: 'wrap',
       width: '20%',
       justifyContent: 'center',
       alignItems: 'center',
       fontWeight: 'bold',
       cursor: 'pointer',
    }
	}
}
