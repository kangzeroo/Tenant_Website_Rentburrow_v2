// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
  Dropdown,
} from 'semantic-ui-react'


class SuiteRoomSidebar extends Component {

  componentWillMount() {
    // console.log(this.props.building)
    // console.log(this.props.all_suites)
  }

  generateTopContextOptions() {
    // options = ['Building', 'Unit A', 'Basement']
    const x = [{
      key: 'Building',
      text: 'Building',
      value: JSON.stringify(this.props.building),
    }].concat(this.props.all_suites.map((suite) => {
      return {
        key: suite.suite_alias,
        text: suite.suite_alias,
        value: JSON.stringify(suite)
      }
    }))
    console.log(x)
    return x
  }

  generateBottomContextOptions() {
    /*
      options = [
        {
          topContext: 'Building',
          options: ['Desc', 'Outside', 'Hallways', 'Gym']
        },
        {
          topContext: 'Unit A',
          options: ['Desc', 'Kitchen', 'Room 1', 'Room 2']
        },
        {
          topContext: 'Basement',
          options: ['Desc', 'Kitchen', 'Room 1', 'Room 2']
        },
      ]
    */
    return []
  }

	render() {
		return (
			<div style={comStyles().container}>
				<h2>{ this.props.building.building_address }</h2>
        <Dropdown
          text={ this.props.topContextText }
          value={ this.props.topContextValue }
          onChange={(e, data) => {
            console.log(data)
            // this.props.changeTopContext({
            //   text: data.text,
            //   value: data.value
            // })
          }}
          selection
          options={this.generateTopContextOptions()} />
			</div>
		)
	}
}

// defines the types of variables in this.props
SuiteRoomSidebar.propTypes = {
	history: PropTypes.object.isRequired,
  building: PropTypes.object.isRequired,        // passed in, for populating topContextOptions
  all_suites: PropTypes.array.isRequired,       // passed in, for populating bottomContextOptions
  changeTopContext: PropTypes.func.isRequired,     // passed in, for changing topContext
  changeBottomContext: PropTypes.func.isRequired,     // passed in, for changing bottomContext
  topContextValue: PropTypes.string,           // passed in
  bottomContextValue: PropTypes.string,        // passed in
  topContextText: PropTypes.string,
  bottomContextText: PropTypes.string,
}

// for all optional props, define a default value
SuiteRoomSidebar.defaultProps = {
  topContext: {},
  bottomContext: {},
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(SuiteRoomSidebar)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
    topContextText: redux.selection.nav_top_context,
    bottomContextText: redux.selection.nav_bottom_context,
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
      width: '20%',
      minWidth: '300px',
      height: '80vh',
      maxHeight: '80vh',
      overflowY: 'scroll',
      backgroundColor: 'rgba(0,0,0,0.1)'
		}
	}
}
