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


class VirtualTourCanvas extends Component {

  renderVirtualTour_iStaging(link) {
    return (
      <iframe width='100%' height='800' src={link} frameborder='0' allowfullscreen=''></iframe>
    )
  }

	renderVirtualTour_Matterport(link) {
    return (
      <iframe width='1000' height='800' src={link} allowfullscreen></iframe>
    )
  }

	render() {
    console.log(this.props.link)
		return (
			<div style={comStyles().container}>
				{
          this.props.istaging_url
          ?
          this.renderVirtualTour_iStaging(this.props.istaging_url)
          :
          null
        }
			</div>
		)
	}
}

// defines the types of variables in this.props
VirtualTourCanvas.propTypes = {
	history: PropTypes.object.isRequired,
  istaging_url: PropTypes.string,        // passed in
}

// for all optional props, define a default value
VirtualTourCanvas.defaultProps = {

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
const comStyles = () => {
	return {
		container: {
      display: 'flex',
      flexDirection: 'column',
		}
	}
}
