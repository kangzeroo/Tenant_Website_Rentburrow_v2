// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
	Table,
} from 'semantic-ui-react'
import {
	xLightBlue,
} from '../../../styles/base_colors'


class RoomsList extends Component {

	generateRow(room) {
		if (room.tenant) {
			return (
				<Table.Row key={room.room_id} positive style={comStyles().room_row}>
					<Table.Cell key={`${room.room_id}-Room`} width={1} textAlign='center' style={comStyles().text}>{ room.room_code }</Table.Cell>
					<Table.Cell key={`${room.room_id}-Name`} width={4} onClick={() => this.props.toggleModal(true, 'room', room)} textAlign='center' style={comStyles().text}>{ room.tenant.name }</Table.Cell>
					<Table.Cell key={`${room.room_id}-Message`} width={1} onClick={() => this.props.toggleModal(true, 'message', room)} icon='comments' textAlign='center' style={comStyles().icon} />
					<Table.Cell key={`${room.room_id}-Contract`} width={1} onClick={() => this.props.toggleModal(true, 'contract', room)} icon='payment' textAlign='center' style={comStyles().icon} />
				</Table.Row>
			)
		} else {
			return (
				<Table.Row key={room.room_id} negative style={comStyles().empty_room_row}>
					<Table.Cell key={`${room.room_id}-Room-vacant`} width={1} textAlign='center' style={comStyles().text}>{ room.room_code }</Table.Cell>
					<Table.Cell key={`${room.room_id}-Name-vacant`} width={4} textAlign='center' style={comStyles().empty_text}>VACANT</Table.Cell>
					<Table.Cell key={`${room.room_id}-Message-vacant`} width={1} style={comStyles().icon} />
					<Table.Cell key={`${room.room_id}-Contract-vacant`} width={1} onClick={() => this.props.toggleModal(true, 'contract', room)} icon='payment' textAlign='center' style={comStyles().icon} />
				</Table.Row>
			)
		}
	}

	render() {
		return (
			<div style={comStyles().container}>
				<Table basic selectable padded size='large' style={comStyles().table}>
					<Table.Header color='blue' key='blue' style={comStyles().header}>
						<Table.Row key='header'>
							<Table.HeaderCell key='Room' width={1} textAlign='center'>Room #</Table.HeaderCell>
							<Table.HeaderCell key='Name' width={4} textAlign='center'>Name</Table.HeaderCell>
							<Table.HeaderCell key='Message' width={1} textAlign='center'>Message</Table.HeaderCell>
							<Table.HeaderCell key='Contract' width={1} textAlign='center'>View Contract</Table.HeaderCell>
						</Table.Row>
					</Table.Header>

					<Table.Body>
						{
							mockTenants.map((r) => {
								return this.generateRow(r)
							})
						}
					</Table.Body>
				</Table>
			</div>
		)
	}
}

// defines the types of variables in this.props
RoomsList.propTypes = {
	history: PropTypes.object.isRequired,
	rooms: PropTypes.array,
	toggleModal: PropTypes.func.isRequired,			// passed in
}

// for all optional props, define a default value
RoomsList.defaultProps = {
	rooms: []
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(RoomsList)

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
			padding: '30px'
		},
		room_row: {
			cursor: 'pointer'
		},
		empty_room_row: {
			cursor: 'pointer'
		},
		header: {
			fontSize: '1.8rem',
			backgroundColor: 'rgba(0,0,0,0.05)'
		},
		text: {
			fontSize: '1.8rem'
		},
		empty_text: {
			fontSize: '2rem',
			fontWeight: 'bold',
		},
		icon: {
			fontSize: '2.5rem',
		},
	}
}

const mockTenants = [
	{
		room_id: 'asdfdf',
		room_code: 'A',
		tenant: {
			name: 'Justin Borde'
		}
	},
	{
		room_id: 'asdffg',
		room_code: 'B',
		tenant: {
			name: 'Brandon Fung'
		}
	},
	{
		room_id: '5edgff',
		room_code: 'C',
		tenant: {
			name: 'Zara Husnani'
		}
	},
	{
		room_id: 'dfgghyg',
		room_code: 'D',
		tenant: null
	},
	{
		room_id: '54tggdh',
		room_code: 'E',
		tenant: {
			name: 'Gabriel Chen'
		}
	}
]
