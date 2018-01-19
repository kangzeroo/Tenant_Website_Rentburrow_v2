// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
  Header,
  Tab,
  Segment,
  Dimmer,
  Loader,
  Message,
} from 'semantic-ui-react'
import { getAllAvailableTours, } from '../../api/tour/tour_api'
import {
	queryBuildingsInArea,
} from '../../api/search/search_api'
import {
	saveBuildingsToRedux,
} from '../../actions/search/search_actions'
import AllUpcomingToursTab from './tabs/AllUpcomingToursTab'
import MyUpcomingToursTab from './tabs/MyUpcomingToursTab'

class ToursPage extends Component {

  constructor() {
    super()
    this.state = {
      tours: [],

      tours_loaded: false,
      no_tours: false,
    }
  }

  componentWillMount() {
    this.refreshTours()
  }

  refreshTours() {
    if (this.props.buildings && this.props.buildings.length === 0) {
      queryBuildingsInArea()
      .then((data) => {
        this.props.saveBuildingsToRedux(data)
        return getAllAvailableTours()
      })
      .then((data) => {
        if (data && data.length > 0) {
          this.setState({
            tours: data,
            tours_loaded: true,
          })
        } else {
          this.setState({
            tours_loaded: true,
            no_tours: true,
          })
        }
      })
    } else {
      getAllAvailableTours()
      .then((data) => {
        if (data && data.length > 0) {
          this.setState({
            tours: data,
            tours_loaded: true,
          })
        } else {
          this.setState({
            tours_loaded: true,
            no_tours: true,
          })
        }
      })
    }
  }

  renderTabs() {
    return [
      { index: 0, menuItem: 'All Upcoming Tours', render: () => <Tab.Pane attached={false}>{ this.renderUpcomingTours() }</Tab.Pane>},
      { index: 1, menuItem: 'My Upcoming Tours', render: () => <Tab.Pane attached={false}>{ this.renderMyUpcomingTours() }</Tab.Pane>}
    ]
  }

  renderUpcomingTours() {
    if (this.state.tours_loaded && !this.state.no_tours) {
      return (
        <AllUpcomingToursTab
          tours={this.state.tours}
          buildings={this.props.buildings}
        />
      )
    } else if (this.state.tours_loaded && this.state.no_tours) {
      return (
        <div style={comStyles().loadingContainer} >
          <Message warning>
            <Message.Header>{`There are no upcoming tours`}</Message.Header>
            <p>{`Message some properties and set up a tour, or join a tour`}</p>
          </Message>
        </div>
      )
    } else if (!this.state.tours_loaded) {
      return (
        <Segment style={comStyles().loadingContainer}>
          <Dimmer active inverted>
            <Loader inverted content='Loading' />
          </Dimmer>
        </Segment>
      )
    }
  }

  renderMyUpcomingTours() {
    return (
      <MyUpcomingToursTab
        buildings={this.props.buildings}
      />
    )
  }

	render() {
		return (
			<div id='ToursPage' style={comStyles().container}>
        <Header as='h2' icon='calendar check' content={`${this.state.tours.length} Upcoming Tours`} subheader='You can join an upcoming tour' />
        <Tab menu={{ secondary: true }} panes={this.renderTabs()} />
			</div>
		)
	}
}

// defines the types of variables in this.props
ToursPage.propTypes = {
	history: PropTypes.object.isRequired,
  saveBuildingsToRedux: PropTypes.func.isRequired,
  buildings: PropTypes.array.isRequired,
}

// for all optional props, define a default value
ToursPage.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(ToursPage)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
    buildings: redux.search.buildings,
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
      margin: '20px',
      minHeight: '93vh'
		},
    loadingContainer: {
      width: '100%',
      minHeight: '300px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',

    }

	}
}
