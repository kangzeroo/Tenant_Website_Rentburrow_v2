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
} from 'semantic-ui-react'


class AvailableSuites extends Component {
	constructor() {
		super()
		this.state = {
    }
	}

	componentWillMount() {
	}

	render() {
		return (
      <div style={comStyles().container} >
        <h3>Select a Suite</h3>
        <Table basic selectable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Suite Num</Table.HeaderCell>
              <Table.HeaderCell>Suite Style</Table.HeaderCell>
              <Table.HeaderCell>Available Rooms</Table.HeaderCell>
              <Table.HeaderCell>Room Price</Table.HeaderCell>
              <Table.HeaderCell />
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {
              this.props.suites.map((suite) => {
                return (
                  <Table.Row key={suite.suite_code} >
                    <Table.Cell>{suite.suite_code}</Table.Cell>
                    <Table.Cell>{suite.suite_alias}</Table.Cell>
                    <Table.Cell>{suite.available}/{suite.total}</Table.Cell>
                    <Table.Cell>${suite.min_price} - ${suite.max_price}</Table.Cell>
                    <Table.Cell>
                      <Button
                        basic
                        color='green'
                        content='View'
                      />
                    </Table.Cell>
                  </Table.Row>
                )
              })
            }
          </Table.Body>
        </Table>
      </div>
    )
	}
}

// defines the types of variables in this.props
AvailableSuites.propTypes = {
  history: PropTypes.object.isRequired,
  suites: PropTypes.array.isRequired,
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
