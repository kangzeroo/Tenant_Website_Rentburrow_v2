// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import Radium from 'radium'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
  Modal,
  Dropdown,
  Button,
  Card,
} from 'semantic-ui-react'
import {
  shortenAddress,
  renderProcessedImage,
  renderProcessedThumbnail,
} from '../../api/general/general_api'
import {
  sortBuildings,
} from '../../api/filter/filter_api'
import {
  saveBuildingsToRedux,
  saveSortedBuildingsToRedux,
  saveSubletsToRedux,
  changeRentType,
} from '../../actions/search/search_actions'
import {
	querySubletsInArea,
} from '../../api/search/sublet_api'
import LeaseFilterCard from './LeaseFilterCard'
import SubletFilterCard from './SubletFilterCard'
import { collectIntel } from '../../actions/intel/intel_actions'
import { STUDENT_PREFERENCES } from '../../api/intel/dynamodb_tablenames'


class FilterBar extends Component {

  constructor() {
    super()
    this.state = {
      show_search_panel: false,
      toggle_modal: false,
      modal_name: '',
      context: {},

      sort_by: '',
      rental_length: '',
    }
  }

  toggleModal(bool, attr, context) {
		this.setState({
      toggle_modal: bool,
      modal_name: attr,
      context,
    })
  }

  closePanel() {
    this.setState({
      show_search_panel: false,
    })
  }

	renderAppropriateModal(modal_name, context) {
		if (modal_name === 'advanced') {
	    return (
	      <Modal
					dimmer
					open={this.state.toggle_modal}
					onClose={() => this.toggleModal(false)}
					closeIcon
          inverted
					size='fullscreen'
				>
	      </Modal>
	    )
		}
  }

  handleSortChange(e, value) {
    this.setState({
      sort_by: value.value
    }, () => {
      if (this.props.rent_type === 'sublet') {
        let sorted_sublets
        if (value.value === 'pricelow') {
          sorted_sublets = this.props.sublet_search_results.sort((a, b) => {
            let a_price
            let b_price
            if (a.price === 0) {
              a_price = 99999
            } else {
              a_price = parseInt(a.price, 10)
            }

            if (b.price === 0) {
              b_price = 99999
            } else {
              b_price = parseInt(b.price, 10)
            }
            return a_price - b_price
          })
        } else if (value.value === 'pricehigh') {
          sorted_sublets = this.props.sublet_search_results.sort((a, b) => {
            let a_price
            let b_price
            if (a.price === 0) {
              a_price = 0
            } else {
              a_price = parseInt(a.price, 10)
            }

            if (b.price === 0) {
              b_price = 0
            } else {
              b_price = parseInt(b.price, 10)
            }
            return b_price - a_price
          })
        } else if (value.value === 'datenew') {
          sorted_sublets = this.props.sublet_search_results.sort((a, b) => {
            return b.posted_date - a.posted_date
          })
        } else if (value.value === 'dateold') {
          sorted_sublets = this.props.sublet_search_results.sort((a, b) => {
            return a.posted_date - b.posted_date
          })
        }
        this.props.saveSubletsToRedux(sorted_sublets)
      } else {
        let sorted_buildings
        if (value.value === 'pricelow') {
          sorted_buildings = this.props.building_search_results.sort((a, b) => {
            let a_price
            let b_price
            if (isNaN(a.min_price)) {
              a_price = 99999
            } else {
              a_price = parseInt(a.min_price, 10)
            }

            if (isNaN(b.min_price)) {
              b_price = 99999
            } else {
              b_price = parseInt(b.min_price, 10)
            }
            return a_price - b_price
          })
        } else if (value.value === 'pricehigh') {
          sorted_buildings = this.props.building_search_results.sort((a, b) => {
            let a_price
            let b_price
            if (isNaN(a.max_price)) {
              a_price = 0
            } else {
              a_price = parseInt(a.max_price, 10)
            }

            if (isNaN(b.max_price)) {
              b_price = 0
            } else {
              b_price = parseInt(b.max_price, 10)
            }
            return b_price - a_price
          })
        } else if (value.value === 'dateold') {
          sorted_buildings = this.props.building_search_results.sort((a, b) => {
            return Date.parse(a.created_at) - Date.parse(b.created_at)
          })
        } else if (value.value === 'datenew') {
          sorted_buildings = this.props.building_search_results.sort((a, b) => {
            return Date.parse(b.created_at) - Date.parse(a.created_at)
          })
        }
        this.props.saveSortedBuildingsToRedux(sorted_buildings)
      }
    })
  }

