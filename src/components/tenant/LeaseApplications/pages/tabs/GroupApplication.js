// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
  Image,
  Card,
  Feed,
} from 'semantic-ui-react'
import GroupMembersCard from '../cards/GroupMembersCard'
import SuitePreferencesCard from '../cards/SuitePreferencesCard'
import {
  getGroupMembers,
} from '../../../../../api/group/group_api'
import {
  renderProcessedImage
} from '../../../../../api/general/general_api'

class GroupApplication extends Component {

  constructor() {
    super()
    this.state = {
      group_members: [],
    }
  }

  componentWillMount() {
    // getGroupMembers(this.props.group_app.group_id)
    // .then((data) => {
    //   this.setState({
    //     group_members: data
    //   })
    //   console.log(data)
    // })
  }

  renderGroupMember(member) {
    return (
      <Feed.Event>
        <Feed.Label image={member.thumbnail} />
        <Feed.Content summary={`${member.first_name} ${member.last_name}`} />
      </Feed.Event>
    )
  }

  // `Application Status: ${member.application_status}`
  // { member.submitted_at ? `Application Submitted at ${member.submitted_at}` : 'Application Not Complete' }

	render() {
		return (
			<div style={comStyles().container}>
        <div style={comStyles().row_one} >
          <div style={comStyles().building_image} >
    				<Image
              size='big'
              src={renderProcessedImage(this.props.building.cover_photo)}
            />
          </div>
          <div style={comStyles().group_members_container} >
            <GroupMembersCard
              group_id={this.props.group_app.group_id}
              group_name={this.props.group_app.group_name}
            />
          </div>
        </div>
        <SuitePreferencesCard
          group_id={this.props.group_app.group_id}
        />
			</div>
		)
	}
}

// defines the types of variables in this.props
GroupApplication.propTypes = {
	history: PropTypes.object.isRequired,
  group_app: PropTypes.object.isRequired,     // passed in
  building: PropTypes.object.isRequired,      // passed in
}

// for all optional props, define a default value
GroupApplication.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(GroupApplication)

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
      height: 'auto'
		},
    row_one: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      height: '400px'
    },
    group_members_container: {
      width: '50%'
    }
	}
}
