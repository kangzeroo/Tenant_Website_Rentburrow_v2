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
// import SubletCard from '../housing/cards/SubletCard'


class SubletsList extends Component {

	render() {
		return (
			<div style={comStyles().container}>
				{
					this.props.sublets.map((sublet) => {
						return (
							{/*<SubletCard
								key={sublet.post_id}
								sublet={sublet}
							/>*/}
						)
					})
				}
			</div>
		)
	}
}

// defines the types of variables in this.props
SubletsList.propTypes = {
	history: PropTypes.object.isRequired,
	sublets: PropTypes.array,		// passed in
}

// for all optional props, define a default value
SubletsList.defaultProps = {
	sublets: [],
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(SubletsList)

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
			maxWidth: '100%',
			minWidth: '100%',
			overflowX: 'scroll',
			height: '300px',
		}
	}
}
