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
import SubletDetailed from './SubletDetailed'
import { xGreyText, xBootstrapRed } from '../../styles/base_colors'
import MapComponent from '../map/MapComponent'


class SubletsList extends Component {

	render() {
		return (
			<div style={comStyles().container}>
				<div style={comStyles().header}>Sublets from Facebook</div>
				{
					this.props.sublets.length > 0
					?
					<MapComponent
						listOfResults={this.props.sublets}
						selected_pin={this.props.sublets[0].post_id}
						CSS_mapWidth='100%'
						CSS_mapHeight='300px'
					/>
					:
					null
				}
				<div style={comStyles().scroll}>
					{
						this.props.sublets.map((sublet) => {
							return (
								<SubletDetailed
									key={sublet.post_id}
									sublet={sublet}
								/>
							)
						})
					}
				</div>
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
      flexDirection: 'column',
			maxWidth: '100%',
			minWidth: '100%',
			height: '100%',
			maxHeight: '100%',
			padding: '20px',
		},
		header: {
			height: '50px',
			width: '100%',
			padding: '10px',
			fontSize: '2rem',
			fontWeight: 'bold',
			color: xGreyText,
		},
		scroll: {
			overflowY: 'scroll',
      display: 'flex',
      flexDirection: 'column',
		}
	}
}
