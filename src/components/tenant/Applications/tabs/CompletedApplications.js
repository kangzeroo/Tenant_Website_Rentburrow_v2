// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
  Header,
  Button,
  Icon,
} from 'semantic-ui-react'


class CompletedApplications extends Component {

	render() {
		return (
			<div style={comStyles().container}>
        <Header as='h3'>
          <Icon name='checkmark box' />
          Completed Applications
        </Header>
        <div style={comStyles().no_applications_container} >
          <Header
            as='h2'
            content='No Copmleted Applications Yet :('
            subheader='Create an application, or wait for all parties to sign one'
          />
        </div>
			</div>
		)
	}
}

// defines the types of variables in this.props
CompletedApplications.propTypes = {
	history: PropTypes.object.isRequired,
}

// for all optional props, define a default value
CompletedApplications.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(CompletedApplications)

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
    activeContainer: {
      display: 'flex',
			flexDirection: 'row',
			justifyContent: 'space-around',
			flexWrap: 'wrap',
    },
    no_applications_container: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '150px',
      maxHeight: '150px',
    },
    button_text: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      minWidth: '400px',
      maxWidth: '400px',
    }
	}
}
