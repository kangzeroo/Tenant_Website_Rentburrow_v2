// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import uuid from 'uuid'
import { withRouter } from 'react-router-dom'
import {
	Table,
  Button,
	Modal,
} from 'semantic-ui-react'
import HomeExplorer from '../suites/HomeExplorer'


class AvailableSuites extends Component {
	constructor() {
		super()
		this.state = {
			toggle_modal: false,
      modal_name: '',
      context: {},
    }
	}

	toggleModal(bool, attr, context) {
		this.setState({
      toggle_modal: bool,
      modal_name: attr,
      context,
    })
  }

	renderAppropriateModal(modal_name, context) {
		if (modal_name === 'suite') {
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
							all_suites={this.props.suites}
						/>
	        </Modal.Content>
	      </Modal>
	    )
		}
  }

	render() {
		return (
      <div style={comStyles().container} >
        <h3>Select a Suite</h3>
        <Table basic selectable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Suite Style</Table.HeaderCell>
              <Table.HeaderCell>Rooms</Table.HeaderCell>
              <Table.HeaderCell>Baths</Table.HeaderCell>
              <Table.HeaderCell>Rooms starting at</Table.HeaderCell>
              <Table.HeaderCell />
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {
              this.props.suites.map((suite) => {
								console.log(suite)
                return (
                  <Table.Row key={suite.suite_code} >
                    <Table.Cell>{suite.suite_alias}</Table.Cell>
                    <Table.Cell>{suite.total}</Table.Cell>
                    <Table.Cell>{suite.total}</Table.Cell>
                    <Table.Cell>${parseInt(suite.min_price)}</Table.Cell>
                    <Table.Cell>
                      <Button
                        basic
												fluid
												onClick={() => this.toggleModal(true, 'suite', suite)}
                        color='green'
                        content='Explore'
                      />
                    </Table.Cell>
                  </Table.Row>
                )
              })
            }
          </Table.Body>
        </Table>
				{
          this.renderAppropriateModal(this.state.modal_name, this.state.context)
        }
      </div>
    )
	}
}

// defines the types of variables in this.props
AvailableSuites.propTypes = {
  history: PropTypes.object.isRequired,
  suites: PropTypes.array.isRequired,			// passed in
	building: PropTypes.object.isRequired,	// passed in
}

// for all optional props, define a default value
AvailableSuites.defaultProps = {
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(AvailableSuites)

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

	}
}
