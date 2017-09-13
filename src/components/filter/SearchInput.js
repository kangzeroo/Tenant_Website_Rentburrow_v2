// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
  Input,
} from 'semantic-ui-react'
import { searchByString } from '../../actions/search/search_actions'


class SearchInput extends Component {

	render() {
		return (
			<div style={comStyles().container}>
				<Input value={this.props.search_string} onChange={(e) => this.props.searchByString(e.target.value)} icon='search' placeholder='Search by name or address' />
        <p>in Waterloo, ON</p>
			</div>
		)
	}
}

// defines the types of variables in this.props
SearchInput.propTypes = {
	history: PropTypes.object.isRequired,
  search_string: PropTypes.string,
  searchByString: PropTypes.func.isRequired,
}

// for all optional props, define a default value
SearchInput.defaultProps = {
  search_string: '',
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(SearchInput)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
    search_string: redux.search.search_string,
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
    searchByString,
	})(RadiumHOC)
)

// ===============================

// the JS function that returns Radium JS styling
const comStyles = () => {
	return {
		container: {
      display: 'flex',
      flexDirection: 'row',
		}
	}
}
