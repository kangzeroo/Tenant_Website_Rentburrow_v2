import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import uuid from 'uuid'
import {
  xMidBlue
} from '../../../styles/base_colors'
import {
  Modal,
  Card,
  Input,
  Button,
} from 'semantic-ui-react'
import ChatsDash from '../ChatPage/ChatsDash'
import ChatsPanel from '../ChatPage/ChatsPanel'
import ChatHelp from '../ChatPage/ChatHelp'
import { checkIfThisLandlordHasConvo } from '../../../api/messaging/messaging_api'
import { selectChatThread } from '../../../actions/messaging/messaging_actions'


class ChatContainer extends Component {

  componentWillMount() {
    // checks that we have a selected landlord and selected building
    // if the tenant has a convo with this landlord already, then we will load it
    if (this.props.selected_landlord.corporation_id && this.props.selected_building.building_id) {
      const has_convos = checkIfThisLandlordHasConvo(this.props.selected_landlord.corporation_id, this.props.all_messages)
      if (has_convos.length > 0) {
        this.props.selectChatThread(has_convos)
      } else {
        this.props.selectChatThread([{
          message_id: uuid.v4(),
          sender_id: this.props.selected_landlord.corporation_id,
          receiver_id: this.props.tenant_profile.tenant_id,
          tenant_id: this.props.tenant_profile.tenant_id,
          tenant_name: `${this.props.tenant_profile.first_name} ${this.props.tenant_profile.last_name}`,
          building_id: this.props.selected_building.building_id,
          // building_thumbnail: this.props.building_target.thumbnail,
          building_alias: this.props.selected_building.building_address,
          corporation_id: this.props.selected_landlord.corporation_id,
          corporation_name: this.props.selected_landlord.corporation_name,
          channel_id: `${this.props.selected_landlord.corporation_id}_${this.props.tenant_profile.tenant_id}`,
          contents: 'Any questions for the landlord?',
        }])
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.all_messages.length !== prevProps.all_messages.length) {
      const has_convos = checkIfThisLandlordHasConvo(this.props.selected_landlord.corporation_id, this.props.all_messages)
      if (has_convos.length > 0) {
        this.props.selectChatThread(has_convos)
      }
    }
  }

	renderAppropriateView() {
		let view = null
    if (this.props.chat_help) {
      view = (
        <ChatHelp />
      )
    } else if (this.props.current_thread.length === 0) {
      view = (
        <ChatsPanel />
      )
		} else {
			view = (
				<ChatsDash />
			)
		}
		return view
	}

	render() {
		return (
			<div id='ChatContainer' style={comStyles().container}>
				{
					this.renderAppropriateView()
				}
			</div>
		)
	}
}

ChatContainer.propTypes = {
	hideChat: PropTypes.func.isRequired,				// passed in
	chat_open: PropTypes.bool,			// passed in
  all_messages: PropTypes.array,
  current_thread: PropTypes.array,
  chat_help: PropTypes.bool,
  selected_building: PropTypes.object,
  selected_landlord: PropTypes.object,
  tenant_profile: PropTypes.object,
  selectChatThread: PropTypes.func.isRequired,
}

ChatContainer.defaultProps = {
	chat_open: false,
  all_messages: [],
  current_thread: [],
  chat_help: false,
  selected_landlord: {},
  tenant_profile: {},
  selected_building: {},
}

const RadiumHOC = Radium(ChatContainer)

function mapStateToProps(state) {
	return {
		all_messages: state.messaging.all_messages,
    current_thread: state.messaging.current_thread,
    chat_help: state.messaging.chat_help,
    selected_landlord: state.selection.selected_landlord,
    tenant_profile: state.auth.tenant_profile,
    selected_building: state.selection.selected_building,
	}
}

export default connect(mapStateToProps, {
  selectChatThread
})(RadiumHOC)

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
      zIndex: 9
		},
		chatbox: {
      backgroundColor: 'white'
		},
		icon: {
		},
    popup_card: {
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    }
	}
}
