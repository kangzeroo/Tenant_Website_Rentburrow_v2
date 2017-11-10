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
  Input,
  Modal,
  Icon,
} from 'semantic-ui-react'
import HomeExplorer from '../home_explorer/HomeExplorer'

class ApplyBox extends Component {

  constructor() {
		super()
		this.state = {
			toggle_modal: false,
      modal_name: '',
      context: {},
		}
	}

  generateText(label) {
    if (label && label.toLowerCase().indexOf('waitlist') > -1) {
      return 'Join Waitlist'
    } else {
      return 'Apply Now'
    }
  }

  generateShareURL() {
    return (
      <div style={comStyles().share_div}>
        <Input
          fluid
          value={window.location}
        />
      </div>
    )
  }

  signAndPayOnline() {
    // localStorage.removeItem('leasing_group_id')
    // window.open(`${window.location.origin}/signing/lease/${this.props.building.building_id}`, '_blank')
    this.props.toggleTemporaryCollectionFrom()
  }

  toggleModal(bool, attr, context) {
    this.setState({
      toggle_modal: bool,
      modal_name: attr,
      context,
    })
  }

  renderAppropriateModal(modal_name, context) {
    if (modal_name === 'virtual_tour') {
      return (
        <Modal
          dimmer
          open={this.state.toggle_modal}
          onClose={() => this.toggleModal(false)}
          closeIcon
          size='fullscreen'
        >
          <Modal.Content>
            <HomeExplorer
              building={this.props.building}
              current_suite={context}
              all_suites={this.props.all_suites}
              showVirtualTourFirst
            />
          </Modal.Content>
        </Modal>
      )
    } else if (modal_name === 'social_share') {
      return (
        <Modal
          dimmer
          open={this.state.toggle_modal}
          onClose={() => this.toggleModal(false)}
          closeIcon
          size='fullscreen'
        >
          <Modal.Content>
            {/*
              this.generateSocialLinks()
            */}
            <div style={comStyles().shareContainer} >
              <Icon
                name='share external'
                size='huge'
              />
              {
                this.generateShareURL()
              }
            </div>
          </Modal.Content>
        </Modal>
      )
    } else if (modal_name === 'sign_pay_online') {
      return (
        <Modal
          dimmer
          open={this.state.toggle_modal}
          onClose={() => this.toggleModal(false)}
          closeIcon
          size='fullscreen'
        >
          {/*<Modal.Content>
            {
              this.generatePaymentOptions()
            }
          </Modal.Content>*/}
          {
            this.generateComingSoon()
          }
        </Modal>
      )
    }
  }

	render() {
		return (
			<div style={comStyles().container}>
				<Card fluid raised style={comStyles().applyBox}>
          <div style={comStyles().buttonsContainer} >
            <Button
              circular
              icon='share alternate'
              color='teal'
              onClick={() => this.toggleModal(true, 'social_share')}
              size='medium'
            />
            <Button
              circular
              icon='simplybuilt'
              color='teal'
              onClick={() => this.toggleModal(true, 'virtual_tour', this.props.all_suites[0])}
              size='medium'
            />
          </div>
          <div style={comStyles().priceContainer} >
            <div>Rooms Starting from</div>
            <div style={comStyles().priceFont}>$ {this.props.building.min_price}</div>
          </div>
          <Button
            primary
            fluid
            icon={this.generateText(this.props.building.label) === 'Apply Now' ? 'send outline' : 'wait'}
            content={this.generateText(this.props.building.label)}
            onClick={() => this.signAndPayOnline()}
            size='huge'
          />
        </Card>
        {
          this.renderAppropriateModal(this.state.modal_name, this.state.context)
        }
			</div>
		)
	}
}

// defines the types of variables in this.props
ApplyBox.propTypes = {
	history: PropTypes.object.isRequired,
  building: PropTypes.object.isRequired,    // passed in
  all_suites: PropTypes.array.isRequired,  // passed in
  applyToLiveAtThisBuilding: PropTypes.func.isRequired,
  toggleTemporaryCollectionFrom: PropTypes.func.isRequired, // passed in
}

// for all optional props, define a default value
ApplyBox.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(ApplyBox)

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
    applyBox: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      minHeight: '250px',
      maxHeight: '250px',
      padding: '20px'
    },
    priceContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    },
    priceFont: {
      fontSize: '2rem',
      fontWeight: 'bold',
      padding: '10px 0px 0px 0px',
    },
    share_div: {
      width: '100%',
      fontSize: '2rem',
      fontWeight: 'bold',
    },
    shareContainer: {
      display: 'flex',
      flexDirection: 'row'
    }
	}
}
