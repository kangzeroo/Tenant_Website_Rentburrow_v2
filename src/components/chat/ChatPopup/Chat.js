import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import {
  xMidBlue
} from '../../../styles/base_colors'
import ChatContainer from './ChatContainer'
import ChatIcon from './ChatIcon'

class Chat extends Component {

	constructor(props) {
		super(props)
		this.state = {
			chat_open: false
		}
	}

	toggleChatVisible() {
		this.setState({
			chat_open: !this.state.chat_open
		}, () => this.state)
	}

	render() {
		return (
			<div style={comStyles().container}>
				{
					this.state.chat_open
					?
					<ChatContainer
						id='ChatContainer'
						corporation={this.props.corporation}
						chat_open={this.state.chat_open}
						hideChat={() => this.setState({ chat_open: false })}
						style={comStyles().chatcontainer}
					/>
					:
					null
				}
				<ChatIcon
					id='ChatIcon'
				  toggleChatVisible={() => this.toggleChatVisible()}
				  chat_open={this.state.chat_open}
				  style={comStyles().icon}
				/>
			</div>
		)
	}
}

Chat.propTypes = {
	corporation: PropTypes.object
}

Chat.defaultProps = {
	corporation: null
}

const RadiumHOC = Radium(Chat)

function mapStateToProps(state) {
	return {
		corporation: state.auth.corporation_profile
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
			bottom: '20px',
			right: '20px',
      zIndex: 99999,
		},
		chatcontainer: {
			minWidth: '380px',
			maxWidth: '380px',
			height: '600px',
			border: `4px solid ${xMidBlue}`,
			borderRadius: '25px',
      backgroundColor: 'white'
		},
		icon: {
		}
	}
}
