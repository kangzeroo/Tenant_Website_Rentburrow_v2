// Compt for copying as a template
// This compt is used for...

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
import { selectChatThread } from '../../../actions/messaging/messaging_actions'
import ChatFeed from './ChatFeed'
import ChatInput from './ChatInput'


class ChatsDash extends Component {

	render() {
		return (
			<div style={comStyles().container}>
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
            <h2 style={comStyles().title}>{ this.props.current_thread[0].tenant_name }</h2>
            :
            <h2 style={comStyles().title}>Messages</h2>
          }
        </Header>
        {
          this.props.current_thread.length > 0
          ?
					<div style={comStyles().chat_interface}>
          	<ChatFeed current_thread={this.props.current_thread} style={comStyles().chat_feed} />
						<ChatInput tenant={{
							tenant_id: this.props.current_thread[0].tenant_id,
							tenant_name: this.props.current_thread[0].tenant_name,
						}} style={comStyles().chat_input} />
					</div>
          :
          <div style={comStyles().no_history}>
            <h3>No Chat History</h3>
          </div>
        }
			</div>
		)
	}
}

// defines the types of variables in this.props
ChatsDash.propTypes = {
	history: PropTypes.object.isRequired,
	selectChatThread: PropTypes.func.isRequired,
	current_thread: PropTypes.array,								// passed in
}

// for all optional props, define a default value
ChatsDash.defaultProps = {
	current_thread: [],
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(ChatsDash)

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
			maxHeight: '85%'
		},
		chat_input: {
			minHeight: '15%',
			maxHeight: '15%',
		}
	}
}
