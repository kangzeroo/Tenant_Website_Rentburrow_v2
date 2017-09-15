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
 } from '../../actions/search/search_actions'
import FilterCard from './FilterCard'


class FilterBar extends Component {

  constructor() {
    super()
    this.state = {
      show_search_panel: false,
      toggle_modal: false,
      modal_name: '',
      context: {},

      sort_by: '',
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

  handleChange(e, value) {
    this.setState({
      sort_by: value.value
    }, () => {
      sortBuildings({
        sort_by: value.value
      })
      .then((buildings) => {
        this.props.saveBuildingsToRedux(buildings)
      })
    })
  }


	render() {
		return (
			<div style={comStyles().container}>
        {
          this.state.show_search_panel
          ?
          <FilterCard
            closeFilterCard={() => this.closePanel()}
          />
          :
          <div style={comStyles().searchbar}>
            <Button
              onClick={() => this.setState({ show_search_panel: !this.state.show_search_panel })}
              content='FILTER'
            />
            <h5>{ `Showing ${this.props.search_results.length} buildings` }</h5>
            <Dropdown
            placeholder='Sort By'
            selection
            options={[
                      { key: 'pricelow', value: 'pricelow', text: 'Price: Low to High' },
                      { key: 'pricehigh', value: 'pricehigh', text: 'Price: High to Low' },
                      { key: 'date', value: 'date', text: 'Date' },
                    ]}

            onChange={(e, value) => this.handleChange(e, value)}
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
  search_results: PropTypes.array.isRequired,
  saveBuildingsToRedux: PropTypes.func.isRequired,
}

// for all optional props, define a default value
FilterBar.defaultProps = {
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(FilterBar)


// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
		search_results: redux.search.search_results,
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
    saveBuildingsToRedux,
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
