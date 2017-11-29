// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
  Dimmer,
  Loader,
  Tab,
} from 'semantic-ui-react'


class VirtualTourCanvas extends Component {

  componentDidMount() {
    this.setState({
      vr_tour_height: document.getElementById('VirtualTourCanvas').clientHeight
    })
    // console.log(this.props.istaging_url)
    // console.log(this.props.iguide_url)
  }

  renderVirtualTour_iStaging(link) {
    return (
      <iframe width='100%' height={`${this.state.vr_tour_height}px`} src={link} frameBorder='0' allowFullScreen></iframe>
    )
  }

  renderVirtualTour_Matterport(link) {
    return (
      <iframe width='100%' height={`${this.state.vr_tour_height}px`} src={link} allowFullScreen></iframe>
    )
  }

	renderVirtualTour_iGuide(link) {
    return (
      <iframe width='100%' height={`${this.state.vr_tour_height}px`} src={link} allowFullScreen></iframe>
    )
  }

  renderVirtualTour_Video(link) {
    const video_id = link.split('/watch?v=')[1]
    const embedded_url = `https://www.youtube.com/embed/${video_id}?autoplay=1`
    return (
      <iframe
        width='100%'
        height={`100%`}
        type='text/html'
        src={embedded_url}
        frameBorder='0'
        allowFullScreen
      />
    )
  }

	render() {
    const panes = []
    if (this.props.istaging_url) {
      panes.push({
        menuItem: 'Rentburrow Tour',
        render: () => (
          <Tab.Pane attached={false} style={comStyles(this.state.vr_tour_height).vrTour}>
            { this.renderVirtualTour_iStaging(this.props.istaging_url) }
          </Tab.Pane>
        )
      })
    }
    if (this.props.matterport_url) {
      panes.push({
        menuItem: 'Matterport Tour',
        render: () => (
          <Tab.Pane attached={false} style={comStyles(this.state.vr_tour_height).vrTour}>
            { this.renderVirtualTour_Matterport(this.props.matterport_url) }
          </Tab.Pane>
        )
      })
    }
    if (this.props.iguide_url) {
      panes.push({
        menuItem: 'iGuide Tour',
        render: () => (
          <Tab.Pane attached={false} style={comStyles(this.state.vr_tour_height).vrTour}>
            { this.renderVirtualTour_iGuide(this.props.iguide_url) }
          </Tab.Pane>
        )
      })
    }
    if (this.props.video_url) {
      panes.push({
        menuItem: 'Video Tour',
        render: () => (
          <Tab.Pane attached={false} style={comStyles(this.state.vr_tour_height).vrTour}>
            { this.renderVirtualTour_Video(this.props.video_url) }
          </Tab.Pane>
        )
      })
    }
		return (
			<div id='VirtualTourCanvas' style={comStyles().container}>
        {
          this.props.istaging_url || this.props.iguide_url || this.props.video_url || this.props.matterport_url
          ?
          <Tab panes={panes} />
          :
          <div style={comStyles().vrTour}>
            {
              this.props.istaging_url || this.props.iguide_url || this.props.matterport_url || this.props.video_url
              ?
              <div style={comStyles().hidden_loading}>
                <img src='https://s3.amazonaws.com/rentburrow-static-assets/Loading+Icons/loading-blue-clock.gif' width='50px' height='auto' />
              </div>
              :
              <div style={comStyles().hidden_loading}>
                <h2>There is no virtual tour available for this unit. We are booking a filming with the landlord.</h2>
              </div>
            }
          </div>
        }
			</div>
		)
	}
}

// defines the types of variables in this.props
VirtualTourCanvas.propTypes = {
	history: PropTypes.object.isRequired,
  istaging_url: PropTypes.string,        // passed in
  iguide_url: PropTypes.string,         // passed in
  video_url: PropTypes.string,          // passed in
  matterport_url: PropTypes.string,     // passed in
}

// for all optional props, define a default value
VirtualTourCanvas.defaultProps = {
  istaging_url: null,
  iguide_url: null,
  video_url: null,
  matterport_url: null,
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(VirtualTourCanvas)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {

	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {

	})(RadiumHOC)
)

// ===============================

// the JS function that returns Radium JS styling
const comStyles = (vr_tour_height) => {
	return {
		container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
		},
    vrTour: {
      display: 'flex',
      flexDirection: 'column',
      height: vr_tour_height ? `${vr_tour_height-50}px` : '100%',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
    },
    hidden_loading: {
      position: 'absolute',
      // zIndex: 5,
      minWidth: '100%',
      minHeight: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
    },
    visible_virtual_tour: {
      position: 'absolute',
      zIndex: 10,
      width: '100%',
      height: '100%',
    }
	}
}
