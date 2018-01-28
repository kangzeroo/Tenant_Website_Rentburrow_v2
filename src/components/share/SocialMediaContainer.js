// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
  Button,
  Popup,
} from 'semantic-ui-react'


class SocialMediaContainer extends Component {

	render() {
		return (
			<div id='SocialMediaContainer' style={comStyles().container}>
        <a rel='nofollow' href='https://www.facebook.com/renthero.housing/' target='_blank' title='Facebook'>
				    <Button circular color='facebook' icon='facebook f' />
        </a>
        <a rel='nofollow' href='https://www.instagram.com/renthero.housing/' target='_blank' title='Instagram'>
            <Button circular color='instagram' icon='instagram' />
        </a>
        <a rel='nofollow' href='https://twitter.com/rentburrow' target='_blank' title='Twitter'>
            <Button circular color='twitter' icon='twitter' />
        </a>
        {/*<a rel='nofollow' href='https://www.facebook.com/renthero.housing/' target='_blank' title='Facebook'>
          <Button circular color= icon='linkedin square' />
        </a>*/}
        <a rel='nofollow' href='https://www.youtube.com/channel/UC5YDIOmhDaVmXWXYHLfJWxw' target='_blank' title='Youtube'>
        <Button circular color='youtube' icon='youtube play' />
        </a>
        <Popup
          trigger={
            <Button circular color='green' icon='wechat' />
          }
          content={
            <div>RentHeroOfficial</div>
          }
          on='click'
        />
			</div>
		)
	}
}

// defines the types of variables in this.props
SocialMediaContainer.propTypes = {
	history: PropTypes.object.isRequired,
}

// for all optional props, define a default value
SocialMediaContainer.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(SocialMediaContainer)

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
      flexDirection: 'row',
		}
	}
}
