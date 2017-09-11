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
  Button,
} from 'semantic-ui-react'
import { getAmenitiesForSpecificBuilding, getAmenitiesForSuite, getRoomsForSuite, } from '../../../api/building/building_api'


class SuiteRoomSidebar extends Component {

  constructor() {
    super()
    this.state = {
      menu_items: []
    }
  }

  componentWillMount() {
    this.loadBottomContextItems(this.props.topContextText, this.props.topContextValue)
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
    return x
  }

  generateBottomContextOptions(topContextText) {
    return this.state.menu_items.map((item) => {
      return (
        <Button
          key={item.key}
          onClick={() => this.props.changeBottomContext({
            text: item.text,
            value: JSON.stringify(item.value)
          })}
          content={item.text}
          style={bottomContextStyles(this.props.bottomContextText, item.text).item}
        />
      )
    })
  }

  loadSidebarItems(data) {
    const title = JSON.parse(data.value).suite_alias || 'Building'
    this.props.changeTopContext({
      text: title,
      value: data.value
    })
    this.loadBottomContextItems(title, data.value)
  }

  loadBottomContextItems(title, value) {
    console.log('loadBottomContextItems')
    if (title === 'Building') {
      getAmenitiesForSpecificBuilding({
        building_id: this.props.building.building_id,
      }).then((data) => {
        console.log(data)
        this.setState({
          menu_items: [
            {
              key: 'desc',
              text: 'Description',
              value: this.props.building
            },
          ].concat(data.map((d) => {
            const x = JSON.parse(d)
            return {
              key: x.amenity_alias,
              text: x.amenity_alias,
              value: x,
            }
          }))
        })
      })
    } else {
      const suite = JSON.parse(value)
      getRoomsForSuite({
        building_id: this.props.building.building_id,
        suite_id: suite.suite_id,
      }).then((data) => {
        this.setState({
          menu_items: [
            {
              key: 'desc',
              text: 'Description',
              value: suite,
            },
            {
              key: 'vr_tour',
              text: 'Virtual Tour',
              value: suite,
            },
          ].concat(data.map((d) => {
            const x = JSON.parse(d)
            return {
              key: x.room_code,
              text: x.room_alias ? `Room ${x.room_alias}` : `Room ${x.room_code}`,
              value: x,
            }
          }))
        })
        return getAmenitiesForSuite({
          building_id: this.props.building.building_id,
          suite_id: suite.suite_id,
        })
      }).then((data) => {
        this.setState({
          menu_items: this.state.menu_items.concat(data.map((d) => {
            const x = JSON.parse(d)
            return {
              key: x.amenity_alias,
              text: x.amenity_alias,
              value: x,
            }
          }))
        })
      })
    }
  }

	render() {
		return (
			<div style={comStyles().container}>
				<h2>{ this.props.building.building_address }</h2>
        <Dropdown
          text={ this.props.topContextText }
          value={ this.props.topContextValue }
          onChange={(e, data) => this.loadSidebarItems(data)}
          selection
          options={this.generateTopContextOptions()}
        />
        {
          this.generateBottomContextOptions(this.props.topContextText)
        }
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

const bottomContextStyles = (bottomContextText, thisItemText) => {
  let styles = {
    backgroundColor: 'white'
  }
  if (thisItemText === bottomContextText) {
    styles.backgroundColor = 'red'
  }
  return {
    item: {
      ...styles
    }
  }
}
