// Compt for copying as a UseChrome
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
  Button,
} from 'semantic-ui-react'


class UseChrome extends Component {

  openUrl(url) {
    const win = window.open(url, '_blank')
    win.focus()
  }

	render() {
		return (
      <div id='UseChrome' style={comStyles().container}>
        <div style={comStyles().title}>Use the Chrome Web Browser</div>
        <div style={comStyles().image}>
          <img src='https://i.github-camo.com/448f9c5b64bd6d2f3367f53812e54be31e0644c2/68747470733a2f2f636c6f75642e67697468756275736572636f6e74656e742e636f6d2f6173736574732f313433363237312f31323636383233362f63323333613463302d633639372d313165352d386262612d3838323239316462336636352e706e67' />
        </div>
        <div style={comStyles().message}>
          Rentburrow.com is optimized for Google Chrome, which offers the best web experience. Mozilla Firefox, Internet Explorer and Safari users may experience performance issues.
        </div>
        <div style={comStyles().choices}>
          <Button onClick={() => this.openUrl('https://www.google.com/chrome/browser/desktop/index.html')} style={comStyles().popupButton}>Download Chrome</Button>
          <Button onClick={() => this.props.toggleModal(false)} style={comStyles().popupButton}>Continue Anyways</Button>
        </div>
      </div>
		)
	}
}

// defines the types of variables in this.props
UseChrome.propTypes = {
	history: PropTypes.object.isRequired,
  toggleModal: PropTypes.func.isRequired,   // passed in
}

// for all optional props, define a default value
UseChrome.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(UseChrome)

// Get access to state from the Redux store
const mapReduxToProps = (state) => {
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
		},
    title: {
      width: '100%',
      padding: '20px',
      textAlign: 'center',
      fontSize: '3rem',
      fontWeight: 'bold',
    },
    image: {
      width: '100%',
      padding: '10px',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    message: {
      width: '100%',
      padding: '20px',
      textAlign: 'center',
      fontSize: '1.4rem',
      fontWeight: 'bold',
      lineHeight: '30px',
    },
    choices: {
      width: '100%',
      padding: '30px',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    popupButton: {
      fontSize: '3rem',
      padding: '20px',
    }
	}
}
