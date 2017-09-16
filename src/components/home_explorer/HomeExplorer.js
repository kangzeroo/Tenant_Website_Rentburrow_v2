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
import HomeExplorerCanvas from './navigation/HomeExplorerCanvas'
import HomeExplorerSidebar from './navigation/HomeExplorerSidebar'
import { selectTopTitle, selectBottomTitle } from '../../actions/selection/selection_actions'


class HomeExplorer extends Component {

  constructor() {
    super()
    this.state = {
      topContextValue: null,        // 'building', 'unit A', 'unit B'
      bottomContextValue: null,     // ['desc', 'outside', 'hallway', 'gym', ...otherAmenities], ['desc', 'kitchen', 'room 1', ...otherAmenities]  /* room 1 is not an amenity but in the same context level */
    }
  }

  componentWillMount() {
    if (this.props.current_suite.suite_id) {
      this.props.selectTopTitle(this.props.current_suite.suite_alias)
      console.log(this.props.current_suite)
      this.setState({
        topContextValue: JSON.stringify(this.props.current_suite),
        bottomContextValue: '',
      })
    } else if (this.props.showBuildingAmenitiesFirst) {
      this.props.selectTopTitle('Building')
      console.log('showBuildingAmenitiesFirst')
      this.setState({
        topContextValue: JSON.stringify(this.props.building),
        bottomContextValue: '',
      })
    }
  }

  changeTopContext(top_context) {
    this.props.selectTopTitle(top_context.text)
    this.setState({
      topContextValue: top_context.value,
    })
  }

  changeBottomContext(bottom_context) {
    this.props.selectBottomTitle(bottom_context.text)
    console.log(typeof bottom_context.value)
    this.setState({
      bottomContextValue: bottom_context.value,
    })
  }

	render() {
		return (
			<div style={comStyles().container}>
        {
          this.state.topContextValue
          ?
  				<HomeExplorerSidebar
            building={this.props.building}
            current_suite={this.props.current_suite}
            all_suites={this.props.all_suites}
            changeTopContext={(top_context) => this.changeTopContext(top_context)}
            changeBottomContext={(bottom_context) => this.changeBottomContext(bottom_context)}
            topContextValue={this.state.topContextValue}
            bottomContextValue={this.state.bottomContextValue}
            showVirtualTourFirst={this.props.showVirtualTourFirst}
            showBuildingAmenitiesFirst={this.props.showBuildingAmenitiesFirst}
          />
          :
          null
        }
        {
          this.state.bottomContextValue
          ?
          <HomeExplorerCanvas
            building={this.props.building}
            topContextValue={this.state.topContextValue}
            bottomContextValue={this.state.bottomContextValue}
          />
          :
          null
        }
			</div>
		)
	}
}

// defines the types of variables in this.props
HomeExplorer.propTypes = {
	history: PropTypes.object.isRequired,
  building: PropTypes.object.isRequired,        // passed in
  current_suite: PropTypes.object,   // passed in
  all_suites: PropTypes.array,       // passed in
  selectTopTitle: PropTypes.func.isRequired,
  selectBottomTitle: PropTypes.func.isRequired,
  showVirtualTourFirst: PropTypes.bool,         // passed in
  showBuildingAmenitiesFirst: PropTypes.bool,   // passed in
}

// for all optional props, define a default value
HomeExplorer.defaultProps = {
  showVirtualTourFirst: false,
  showBuildingAmenitiesFirst: false,
  current_suite: {},
  all_suites: [],
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(HomeExplorer)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
    selectTopTitle,
    selectBottomTitle,
	})(RadiumHOC)
)

// ===============================

// the JS function that returns Radium JS styling
const comStyles = () => {
	return {
		container: {
      display: 'flex',
      flexDirection: 'row',
      height: '80vh',
		}
	}
}
