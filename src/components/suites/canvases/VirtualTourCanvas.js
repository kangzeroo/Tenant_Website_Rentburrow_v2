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

  constructor() {
    super()
    this.state = {
      loading: true,
    }
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        loading: false,
      })
    }, 2000)
    this.setState({
      vr_tour_height: document.getElementById('container').clientHeight
    })
  }

  renderVirtualTour_iStaging(link) {
    return (
      <iframe width='100%' height={`${this.state.vr_tour_height}px`} src={link} frameBorder='0' allowFullScreen=''></iframe>
    )
  }

	renderVirtualTour_Matterport(link) {
    return (
      <iframe width='100%' height={`${this.state.vr_tour_height}px`} src={link} allowFullScreen></iframe>
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
    if (this.props.iguide_url) {
      panes.push({
        menuItem: 'iGuide Tour',
        render: () => (
          <Tab.Pane attached={false} style={comStyles(this.state.vr_tour_height).vrTour}>
            { this.renderVirtualTour_Matterport(this.props.iguide_url) }
          </Tab.Pane>
        )
      })
    }
		return (
			<div id='container' style={comStyles().container}>
        {
          this.state.loading
          ?
          <Dimmer active>
  	        <Loader>Loading Virtual Tour...</Loader>
  	      </Dimmer>
          :
          null
        }
        {
          this.props.istaging_url && this.props.iguide_url
          ?
          <Tab panes={panes} />
          :
          <div style={comStyles().vrTour}>
            {
              this.props.istaging_url
              ?
              this.renderVirtualTour_iStaging(this.props.istaging_url)
              :
              null
            }
            {
              this.props.iguide_url
              ?
              this.renderVirtualTour_Matterport(this.props.iguide_url)
              :
              null
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
}

// for all optional props, define a default value
VirtualTourCanvas.defaultProps = {
  istaging_url: null,
  iguide_url: null,
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
    }
	}
}
