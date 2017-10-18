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
import SubletCard from '../../housing/cards/SubletCard'
import { convertToRegularSubletObj } from '../../../api/signing/sublet_contract_api'


class InvalidSubletor extends Component {

	render() {
		return (
			<div style={comStyles().container}>

        <div style={comStyles().message}>
				    You do not have access to this sublet contract because you are not the original tenant ({`${convertToRegularSubletObj(this.props.sublet_post).fb_user_name}`}).
        </div>

        <SubletCard
  				key={`${convertToRegularSubletObj(this.props.sublet_post).post_id}`}
  				sublet={convertToRegularSubletObj(this.props.sublet_post)}
  			/>
			</div>
		)
	}
}

// defines the types of variables in this.props
InvalidSubletor.propTypes = {
	history: PropTypes.object.isRequired,
  sublet_post: PropTypes.object.isRequired, // passed in
}

// for all optional props, define a default value
InvalidSubletor.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(InvalidSubletor)

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
      width: '100%',
      height: '100%',
      textAlign: 'center',
      padding: '200px',
		},
    message: {
      fontWeight: 'bold',
      fontSize: '2rem',
      lineHeight: '40px',
      padding: '20px',
    }
	}
}
