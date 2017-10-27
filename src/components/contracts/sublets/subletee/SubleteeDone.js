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
  Button,
} from 'semantic-ui-react'

class SubleteeDone extends Component {

  openFacebookUser(url) {
    const win = window.open(url, '_blank')
    win.focus()
  }

	render() {
		return (
			<Card style={comStyles().container}>
        <div style={comStyles().done_message}>
				    You are done! Please send this link to your subletor on Facebook to fill the remainder of the lease. Once complete, you and your witnesses will all recieve an email to sign online.
        </div>
        <div style={comStyles().buttonsRow}>
          <Button positive onClick={() => this.openFacebookUser(`https://facebook.com/${this.props.sublet_post.FB_USER_ID}`)} style={comStyles().facebook_user}>
            Share this link with { this.props.sublet_post.FB_USER_NAME }
          </Button>
          <Button basic primary content='View All Applications' onClick={() => this.props.history.push('/sublet_applications?tab=where-i-want-to-live')} style={comStyles().facebook_user} />
        </div>
        <div style={comStyles().share_link}>
          <input value={`${window.location.origin}/signing/sublet/${this.props.sublet_post.POST_ID}/initiate/applications/${this.props.subletee_contract.contract_id}`} style={comStyles().subletor_url} />
        </div>
			</Card>
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
      width: '600px',
      height: '350px',
      margin: '100px auto',
		},
    done_message: {
      width: '100%',
      padding: '30px',
      fontSize: '1.3rem',
      // fontWeight: 'bold',
      textAlign: 'center',
    },
    share_link: {
      width: '100%',
      padding: '20px',
      fontSize: '1rem',
      fontWeight: 'bold',
    },
    buttonsRow: {
      display: 'flex',
      flexDirection: 'row',
    },
    facebook_user: {
      margin: '30px auto',
    },
    subletor_url: {
      width: '100%',
      padding: '20px',
      fontSize: '1.2rem',
      fontWeight: 'bold',
    }
	}
}
