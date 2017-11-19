// Compt for copying as a ProTipsTopic
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
  Accordion,
  Icon,
} from 'semantic-ui-react'
import { xMidBlue, xLightBlue } from '../../../styles/base_colors'


class ProTipsTopic extends Component {

  constructor() {
    super()
    this.state = {
      activeIndex: 0,
    }
  }

	render() {
		return (
      <Accordion id='ProTipsTopic' fluid key={this.props.topic.key} styled style={comStyles().container}>
        <Accordion.Title active={this.state.activeIndex === 0} style={comStyles().grand_title}>
          { this.props.topic.title }
        </Accordion.Title>
        {
          this.props.tips.map((tip) => {
            return (
              <div key={tip.index}>
                <Accordion.Title active={this.state.activeIndex === tip.index} onClick={() => this.setState({ activeIndex: tip.index })} style={comStyles().tip_title}>
                  <Icon name={tip.icon} />
                  &nbsp; &nbsp;
                  { tip.title }
                </Accordion.Title>
                <Accordion.Content active={this.state.activeIndex === tip.index} style={comStyles().tip_explanation}>
                  <p>
                    { tip.explanation }
                  </p>
                </Accordion.Content>
              </div>
            )
          })
        }
      </Accordion>
		)
	}
}

// defines the types of variables in this.props
ProTipsTopic.propTypes = {
	history: PropTypes.object.isRequired,
  topic: PropTypes.object.isRequired,       // passed in
  tips: PropTypes.array.isRequired,         // passed in
}

// for all optional props, define a default value
ProTipsTopic.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(ProTipsTopic)

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
      margin: '0px 0px 50px 0px',
      borderRadius: '10px 10px 0px 0px',
		},
    grand_title: {
			fontSize: '2rem',
			fontWeight: 'bold',
			backgroundColor: xMidBlue,
			color: 'white',
		},
    tip_title: {
			fontSize: '1.8rem',
			fontWeight: 'bold',
		},
    tip_explanation: {
			fontSize: '1.2rem',
		},
	}
}
