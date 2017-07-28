import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import {
  xMidBlue
} from '../../../styles/base_colors'
import Chatbox from './ChatInterface/Chatbox'
import BuildingList from './BuildingList/BuildingList'


class ChatContainer extends Component {

	renderAppropriateView() {
		let view = null
		if (this.props.building_id && this.props.corporation_id) {
			view = (
				<Chatbox
					id='Chatbox'
					corporation={this.props.corporation}
					hideChat={() => this.props.hideChat()}
					style={comStyles().chatbox}
				/>
			)
		} else {
			view = (
				<BuildingList />
			)
		}
		return view
	}

	render() {
		return (
			<div style={comStyles().container}>
				{
					this.renderAppropriateView()
				}
			</div>
		)
	}
}

ChatContainer.propTypes = {
	corporation: PropTypes.object,				// passed in
	hideChat: PropTypes.func,				// passed in
	chat_open: PropTypes.bool,			// passed in
	building_id: PropTypes.number,
	corporation_id: PropTypes.string,
}

ChatContainer.defaultProps = {
	chat_open: false,
	building_id: null,
	corporation_id: null,
}

const RadiumHOC = Radium(ChatContainer)

function mapStateToProps(state) {
	return {
		building_id: state.messaging.building_target.building_id,
		corporation_id: state.messaging.corporation_target.corporation_id,
	}
}

export default connect(mapStateToProps, {})(RadiumHOC)

// ===============================

const comStyles = () => {
	return {
		container: {
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'flex-end',
			alignItems: 'flex-end',
			position: 'absolute',
			bottom: '80px',
			height: '600px',
			width: '380px',
      border: `4px solid ${xMidBlue}`,
      borderRadius: '25px',
			overflow: 'hidden',
		},
		chatbox: {
		},
		icon: {
		}
	}
}
