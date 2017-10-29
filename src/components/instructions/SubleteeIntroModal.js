// Compt for copying as a template
// This compt is used for...
import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
  Modal,
  Header,
  Icon,
  Button,
} from 'semantic-ui-react'


class SubleteeIntroModal extends Component {

	render() {
		return (
      <div style={comStyles().container}>
        <div style={comStyles().central}>
          <Header as='h1' icon textAlign='center'>
            <Icon name='cube' size='massive' circular />
            <Header.Content size='huge'>
              Do the sublet paperwork online
            </Header.Content>
          </Header>
          <div style={comStyles().description}>
            Rentburrow makes it easy to sublet. Just fill in our online form and a contract will be generated for both parties to sign. All you need is a web browser!
          </div>
          <div style={comStyles().buttons_row}>
            <Button primary basic content='No, I will print out the contract myself' onClick={() => this.props.history.push('/signing/example/paperwork/sublet')} />
            <Button primary content='Thanks, I will keep that in mind' onClick={() => this.props.toggleModal(false)} />
          </div>
        </div>
      </div>
		)
	}
}

// defines the types of variables in this.props
SubleteeIntroModal.propTypes = {
	history: PropTypes.object.isRequired,
  toggleModal: PropTypes.func.isRequired,       // passed in
}

// for all optional props, define a default value
SubleteeIntroModal.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(SubleteeIntroModal)

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
      justifyContent: 'center',
      alignItems: 'center',
		},
    central: {
      fontSize: '1rem',
      width: '80%',
    },
    description: {
      fontSize: '1.3rem',
      fontWeight: 'normal',
      width: '100%',
      textAlign: 'center',
    },
    buttons_row: {
      fontSize: '1rem',
      width: '100%',
      margin: '50px',
      display: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
    }
	}
}
