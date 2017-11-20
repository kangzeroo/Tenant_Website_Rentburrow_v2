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
  Image,
} from 'semantic-ui-react'
import { getGroupMembers, } from '../../../../../api/group/group_api'
import { shortenTimestamp, } from '../../../../../api/general/general_api'

class GroupMembersCard extends Component {

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
    })
  }

  goToFacebookUser(e, fb_user_id) {
    if (e) {
      e.stopPropagation()
    }
    window.open(`https://www.facebook.com/${fb_user_id}`, '_blank')
  }

	render() {
		return (
			<div id='GroupMembersCard' style={comStyles().container}>
				<Card.Group>
          <div style={comStyles().feed_container} >
            <Header
              as='h2'
              icon='users'
              content={this.props.group_name ? this.props.group_name + ' Group Members' : 'Group Members'}
            />
            <div style={comStyles().group_members_container}>
            {
              this.state.group_members.map((member) => {
                return (
                  <Card key={member.tenant_id}>
                    <Card.Content>
                      <Image floated='right' shape='circular' src={member.thumbnail} onClick={(e) => this.goToFacebookUser(e, member.fb_user_id)}/>
                      <Card.Header>
                        { member.first_name + ' ' + member.last_name }
                      </Card.Header>
                      <Card.Meta>
                        { 'Application Status: ' + member.doc_status }
                      </Card.Meta>
                      <Card.Description>
                        { member.submitted_at ? `Application Submitted at ${shortenTimestamp(member.submitted_at)}` : 'Application Not Complete' }
                      </Card.Description>
                    </Card.Content>
                  </Card>
                )
              })
            }
            </div>
          </div>
        </Card.Group>
			</div>
		)
	}
}

// defines the types of variables in this.props
GroupMembersCard.propTypes = {
	history: PropTypes.object.isRequired,
  group_id: PropTypes.string.isRequired,      // passed in
  group_name: PropTypes.string.isRequired,      // passed in
}

// for all optional props, define a default value
GroupMembersCard.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(GroupMembersCard)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {

	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {

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
      margin: '10px',
      padding: '10px'
    },
    group_members_container: {
      display: 'flex',
      flexDirection: 'column'
    }
	}
}
