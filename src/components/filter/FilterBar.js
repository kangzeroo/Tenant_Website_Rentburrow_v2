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
import FilterCard from './FilterCard'


class FilterBar extends Component {

  constructor() {
    super()
    this.state = {
      show_search_panel: false,
      toggle_modal: false,
      modal_name: '',
      context: {},
    }
  }

  toggleModal(bool, attr, context) {
		this.setState({
      toggle_modal: bool,
      modal_name: attr,
      context,
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

	render() {
		return (
			<div style={comStyles().container}>
        <div style={comStyles().searchbar}>
          <Button
            onClick={() => this.setState({ show_search_panel: !this.state.show_search_panel })}
            content={this.state.show_search_panel ? 'CLOSE' : 'FILTER'}
            icon={this.state.show_search_panel ? 'close' : 'filter'}
          />
          <h5>{ `Showing ${this.props.search_results.length} matching buildings` }</h5>
          <div style={comStyles().right}>
            <h4>Sort By</h4>
            <Dropdown placeholder='Most Recent' search selection options={[
              { key: 'price', value: 'price', text: 'Price' },
              { key: 'rooms', value: 'rooms', text: 'Rooms' },
              { key: 'date', value: 'date', text: 'Date' },
            ]} />
          </div>
        </div>
        {
          this.state.show_search_panel
          ?
          <FilterCard />
          :
          null
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
		},
    searchbar: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      width: '100%',
    },
    right: {
      display: 'flex',
      flexDirection: 'row',
      position: 'absolute',
      right: '0px',
    }
	}
}
