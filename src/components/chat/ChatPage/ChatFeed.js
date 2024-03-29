import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import moment from 'moment'
import {
  xMidBlue
} from '../../../styles/base_colors'
import ChatEmailUnauth from './ChatEmailUnauth'


class ChatFeed extends Component {

  componentDidMount() {
    this.scrollDown()
  }

  componentDidUpdate() {
    this.scrollDown()
  }

  scrollDown() {
    const objDiv = document.getElementById('chatfeed');
    objDiv.scrollTop = objDiv.scrollHeight;
  }

	render() {
		return (
      <div id='ChatFeed' className='pretty_scrollbar' id='chatfeed' style={comStyles(this.props.onPage).chatfeed}>
        {
          this.props.showing_email_unauth
          ?
          <ChatEmailUnauth
            closePrompt={() => this.props.closePrompt()}
          />
          :
          null
        }
        {
          this.props.current_thread.map((message) => {
            let msg
            if (message.receiver_id === message.corporation_id) {
              msg = (
                <div key={message.message_id} title={message.read_at ? `Seen ${moment(message.read_at).fromNow()}` : 'Not Seen Yet'} style={comStyles().me}>
                  { message.contents }
                </div>
              )
            } else if (message.sender_id === message.corporation_id) {
              msg = (
                <div key={message.message_id} title={message.read_at ? `Seen ${moment(message.read_at).fromNow()}` : 'Not Seen Yet'} style={comStyles().them}>
                  { message.contents }
                </div>
              )
            }
            return msg
          })
        }
      </div>
		)
	}
}

ChatFeed.propTypes = {
  current_thread: PropTypes.array,              // passed in
  closePrompt: PropTypes.func.isRequired,       // passed in
  showing_email_unauth: PropTypes.bool,         // passed in
  onPage: PropTypes.bool,                       // passed in
}

ChatFeed.defaultProps = {
  current_thread: [],
  showing_email_unauth: true,
  onPage: false,
}

const RadiumHOC = Radium(ChatFeed)

function mapStateToProps(state) {
	return {
	}
}

export default connect(mapStateToProps, {})(RadiumHOC)

// ===============================

const comStyles = (onPage) => {
	return {
    chatfeed: {
      // alignSelf: 'stretch',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      overflowY: 'scroll',
      overflowX: 'hidden',
      padding: '15px 15px 20px 15px',
      minHeight: onPage ? '70vh' : '440px',
      maxHeight: onPage ? '70vh' : '440px',
    },
    them: {
      // display: 'flex',
      padding: '10px',
      maxWidth: '80%',
      backgroundColor: xMidBlue,
      color: 'white',
      width: 'auto',
      height: 'auto',
      // textAlign: 'flex-end',
      // flexWrap: 'wrap',
      // wordWrap: 'break-word',
      margin: '5px',
      float: 'left',
      borderRadius: '10px',
      textAlign: 'left',
    },
    me: {
      // display: 'flex',
      backgroundColor: '#00bfff',
      padding: '10px',
      maxWidth: '80%',
      width: 'auto',
      color: 'white',
      // textAlign: 'flex-start',
      // flexWrap: 'wrap',
      height: 'auto',
      // wordWrap: 'break-word',
      margin: '5px 5px 5px 20%',
      float: 'right',
      borderRadius: '10px',
      // textAlign: 'right',
    }
	}
}
