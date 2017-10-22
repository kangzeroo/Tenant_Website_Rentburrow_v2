// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
  Button,
  Header,
} from 'semantic-ui-react'


class ApplicationContract extends Component {

	render() {
		return (
			<div style={comStyles().container}>
        <div style={comStyles().headerContainer} >
          <div style={comStyles().headerButtonsContainer} >
            <Button
              primary
              basic
              icon='chevron left'
              content='back'
              onClick={() => this.goBack()}
            />
            {
              this.state.link === null || this.state.link === ''
              ?
              null
              :
              <Button
                primary
                icon='cloud download'
                content='Download Contract'
                disabled={this.state.application.doc_status !== 'complete'}
              />
            }
          </div>
          <div style={comStyles().headerStatus}>
            {
              this.state.application.doc_status === 'complete'
              ?
              <Header
                as='h2'
                icon='checkmark'
                content='Status: COMPLETE'
                subheader='All recipients have signed this contract'
              />
              :
              <Header
                as='h2'
                icon='wait'
                content='Status: WAIT'
                subheader='Waiting for signatures from all recipients'
              />
            }
          </div>
        </div>
			</div>
		)
	}
}

// defines the types of variables in this.props
ApplicationContract.propTypes = {
	history: PropTypes.object.isRequired,
  application: PropTypes.object.isRequired,       // passed in
}

// for all optional props, define a default value
ApplicationContract.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(ApplicationContract)

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
    headerContainer: {
      display: 'flex',
			flexDirection: 'row',
			//margin: '30px',
			justifyContent: 'space-between'
    },
    headerButtonsContainer: {
			display: 'flex',
			flexDirection: 'row',
			margin: '30px',
		},
    headerStatus: {
			margin: '30px',
		},
    contractContainer: {
			padding: '10px 100px 10px 100px',
			height: '90%',
			width: '100%',
			background: "transparent url('https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif') center no-repeat",
		}
	}
}
