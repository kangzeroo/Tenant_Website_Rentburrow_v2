// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {

} from 'semantic-ui-react'


class ChatsDash extends Component {

	render() {
		return (
			<div style={comStyles().container}>
				<div style={comStyles().header}>
          {
            this.props.thread.length > 0
            ?
            <h3>{ this.props.thread[0].tenant_name }</h3>
            :
            <h3>Messages</h3>
          }
        </div>
        {
          this.props.thread.length > 0
          ?
          <div>
            {
              this.props.thread.map((message) => {
                return (
                  <div key={message.message_id}>
                    { message.message_contents }
                  </div>
                )
              })
            }
          </div>
          :
          <div>
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
  thread: PropTypes.array.isRequired,         // passed in
}

// for all optional props, define a default value
ChatsDash.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(ChatsDash)

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
		},
    header: {
      width: '100%',
      height: '50px',
      textAlign: 'center',
    }
	}
}
