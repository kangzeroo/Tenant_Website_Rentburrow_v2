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
        <Table celled selectable>
          <Table.Row>
            <Table.Cell>Suite Num</Table.Cell>
            <Table.Cell>Suite Style</Table.Cell>
            <Table.Cell>Available Rooms</Table.Cell>
            <Table.Cell>Room Price</Table.Cell>
            <Table.Cell />
          </Table.Row>
        </Table>
      </div>
    )
	}
}

// defines the types of variables in this.props
AvailableSuites.propTypes = {
  building_id: PropTypes.string.isRequired,
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
