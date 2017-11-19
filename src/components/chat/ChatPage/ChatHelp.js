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
  xMidBlue,
} from '../../../styles/base_colors'
import { selectChatThread } from '../../../actions/messaging/messaging_actions'
import ChatFeed from './ChatFeed'
import ChatInput from './ChatInput'
import ChatEmailUnauth from './ChatEmailUnauth'


class ChatHelp extends Component {

  constructor() {
    super()
    this.state = {
      question: '',
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
			<div id='ChatHelp' style={comStyles(this.props.history.location.pathname).container}>
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
            <div style={comStyles().title}>{ this.props.current_thread[0].corporation_name }</div>
            :
            <div style={comStyles().title}>Help Chat</div>
          }
        </Header>
        <div style={comStyles().chat_interface}>
          {
            this.props.current_thread.length > 0
            ?
            <ChatFeed
              current_thread={this.props.current_thread}
							closePrompt={() => this.setState({
								showing_email_unauth: false,
							})}
							showing_email_unauth={this.state.showing_email_unauth}
              style={comStyles().chat_feed}
            />
            :
            <div style={comStyles().chat_feed}>
              Got a question? Ask the Rentburrow Team directly!
              <br /><br />
              {
                this.state.showing_email_unauth
                ?
                <ChatEmailUnauth
                  closePrompt={() => this.setState({
                    showing_email_unauth: false,
                  })}
                />
                :
                null
              }
            </div>
          }
          <ChatInput
            showing_email_unauth={this.state.showing_email_unauth}
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

// Checkout our <span onClick={() => this.props.history.push('/protips')} style={comStyles().pro_tips_link}>Rent Pro-Tips Page</span> or

// defines the types of variables in this.props
ChatHelp.propTypes = {
	history: PropTypes.object.isRequired,
	selectChatThread: PropTypes.func.isRequired,
	current_thread: PropTypes.array.isRequired,
  authenticated: PropTypes.bool,
}

// for all optional props, define a default value
ChatHelp.defaultProps = {
  authenticated: false,
	current_thread: [],
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(ChatHelp)

// Get access to state from the Redux store
function mapStateToProps(state) {
	return {
		current_thread: state.messaging.current_thread,
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
      backgroundColor: xMidBlue,
      color: 'white',
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
      padding: '20px',
      fontSize: '1.2rem',
      fontWeight: 'bold',
		},
		chat_input: {
			minHeight: '15%',
			maxHeight: '15%',
		},
    pro_tips_link: {
      color: 'blue',
      textDecoration: 'underline',
      cursor: 'pointer',
    }
	}
}
