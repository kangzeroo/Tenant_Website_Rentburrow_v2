// Compt for copying as a PrizeBlowup
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import { xMidBlue, xDeepBlue } from '../../styles/base_colors'
import {
  Button,
  Card,
  Header,
  Image,
} from 'semantic-ui-react'


class PrizeBlowup extends Component {

  constructor() {
    super()
    this.state = {
      expanded: false,
    }
  }

  renderTours() {
    return (
      <Card raised>
        STEP 1: WATCH VIRTUAL TOURS
        <br/>
        <Image src='http://www.easypano.com/images/tw/v3/link2.jpg' height='300px' width='300px' />
      </Card>
    )
  }

  renderUber() {
    return (
      <Card raised>
        STEP 2: PICK YOUR FAVORITE PLACE TO TOUR. ONE FREE UBER RIDE PER STUDENT
        <br/>
        <Image src='http://www.imperial2019.com/images/uber%20logo.png' height='300px' width='300px' />
      </Card>
    )
  }

  renderLeaseSave() {
    return (
      <Card raised>
        STEP 3: UPLOAD YOUR LEASE AND REDEEM PRIZE
        <br/>
        <Image src='http://siriusbuzz.com/wp-content/uploads/2012/11/gift-blue.gif' height='300px' width='300px' />
      </Card>
    )
  }

	render() {
		return (
			<div id='PrizeBlowup' style={comStyles(this.state.expanded).container}>
        <Button color='blue' onClick={() => this.setState({ expanded: !this.state.expanded })} circular size='massive' icon={this.state.expanded ? 'chevron down' : 'chevron up'} style={comStyles().show_or_hide} />
        <br /><br />
        <Header content='HOW IT WORKS' color='white' />
        <div style={comStyles().step_cards}>
          {
            this.renderTours()
          }
          {
            this.renderUber()
          }
          {
            this.renderLeaseSave()
          }
        </div>
      </div>
		)
	}
}

// defines the types of variables in this.props
PrizeBlowup.propTypes = {
	history: PropTypes.object.isRequired,
}

// for all optional props, define a default value
PrizeBlowup.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(PrizeBlowup)

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
const comStyles = (expanded) => {
  let expandedStyles = {
    height: '20px',
    overflow: 'hidden',
  }
  if (expanded) {
    expandedStyles = {
      ...expandedStyles,
      height: '80vh',
    }
  }
	return {
		container: {
      ...expandedStyles,
      display: 'flex',
      flexDirection: 'column',
      width: '100vw',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: xMidBlue,
      zIndex: 20,
		},
    show_or_hide: {
      position: 'absolute',
      top: '-30px',
      left: '48vw',
    },
    step_cards: {
      display: 'flex',
      flexDirection: 'row',
      width: '100vw',
      justifyContent: 'space-around',
    }
	}
}
