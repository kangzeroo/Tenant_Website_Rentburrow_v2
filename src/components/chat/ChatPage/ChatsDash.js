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
import {
  xMidBlue
} from '../../../styles/base_colors'
import { selectChatThread } from '../../../actions/messaging/messaging_actions'
import ChatFeed from './ChatFeed'
import ChatInput from './ChatInput'


class ChatsDash extends Component {

	constructor() {
    super()
    this.state = {
      showing_email_unauth: false,
    }
  }

	componentWillMount() {
    if (!this.props.authenticated && !localStorage.getItem('unauthUser_email') && !localStorage.getItem('unauthUser_name')) {
      this.setState({
				showing_email_unauth: true,
			})
    }
	}

	render() {
		return (
			<div style={comStyles().container}>
				<Header as='h2' textAlign='center' style={comStyles().header}>
					<div style={comStyles().back_button}>
						{
							this.props.history.location.pathname.indexOf('/chat') > -1
							?
							null
							:
							<Icon name='chevron left' onClick={() => this.props.selectChatThread([])} style={comStyles().left_arrow} />
						}
					</div>
					<div style={comStyles().property_title}>
	          {
	            this.props.current_thread.length > 0
	            ?
	            <h3 style={comStyles().title}>{ this.props.current_thread[0].corporation_name }</h3>
	            :
	            <h3 style={comStyles().title}>Messages</h3>
	          }
					</div>
        </Header>
        {
          this.props.current_thread.length > 0
          ?
					<div style={comStyles().chat_interface}>
          	<ChatFeed
							current_thread={this.props.current_thread}
							closePrompt={() => this.setState({
								showing_email_unauth: false,
							})}
							showing_email_unauth={this.state.showing_email_unauth}
							style={comStyles().chat_feed}
						/>
						<ChatInput
							selected_building={this.props.selected_building}
							showing_email_unauth={this.state.showing_email_unauth}
							corporation={{
								corporation_id: this.props.selected_landlord.corporation_id,
								corporation_name: this.props.selected_landlord.corporation_name,
							}}
							style={comStyles().chat_input} />
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
	current_thread: PropTypes.array,
	selected_landlord: PropTypes.object,
  authenticated: PropTypes.bool,
	selected_building: PropTypes.object,
}

// for all optional props, define a default value
ChatsDash.defaultProps = {
	current_thread: [],
	selected_landlord: {},
	selected_building: {},
  authenticated: false,
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(ChatsDash)

// Get access to state from the Redux store
function mapStateToProps(state) {
	return {
		current_thread: state.messaging.current_thread,
		selected_landlord: state.selection.selected_landlord,
    selected_building: state.selection.selected_building,
    authenticated: state.auth.authenticated,
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
			color: 'white',
			backgroundColor: xMidBlue,
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
			height: '100%'
		},
		chat_feed: {
			minHeight: '85%',
			maxHeight: '85%'
		},
		chat_input: {
			minHeight: '15%',
			maxHeight: '15%',
		},
		back_button: {
			width: '10%',
		},
		property_title: {
			width: '90%',
			display: 'flex',
			flexDirection: 'row',
			flexWrap: 'wrap',
			justifyContent: 'center',
		},
	}
}
