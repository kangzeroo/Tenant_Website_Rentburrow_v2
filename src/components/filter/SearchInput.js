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
  Dropdown,
  Icon
} from 'semantic-ui-react'
import { searchByString } from '../../actions/search/search_actions'


class SearchInput extends Component {

	render() {
		return (
			<div style={comStyles().container}>
				<Input
          value={this.props.search_string}
          onChange={(e) => this.props.searchByString(e.target.value)}
          icon='search'
          iconPosition='left'
          placeholder='Search Building...'
          action={
            <Dropdown
              trigger={(<span>
                          <Icon name='world'/> Waterloo, ON
                        </span>)}
              button
              item
              options={[
                { key: 'waterloo', text: 'Waterloo, ON', value: 'waterloo' }
              ]}
              defaultValue='waterloo'
            />
          }
        />
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
      padding: '4px 0px 4px 0px',
      margin: '0px 0px 0px 20px',
		}
	}
}
