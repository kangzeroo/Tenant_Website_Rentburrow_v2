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
import { getContractLink } from '../../../../api/signing/sublet_contract_api'

class SubletorDone extends Component {

  constructor() {
    super()
    this.state = {
      link: ''
    }
  }

  openFacebookUser(url) {
    const win = window.open(url, '_blank')
    win.focus()
  }

  viewContract() {
    console.log(this.props.subletor_contract.contract_id)
    getContractLink(this.props.subletor_contract.contract_id)
    .then((data) => {
      console.log(data)
      window.open(JSON.parse(data).contract_link)
    })
  }

	render() {
		return (
			<Card style={comStyles().container}>
				'DONE! All recipients must sign online via their email'
        <Button
          content='View Contract'
          onClick={() => this.viewContract()}
        />
			</Card>
		)
	}
}

// defines the types of variables in this.props
SubletorDone.propTypes = {
	history: PropTypes.object.isRequired,
  sublet_post: PropTypes.object.isRequired,   // passed in
  subletor_contract: PropTypes.object.isRequired,   // passed in
}

// for all optional props, define a default value
SubletorDone.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(SubletorDone)

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
    cover_photo: {
      minHeight: '93vh',
      maxHeight: '93vh',
      minWidth: '100%',
      maxWidth: '100%',
      display: 'flex',
      background: "transparent url('https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif') center no-repeat",
    },
	}
}