  handleRentalLengthChange(e, value) {
    if (value.value === 'sublet') {
      this.props.history.push('/sublet')
      this.props.changeRentType('sublet')
    } else {
      this.props.history.push('/lease')
      this.props.changeRentType('lease')
    }
    this.props.collectIntel({
      'TableName': STUDENT_PREFERENCES,
      'Item': {
        'ACTION': 'CHANGED_RENT_TYPE',
        'DATE': new Date().getTime(),
        'RENT_TYPE': value.value,
        'USER_ID': this.props.tenant_profile.tenant_id || 'NONE',
        'FINGERPRINT': this.props.fingerprint,
      }
    })
  }

  renderFilterCard(rent_type) {
    if (rent_type === 'sublet') {
      return (
        <SubletFilterCard
          closeFilterCard={() => this.closePanel()}
        />
      )
    } else {
      return (
        <LeaseFilterCard
          closeFilterCard={() => this.closePanel()}
          buildings={this.props.buildings}
        />
      )
    }
  }

	render() {
    const numberOfPropertiesShown = this.props.rent_type === 'sublet' ? this.props.sublet_search_results.length : this.props.building_search_results.length
		return (
			<div style={comStyles().container}>
        {
          this.state.show_search_panel
          ?
          this.renderFilterCard(this.props.rent_type)
          :
          <div style={comStyles().searchbar}>
            <div>
              <Button
                primary
                onClick={() => this.setState({ show_search_panel: !this.state.show_search_panel })}
                content='FILTER'
              />
              <Dropdown
                selection
                placeholder='Leases or Sublets'
                floating
                options={[
                  { key: 'lease', value: 'lease', text: 'Leases' },
                  { key: 'sublet', value: 'sublet', text: 'Sublets' },
                ]}
                onChange={(e, value) => this.handleRentalLengthChange(e, value)}
              />
            </div>
            <h3 style={comStyles().sortMargin}>
              {
                this.props.rent_type === 'sublet'
                ?
                `Showing ${numberOfPropertiesShown} Facebook Sublet${numberOfPropertiesShown > 1 ? 's' : ''}`
                :
                `Showing ${numberOfPropertiesShown} Propert${numberOfPropertiesShown > 1 ? 'ies' : 'y'}`
              }
            </h3>
            <Dropdown
              placeholder='Sort By'
              selection
              options={[
                        { key: 'pricelow', value: 'pricelow', text: 'Price: Low to High' },
                        { key: 'pricehigh', value: 'pricehigh', text: 'Price: High to Low' },
                        { key: 'datenew', value: 'datenew', text: 'Date: Newest to Oldest' },
                        { key: 'dateold', value: 'dateold', text: 'Date: Oldest to Newest' },
                      ]}

              onChange={(e, value) => this.handleSortChange(e, value)}
            />
          </div>
        }
        {
          this.renderAppropriateModal(this.state.modal_name, this.state.context)
        }
			</div>
		)
	}
}

// defines the types of variables in this.props
FilterBar.propTypes = {
  history: PropTypes.object.isRequired,
  building_search_results: PropTypes.array.isRequired,
  sublet_search_results: PropTypes.array.isRequired,
  saveBuildingsToRedux: PropTypes.func.isRequired,
  saveSortedBuildingsToRedux: PropTypes.func.isRequired,
  saveSubletsToRedux: PropTypes.func.isRequired,
  changeRentType: PropTypes.func.isRequired,
  rent_type: PropTypes.string.isRequired,
	current_gps_center: PropTypes.object.isRequired,
  lease_filter_params: PropTypes.object.isRequired,
  sublet_filter_params: PropTypes.object.isRequired,
  collectIntel: PropTypes.func.isRequired,
  fingerprint: PropTypes.string.isRequired,
  tenant_profile: PropTypes.object.isRequired,
}

// for all optional props, define a default value
FilterBar.defaultProps = {
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(FilterBar)


// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
		building_search_results: redux.search.building_search_results,
    sublet_search_results: redux.search.sublet_search_results,
    rent_type: redux.filter.rent_type,
		current_gps_center: redux.filter.current_gps_center,
    lease_filter_params: redux.filter.lease_filter_params,
    sublet_filter_params: redux.filter.sublet_filter_params,
    tenant_profile: redux.auth.tenant_profile,
    fingerprint: redux.auth.browser_fingerprint,
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
    saveBuildingsToRedux,
    saveSortedBuildingsToRedux,
    saveSubletsToRedux,
    changeRentType,
    collectIntel,
	})(RadiumHOC)
)

// ===============================

// the JS function that returns Radium JS styling
const comStyles = () => {
	return {
		container: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      // minHeight: '500px',
      // maxHeight: '500px',\
      padding: '10px',
      height: 'auto',
		},
    sortMargin: {
      margin: '20px'
    },
    searchbar: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
    },
	}
}
