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
  saveSubletsToRedux,
  changeRentType,
} from '../../actions/search/search_actions'
import {
	querySubletsInArea,
  sortFBPosts,
} from '../../api/search/sublet_api'
import LeaseFilterCard from './LeaseFilterCard'
import SubletFilterCard from './SubletFilterCard'


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
        sortFBPosts({
          sort_by: value.value,
        })
        .then((sublets) => {
          this.props.saveSubletsToRedux(sublets.map(s => JSON.parse(s)))
        })
      } else {
        let sorted_buildings
        if (value.value === 'pricelow') {
          sorted_buildings = this.props.building_search_results.sort((a, b) => {
            let a_price
            let b_price
            if (isNaN(a.min_price)) {
              a_price = 0
            } else {
              a_price = parseInt(a.min_price, 10)
            }

            if (isNaN(b.min_price)) {
              b_price = 0
            } else {
              b_price = parseInt(b.min_price, 10)
            }
            return a_price - b_price
          })
        } else if (value.value === 'pricehigh') {
          sorted_buildings = this.props.building_search_results.sort((a, b) => {
            let a_price
            let b_price
            if (isNaN(a.min_price)) {
              a_price = 0
            } else {
              a_price = parseInt(a.min_price, 10)
            }

            if (isNaN(b.min_price)) {
              b_price = 0
            } else {
              b_price = parseInt(b.min_price, 10)
            }
            return b_price - a_price
          })
        } else if (value.value === 'datenew') {
          sorted_buildings = this.props.building_search_results.sort((a, b) => {
            return Date.parse(a.created_at) - Date.parse(b.created_at)
          })
        } else if (value.value === 'dateold') {
          sorted_buildings = this.props.building_search_results.sort((a, b) => {
            return Date.parse(b.created_at) - Date.parse(a.created_at)
          })
        }
        this.props.saveBuildingsToRedux(sorted_buildings)
        // sortBuildings({
        //   sort_by: value.value
        // })
        // .then((buildings) => {
        //   this.props.saveBuildingsToRedux(buildings)
        // })
      }
    })
  }

  handleRentalLengthChange(e, value) {
    if (value.value === 'fourmonth') {
      querySubletsInArea({
        ...this.props.current_gps_center,
        filterParams: this.props.sublet_filter_params,
      }).then((data) => {
        this.props.saveSubletsToRedux(data.map(s => JSON.parse(s)))
        this.props.history.push('/sublet')
        this.props.changeRentType('sublet')
  		})
    } else {
      this.props.history.push('/lease')
      this.props.changeRentType('lease')
    }
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
                onClick={() => this.setState({ show_search_panel: !this.state.show_search_panel })}
                content='FILTER'
              />
              <Dropdown
                placeholder='Rental Length'
                floating
                selection
                options={[
                  { key: 'fourmonth', value: 'fourmonth', text: '4 Months Sublet' },
                  { key: 'eightmonth', value: 'eightmonth', text: '8 Months Lease' },
                  { key: 'twelvemonth', value: 'twelvemonth', text: '12 Months Lease' },
                ]}
                onChange={(e, value) => this.handleRentalLengthChange(e, value)}
              />
            </div>
            <h3>
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
  building_search_results: PropTypes.array.isRequired,
  sublet_search_results: PropTypes.array.isRequired,
  saveBuildingsToRedux: PropTypes.func.isRequired,
  saveSubletsToRedux: PropTypes.func.isRequired,
  changeRentType: PropTypes.func.isRequired,
  rent_type: PropTypes.string.isRequired,
	current_gps_center: PropTypes.object.isRequired,
  lease_filter_params: PropTypes.object.isRequired,
  sublet_filter_params: PropTypes.object.isRequired,
	rent_type: PropTypes.string.isRequired,
	saveBuildingsToRedux: PropTypes.func.isRequired,
	saveSubletsToRedux: PropTypes.func.isRequired,
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
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
    saveBuildingsToRedux,
    saveSubletsToRedux,
    changeRentType,
  	saveBuildingsToRedux,
  	saveSubletsToRedux,
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
