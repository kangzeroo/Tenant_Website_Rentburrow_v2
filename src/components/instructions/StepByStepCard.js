// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
  Card,
} from 'semantic-ui-react'


class StepByStepCard extends Component {

	render() {
		return (
			<div style={comStyles().container}>
				<Card fluid raised>
          <Card.Content>
            1. Watch Virtual Tours
          </Card.Content>
          <Card.Content>
            2. Share With Roomates
            <i className='ion-ios-heart' style={comStyles().icon}></i>
            <i className='ion-android-share-alt' style={comStyles().icon}></i>
          </Card.Content>
          <Card.Content>
            3. Sign & Pay Online
            <i className='ion-cash' style={comStyles().icon}></i>
            <i className='ion-card' style={comStyles().icon}></i>
          </Card.Content>
        </Card>
			</div>
		)
	}
}

// defines the types of variables in this.props
StepByStepCard.propTypes = {
	history: PropTypes.object.isRequired,
}

// for all optional props, define a default value
StepByStepCard.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(StepByStepCard)

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
      width: '100%',
		}
	}
}
