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
import {
  getAmenitiesForSpecificBuilding,
  getAmenitiesForSuite,
  getRoomsForSuite,
  getSuiteInfo,
  getImagesForSpecificBuilding,
} from '../../../api/building/building_api'
import {
  shortenAddress,
} from '../../../api/general/general_api'
import { renameRoom, renameSuite } from '../../../api/general/renaming_api'


class HomeExplorerSidebar extends Component {

  constructor() {
    super()
    this.state = {
      menu_items: []
    }
  }

  componentWillMount() {
    // console.log(this.props.topContextText, this.props.topContextValue)
    // console.log(this.props.building, this.props.all_suites)
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
        text: renameSuite(suite.suite_alias),
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
      key: data.key,
      text: title,
      value: data.value
    })
    this.loadBottomContextItems(title, data.value)
  }

  loadBottomContextItems(title, value) {
    let buildingImages = '[]'
    // CASE WHERE WE WANT TO SEE BUILDING INFO
    if (title === 'Building') {
      // Step 1: Get images for this building
      getImagesForSpecificBuilding({
  			building_id: this.props.building.building_id,
  		}).then((images) => {
        // Step 2: Save those images to the bottomContext
        buildingImages = JSON.stringify(images.map((s) => JSON.parse(s)))
        this.props.changeBottomContext({
          text: 'Common Area',
          value: buildingImages
        })
        // Step 3a: Get amenities for this building
        return getAmenitiesForSpecificBuilding({
          building_id: this.props.building.building_id,
        })
  		})
      .then((data) => {
        if (this.props.showBuildingAmenitiesFirst) {
          this.props.changeBottomContext({
            key: 'am',
            text: 'Building Amenities',
            value: JSON.stringify(data.map((d) => {
              return JSON.parse(d)
            }))
          })
        }
        // Step 3b: Save those amenities to the list of bottomContext options
        this.setState({
          menu_items: [
            {
              key: 'desc',
              text: 'Common Area',
              value: JSON.parse(buildingImages)
            },
          ].concat([
            {
              key: 'am',
              text: 'Building Amenities',
              value: data.map((d) => {
                return JSON.parse(d)
              })
            }
          ])
        })
      })
    } else {
      // CASE WHERE WE WANT TO SEE SUITE INFO
      // step 0: we have basic suite info
      let suite = JSON.parse(value)
      // step 1: get additional suite info from db
      getSuiteInfo({
  			building_id: this.props.building.building_id,
  			suite_id: suite.suite_id,
  		}).then((data) => {
        // step 2: combine basic+additional suite info and save it to the bottomContext of parent (so that we can navigate around)
        suite = {
          ...suite,
          ...JSON.parse(data),
        }
        if (this.props.showVirtualTourFirst) {
          this.props.changeBottomContext({
            text: 'Virtual Tour',
            value: JSON.stringify(suite)
          })
        } else {
          this.props.changeBottomContext({
            text: 'Common Area',
            value: JSON.stringify(suite)
          })
        }
        // FROM HERE ONWARDS WE ARE SIMPLY POPULATING THE bottomContext OPTIONS
        // step 3a: get the rooms for this suite, also so that we can use it for navigation
        return getRoomsForSuite({
          building_id: this.props.building.building_id,
          suite_id: suite.suite_id,
        })
  		}).then((data) => {
        // step 3b: save those rooms to this.state so that we can use it for navigation. combine with some default nav options as well
        this.setState({
          menu_items: [
            {
              key: 'vr_tour',
              text: 'Virtual Tour',
              value: suite,
            },
            {
              key: 'desc',
              text: 'Common Area',
              value: suite,
            },
          ].concat(data.map((d) => {
            const x = JSON.parse(d)
            return {
              key: x.room_code,
              text: x.room_alias ? renameRoom(x.room_alias) : renameRoom(x.room_code),
              value: x,
            }
          }))
        })
        // step 4: get amenities for this suite, so that we can also use it for navigation
        return getAmenitiesForSuite({
          building_id: this.props.building.building_id,
          suite_id: suite.suite_id,
        })
      }).then((data) => {
        this.setState({
          menu_items: this.state.menu_items.concat([
            {
              key: 'am',
              text: 'Amenities',
              value: data.map((d) => {
                const x = JSON.parse(d)
                return {
                  key: x.amenity_alias,
                  text: x.amenity_alias,
                  value: x,
                }
              })
            }
         ])
        })
      })
    }
  }

	render() {
		return (
			<div style={comStyles().container}>
        <div style={comStyles().title} >
				    <h2>{ this.props.building.building_alias }</h2>
        </div>
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
HomeExplorerSidebar.propTypes = {
	history: PropTypes.object.isRequired,
  building: PropTypes.object.isRequired,        // passed in, for populating topContextOptions
  all_suites: PropTypes.array.isRequired,       // passed in, for populating bottomContextOptions
  changeTopContext: PropTypes.func.isRequired,     // passed in, for changing topContext
  changeBottomContext: PropTypes.func.isRequired,     // passed in, for changing bottomContext
  topContextValue: PropTypes.string,           // passed in
  bottomContextValue: PropTypes.string,        // passed in
  topContextText: PropTypes.string,
  bottomContextText: PropTypes.string,
  showVirtualTourFirst: PropTypes.bool,         // passed in
  showBuildingAmenitiesFirst: PropTypes.bool,   // passed in
  showBuildingCommonAreaFirst: PropTypes.bool,  // passed in
}

// for all optional props, define a default value
HomeExplorerSidebar.defaultProps = {
  topContext: {},
  bottomContext: {},
  showVirtualTourFirst: false,
  showBuildingAmenitiesFirst: false,
  showBuildingCommonAreaFirst: false,
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(HomeExplorerSidebar)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
    topContextText: redux.selection.nav_top_title,
    bottomContextText: redux.selection.nav_bottom_title,
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
      width: '100px',
      minWidth: '220px',
      height: '80vh',
      maxHeight: '80vh',
      overflowY: 'scroll',
      backgroundColor: 'rgba(153,204,255,0.2)',
		},
    title: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '40px',
    }
	}
}

const bottomContextStyles = (bottomContextText, thisItemText) => {
  let styles = {
    backgroundColor: 'white'
  }
  if (thisItemText === bottomContextText) {
    styles.backgroundColor = 'rgba(153,204,255,0.8)'
  }
  return {
    item: {
      ...styles
    }
  }
}
