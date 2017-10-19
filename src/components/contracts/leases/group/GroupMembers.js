// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
  Card,
  Feed,
  Header,
} from 'semantic-ui-react'
import { getGroupMembers, } from '../../../../api/group/group_api'
import { saveGroupApplicationToRedux, } from '../../../../actions/group/group_actions'

class GroupMembers extends Component {

  constructor() {
    super()
    this.state = {
      group_members: []
    }
  }

  componentWillMount() {
    getGroupMembers(this.props.group_id)
    .then((data) => {
      this.setState({
        group_members: data
      })
      this.props.saveGroupApplicationToRedux(data)
    })
  }

	render() {
		return (
			<div style={comStyles().container}>
				<Card raised fluid>
          <div style={comStyles().feed_container} >
            <Header
              as='h2'
              content='Group Members'
            />
            <Feed style={comStyles().group_members_container}>
            {
              this.state.group_members.map((member) => {
                console.log(member)
                return (
                  <Feed.Event key={member.tenant_id}>
                    <Feed.Label image={member.thumbnail} />
                    <Feed.Content>
                      { member.first_name + ' ' + member.last_name }
                    </Feed.Content>
                  </Feed.Event>
                )
              })
            }
            </Feed>
          </div>
        </Card>
			</div>
		)
	}
}

// defines the types of variables in this.props
GroupMembers.propTypes = {
	history: PropTypes.object.isRequired,
  group_id: PropTypes.string.isRequired,      // passed in
  saveGroupApplicationToRedux: PropTypes.func,
}

// for all optional props, define a default value
GroupMembers.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(GroupMembers)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {

	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
    saveGroupApplicationToRedux
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
    feed_container: {
      display: 'flex',
      flexDirection: 'column',
      margin: '10px 30px 30px 30px'
    },
    group_members_container: {
      display: 'flex',
      flexDirection: 'column'
    }
	}
}
