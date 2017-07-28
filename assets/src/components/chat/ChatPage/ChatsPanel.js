// Sidebar chat panel
// lists messages

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
  Search,
  Segment,
} from 'semantic-ui-react'
import {
  xLightBlue,
} from '../../../styles/base_colors'


class ChatsPanel extends Component {

  constructor() {
    super()
    this.state = {
      latest_threads: [],
      search_string: '',
    }
  }

  componentDidMount() {
    this.sortMessages(this.props.messages)
  }

  componentWillUpdate(prevProps, prevState) {
    if (prevProps.messages !== this.props.messages) {
      this.sortMessages(this.props.messages)
    }
  }

  updateAttr(attr, event) {
    this.setState({
      [attr]: event.target.value
    })
    if (attr === 'search_string') {
      this.filterMessagesViaSearch(event.target.value.toLowerCase(), this.props.messages)
    }
  }

  filterMessagesViaSearch(search_string, messages) {
    const filtered_messages = messages.filter((m) => {
      return m.building_address.toLowerCase().indexOf(search_string) > -1 || m.tenant_name.toLowerCase().indexOf(search_string) > -1
    })
    this.sortMessages(filtered_messages)
  }

  // take all messages and sort into channels
  sortMessages(messages) {
    // first collect a list of all the unique channels
    const channels = []
    messages.forEach((message) => {
      let exists = false
      channels.forEach((channel) => {
        if (message.channel_id === channel.channel_id) {
          exists = true
        }
      })
      if (!exists) {
        channels.push(message)
      }
    })
    // then create a chat history list for each unique channel, and put all histories into a master list
    // each chat history is ordered by date sent, with latest first
    const latest_threads = []
    channels.forEach((channel) => {
      const sorted_messages_per_channel = messages.filter((message) => {
        return message.channel_id === channel.channel_id
      }).sort((a, b) => {
        return b.sent_at - a.sent_at
      })
      latest_threads.push(sorted_messages_per_channel)
    })
    // and then the list of lists is ordered by most recent unread messages first
    // latest_threads.sort((a, b) => {
    //   return
    // })
    // and save to the internal state
    this.setState({
      latest_threads: latest_threads
    })
  }

	render() {
		return (
			<div style={comStyles().container}>
        <Search
            onSearchChange={(e) => this.updateAttr('search_string', e)}
            value={this.state.search_string}
            fluid
            showNoResults={false}
        />
        <Segment.Group>
  				{
            this.state.latest_threads.map((thread) => {
              return (
                <Segment key={thread[0].message_id} onClick={() => this.props.selectThread(thread)} style={comStyles().segment}>
                  { thread[0].tenant_name }
                </Segment>
              )
            })
          }
        </Segment.Group>
			</div>
		)
	}
}

// defines the types of variables in this.props
ChatsPanel.propTypes = {
	history: PropTypes.object.isRequired,
  messages: PropTypes.array.isRequired,         // passed in
  selectThread: PropTypes.func.isRequired,      // passed in
}

// for all optional props, define a default value
ChatsPanel.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(ChatsPanel)

// Get access to state from the Redux store
function mapStateToProps(state) {
	return {

	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapStateToProps, {

	})(RadiumHOC)
)

// ===============================

// the JS function that returns Radium JS styling
const comStyles = () => {
	return {
		container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      minWidth: '250px',
      width: '20%',
      backgroundColor: xLightBlue,
		},
    segment: {
      cursor: 'pointer',
    }
	}
}
