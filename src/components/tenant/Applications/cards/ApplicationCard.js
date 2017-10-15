// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import moment from 'moment'
import { withRouter } from 'react-router-dom'
import {
  Card,
  Button,
  Image,
} from 'semantic-ui-react'
import {
  shortenAddress,
} from '../../../../api/general/general_api'
import SentApplicationPage from '../SentApplicationPage'

class ApplicationCard extends Component {

  goToOriginalPost(e, post_id) {
    if (e) {
      e.stopPropagation()
    }
    window.open(`https://www.facebook.com/${post_id}`, '_blank')
  }

  goToFacebookUser(e, fb_user_id) {
    if (e) {
      e.stopPropagation()
    }
    window.open(`https://www.facebook.com/${fb_user_id}`, '_blank')
  }

	render() {
		return (
			<div style={comStyles().container}>
				<Card>
          <Card.Content>
            <Card.Header>
              {shortenAddress(this.props.details.building_address)}
              <Image
                shape='circular'
                src={this.props.details.subletor_fb_pic}
                size='tiny'
                bordered
                onClick={(e) => this.goToFacebookUser(e, this.props.details.subletor_fb_id)}
                style={comStyles().subletor_pic}
              />
            </Card.Header>
            <Card.Meta>{this.props.details.suite ? 'Suite ' + this.props.details.suite : ''}</Card.Meta>
            <Card.Meta>{this.props.details.room ? 'Room ' + this.props.details.room : ''}</Card.Meta>
            <Card.Meta>{'Applied On ' + moment(this.props.details.created_at).format('MMM Do YYYY')}</Card.Meta>
            <Card.Description>{'Begin Date:  ' + moment(this.props.details.begin_date).format('MMM Do YYYY')}</Card.Description>
            <Card.Description>{'End Date:  ' + moment(this.props.details.end_date).format('MMM Do YYYY')}</Card.Description>
            <Card.Description>{'Monthly Rent:  $' + this.props.details.rent_price}</Card.Description>
            <div style={comStyles().buttons_container}>
              <Button
                primary
                basic
                content='Original Post'
                onClick={(e) => this.goToOriginalPost(e, this.props.details.fb_post_id)}
              />
              {
                this.props.details.contract_link
                ?
                <Button
                  primary
                  basic
                  content='View Contract'
                />
                :
                null
              }
            </div>
          </Card.Content>
        </Card>
			</div>
		)
	}
}

// defines the types of variables in this.props
ApplicationCard.propTypes = {
	history: PropTypes.object.isRequired,
  details: PropTypes.object.isRequired, // passed in
}

// for all optional props, define a default value
ApplicationCard.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(ApplicationCard)

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
      minHeight: '200px',
      margin: '10px auto',
		},
    buttons_container: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: '10px 0px 10px 0px'
    },
    subletor_pic: {
      position: 'absolute',
      top: '5px',
      right: '5px'
    }
	}
}
