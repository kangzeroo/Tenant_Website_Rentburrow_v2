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

class SubleteeDone extends Component {

  openFacebookUser(url) {
    const win = window.open(url, '_blank')
    win.focus()
  }

	render() {
		return (
      <div style={comStyles().container}>
  			<Card style={comStyles().card}>
  				'You are done! Please send this link to your subletor on Facebook to fill the remainder of the lease. Once complete, you and your witnesses will all recieve an email to sign online.'
          <div onClick={() => this.openFacebookUser(`https://facebook.com/${this.props.sublet_post.FB_USER_ID}`)}>
            <br /><br /><br />
            Share this link with { this.props.sublet_post.FB_USER_NAME }
          </div>
          <input value={`${window.location.origin}/signing/sublet/${this.props.sublet_post.POST_ID}/initiate/applications/${this.props.subletee_contract.contract_id}`} />
  			</Card>
      </div>
		)
	}
}

// defines the types of variables in this.props
SubleteeDone.propTypes = {
	history: PropTypes.object.isRequired,
  sublet_post: PropTypes.object.isRequired,   // passed in
  subletee_contract: PropTypes.object.isRequired,   // passed in
}

// for all optional props, define a default value
SubleteeDone.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(SubleteeDone)

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
		},
    card: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }
	}
}
