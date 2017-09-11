// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {

} from 'semantic-ui-react'
import SuiteRoomCanvas from './navigation/SuiteRoomCanvas'
import SuiteRoomSidebar from './navigation/SuiteRoomSidebar'
import { selectTopContext, selectBottomContext } from '../../actions/selection/selection_actions'


class SuiteRoomBrowser extends Component {

  constructor() {
    super()
    this.state = {
      topContextValue: '{}',        // 'building', 'unit A', 'unit B'
      bottomContextValue: '{}',     // ['desc', 'outside', 'hallway', 'gym', ...otherAmenities], ['desc', 'kitchen', 'room 1', ...otherAmenities]  /* room 1 is not an amenity but in the same context level */
    }
  }

  componentWillMount() {
    this.props.selectTopContext(this.props.current_suite.suite_alias)
    this.setState({
      topContextValue: JSON.stringify(this.props.current_suite),
      bottomContextValue: '',
    })
  }

  changeTopContext(top_context) {
    this.props.selectTopContext(top_context.text)
    this.setState({
      topContextValue: top_context.value,
    })
  }

  changeBottomContext(bottom_context) {
    this.props.selectBottomContext(bottom_context.text)
    this.setState({
      bottomContextValue: bottom_context.value,
    })
  }

	render() {
		return (
			<div style={comStyles().container}>
				<SuiteRoomSidebar
          building={this.props.building}
          current_suite={this.props.current_suite}
          all_suites={this.props.all_suites}
          changeTopContext={(top_context) => this.changeTopContext(top_context)}
          changeBottomContext={(bottom_context) => this.changeBottomContext(bottom_context)}
          topContextValue={this.state.topContextValue}
          bottomContextValue={this.state.bottomContextValue}
        />
        <SuiteRoomCanvas
          topContextValue={this.state.topContextValue}
          bottomContextValue={this.state.bottomContextValue}
        />
			</div>
		)
	}
}

// defines the types of variables in this.props
SuiteRoomBrowser.propTypes = {
	history: PropTypes.object.isRequired,
  building: PropTypes.object.isRequired,        // passed in
  current_suite: PropTypes.object.isRequired,   // passed in
  all_suites: PropTypes.array.isRequired,       // passed in
  selectTopContext: PropTypes.func.isRequired,
  selectBottomContext: PropTypes.func.isRequired,
}

// for all optional props, define a default value
SuiteRoomBrowser.defaultProps = {
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(SuiteRoomBrowser)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
    selectTopContext,
    selectBottomContext,
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
