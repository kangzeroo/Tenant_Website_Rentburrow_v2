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
  Icon,
} from 'semantic-ui-react'
import {
  xLightBlue,
  xDeepBlue,
} from '../../../styles/base_colors'
import { selectChatThread, selectHelpThread } from '../../../actions/messaging/messaging_actions'
import { selectBuilding, selectCorporation } from '../../../actions/selection/selection_actions'


class ChatsPanel extends Component {

  constructor() {
    super()
    this.state = {
      latest_threads: [],
      search_string: '',
    }
  }

  componentDidMount() {
    this.sortMessages(this.props.all_messages)
  }

  componentWillUpdate(prevProps, prevState) {
    if (prevProps.all_messages !== this.props.all_messages) {
      this.sortMessages(this.props.all_messages)
    }
  }

  updateAttr(attr, event) {
    this.setState({
      [attr]: event.target.value
    })
    if (attr === 'search_string') {
      this.filterMessagesViaSearch(event.target.value.toLowerCase(), this.props.all_messages)
    }
  }

  filterMessagesViaSearch(search_string, all_messages) {
    const filtered_messages = all_messages.filter((m) => {
      return m.building_alias.toLowerCase().indexOf(search_string) > -1 || m.corporation_name.toLowerCase().indexOf(search_string) > -1
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

  selectThisThread(thread) {
    this.props.selectChatThread(thread)
    if (thread.length > 0) {
      this.props.selectBuilding({
        building_id: thread[0].building_id,
        building_address: thread[0].building_alias,
      })
      this.props.selectCorporation({
        corporation_id: thread[0].corporation_id,
        corporation_name: thread[0].corporation_name,
      })
    }
  }

	render() {
		return (
			<div style={comStyles(this.props.history.location.pathname).container}>
        <div style={comStyles().top_bar}>
          <Search
              onSearchChange={(e) => this.updateAttr('search_string', e)}
              value={this.state.search_string}
              fluid
              showNoResults={false}
          />
          <div style={comStyles().action_bar}>
            <Icon name='question' size='large' onClick={() => this.props.selectHelpThread()} />
          </div>
        </div>
        <div style={comStyles().bottom_section}>
          <Segment.Group>
    				{
              this.state.latest_threads.map((thread) => {
                return (
                  <Segment key={thread[0].message_id} onClick={() => this.selectThisThread(thread)} style={comStyles().segment}>
                    { thread[0].corporation_name }
                  </Segment>
                )
              })
            }
            <Segment style={comStyles().rest} />
          </Segment.Group>
        </div>
			</div>
		)
	}
}

// defines the types of variables in this.props
ChatsPanel.propTypes = {
	history: PropTypes.object.isRequired,
  all_messages: PropTypes.array.isRequired,         // passed in
  selectChatThread: PropTypes.func.isRequired,
  selectHelpThread: PropTypes.func.isRequired,
  selected_building: PropTypes.object,
  selected_landlord: PropTypes.object,
  selectBuilding: PropTypes.func.isRequired,
  selectCorporation: PropTypes.func.isRequired,
}

// for all optional props, define a default value
ChatsPanel.defaultProps = {
  selected_building: {},
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(ChatsPanel)

// Get access to state from the Redux store
function mapStateToProps(state) {
	return {
    all_messages: state.messaging.all_messages,
    selected_building: state.selection.selected_building,
    selected_landlord: state.selection.selected_landlord,
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapStateToProps, {
    selectChatThread,
    selectHelpThread,
    selectBuilding,
    selectCorporation,
	})(RadiumHOC)
)

// ===============================

// the JS function that returns Radium JS styling
const comStyles = (pathname) => {
  let width = '25%'
  if (pathname && pathname.indexOf('/chat') === -1) {
    width = '100%'
  }
	return {
		container: {
      display: 'flex',
      flexDirection: 'column',
      alignSelf: 'stretch',
      padding: '10px',
      backgroundColor: 'white',
      width: width,
		},
    top_bar: {
      display: 'flex',
      flexDirection: 'row',
      height: '90px',
      position: 'relative'
    },
    bottom_section: {
      display: 'flex',
      flexDirection: 'column',
      height: '90%',
    },
    segment: {
      cursor: 'pointer',
    },
    rest: {
      height: '90vh'
    },
    action_bar: {
      position: 'absolute',
      right: '10px',
    }
	}
}
