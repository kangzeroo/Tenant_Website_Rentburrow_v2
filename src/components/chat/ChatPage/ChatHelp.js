// Sidebar chat panel
// lists messages

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
  Header,
  Icon,
} from 'semantic-ui-react'
import {
  xLightBlue,
  xDeepBlue,
} from '../../../styles/base_colors'
import { selectChatThread } from '../../../actions/messaging/messaging_actions'
import ChatFeed from './ChatFeed'
import ChatInput from './ChatInput'


class ChatPanel extends Component {

  constructor() {
    super()
    this.state = {
      question: '',
    }
  }

	render() {
		return (
			<div style={comStyles(this.props.history.location.pathname).container}>
        <Header as='h2' textAlign='center' style={comStyles().header}>
          {
            this.props.history.location.pathname.indexOf('/chat') > -1
            ?
            null
            :
            <Icon name='chevron left' onClick={() => this.props.selectChatThread([])} style={comStyles().left_arrow} />
          }
          {
            this.props.current_thread.length > 0
            ?
            <h2 style={comStyles().title}>{ this.props.current_thread[0].corporation_name }</h2>
            :
            <h2 style={comStyles().title}>Help Chat</h2>
          }
        </Header>
        <div style={comStyles().chat_interface}>
          {
            this.props.current_thread.length > 0
            ?
            <ChatFeed current_thread={this.props.current_thread} style={comStyles().chat_feed} />
            :
            <div style={comStyles().chat_feed}>
              Got a question? Ask us!
            </div>
          }
          <ChatInput
            corporation={{
              corporation_id: 'Rentburrow_Student_Help_Chat',
              corp_name: 'Rentburrow Help',
            }}
            style={comStyles().chat_input} />
        </div>
			</div>
		)
	}
}

// defines the types of variables in this.props
ChatPanel.propTypes = {
	history: PropTypes.object.isRequired,
	selectChatThread: PropTypes.func.isRequired,
	current_thread: [],
}

// for all optional props, define a default value
ChatPanel.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(ChatPanel)

// Get access to state from the Redux store
function mapStateToProps(state) {
	return {
		current_thread: state.messaging.current_thread,
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapStateToProps, {
    selectChatThread,
	})(RadiumHOC)
)

// ===============================

// the JS function that returns Radium JS styling
const comStyles = () => {
	return {
		container: {
      display: 'flex',
      flexDirection: 'column',
			width: '100%',
			height: '100%',
			padding: '10px',
			backgroundColor: 'white',
		},
    header: {
      width: '100%',
      height: '10%',
      textAlign: 'center',
			padding: '30px',
			borderBottom: '3px solid black',
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'center',
			alignItems: 'center',
			position: 'relative',
    },
		no_history: {
			height: '90vh',
			textAlign: 'center',
			verticalAlign: 'middle',
			padding: '100px'
		},
		left_arrow: {
			position: 'absolute',
			left: '5px',
			top: '5px',
			cursor: 'pointer',
		},
		title: {
			margin: '20px auto'
		},
		chat_interface: {
			display: 'flex',
			flexDirection: 'column',
			height: '90%'
		},
		chat_feed: {
			minHeight: '85%',
			maxHeight: '85%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '40px',
      fontSize: '1.5rem',
      fontWeight: 'bold',
		},
		chat_input: {
			minHeight: '15%',
			maxHeight: '15%',
		}
	}
}
