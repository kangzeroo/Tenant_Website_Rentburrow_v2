// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import Dropzone from 'react-dropzone'
import { withRouter } from 'react-router-dom'
import {
	Card,
	Icon,
	Image,
	Button,
} from 'semantic-ui-react'


class AccountDropdown extends Component {

	render() {
		return (
			<div style={comStyles().container}>
				<Card>
			    <Card.Content>
			      <Card.Header>
			        {this.props.staffProfile.name}
			      </Card.Header>
			      <Card.Meta>
			        <span className='date'>
			          {this.props.staffProfile.staff_title}
			        </span>
			      </Card.Meta>
			      <Card.Description>
			        {this.props.corporationProfile.corp_name}
			      </Card.Description>
			    </Card.Content>
			    <Card.Content extra style={comStyles().info}>
			      <a>
			        <Icon name='phone' />
			        {this.props.staffProfile.phone}
			      </a>
			      <a>
			        <Icon name='mail' />
			        {this.props.staffProfile.email}
			      </a>
			    </Card.Content>
			  </Card>
			</div>
		)
	}
}

// defines the types of variables in this.props
AccountDropdown.propTypes = {
	history: PropTypes.object.isRequired,
	staffProfile: PropTypes.object.isRequired,
	corporationProfile: PropTypes.object.isRequired,
}

// for all optional props, define a default value
AccountDropdown.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(AccountDropdown)

// Get access to state from the Redux store
function mapStateToProps(state) {
	return {
		staffProfile: state.auth.staff_profile,
		corporationProfile: state.auth.corporation_profile,
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
      position: 'absolute',
      top: '60px',
      right: '0px',
      width: '250px',
			height: '500px',
		},
		info: {
      display: 'flex',
      flexDirection: 'column',
		},
    uploadQueueThumbnail: {
      width: '50px',
      height: '50px',
      overflow: 'hidden',
    }
	}
}
