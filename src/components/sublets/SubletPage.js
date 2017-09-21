// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import uuid from 'uuid'
import { withRouter } from 'react-router-dom'
import {
} from 'semantic-ui-react'
import {
	matchSubletsByPlaceId,
} from '../../api/search/sublet_api'
import SubletsList from '../sublets/SubletsList'


class SubletPage extends Component {
	constructor() {
		super()
		this.state = {
			sublets: [],
		}
	}

	componentWillMount() {
		let position_start = this.props.location.pathname.indexOf('/sublet/') + 8
    let place_id = this.props.location.pathname.slice(position_start)
    matchSubletsByPlaceId({ place_id }).then((sublets) => {
      this.setState({
        sublets: sublets
      }, () => console.log(this.state.sublets))
    })
	}

	createMarkup(string) {
		return {
			__html: string,
		}
	}

	toggleModal(bool, attr, context) {
		this.setState({
      toggle_modal: bool,
      modal_name: attr,
      context,
    })
  }

	renderAppropriateModal(modal_name, context) {
		return null
  }

	render() {
		return (
			<div style={comStyles().container}>
				<SubletsList
					sublets={this.state.sublets}
				/>
				{
          this.renderAppropriateModal(this.state.modal_name, this.state.context)
        }
			</div>
		)
	}
}

// defines the types of variables in this.props
SubletPage.propTypes = {
	history: PropTypes.object.isRequired,
	location: PropTypes.object,
	// building: PropTypes.object.isRequired,
	tenant: PropTypes.object.isRequired,
}

// for all optional props, define a default value
SubletPage.defaultProps = {
	location: {},
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(SubletPage)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
		// building: redux.selection.selected_building,
		tenant: redux.auth.tenant_profile,
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
		cover_photo: {
			minHeight: '600px',
			maxHeight: '600px',
			minWidth: '100%',
			maxWidth: '100%',
			overflow: 'hidden',
      position: 'relative',
			background: "transparent url('https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif') center no-repeat",
		},
		action_sticker: {
      position: 'absolute',
      bottom: '40px',
      right: '20px',
			height: '50px',
      width: '200px',
      fontSize: '3rem',
			color: 'white'
    },
		title_address: {
			position: 'absolute',
      bottom: '40px',
      left: '0px',
			height: '100px',
      fontSize: '2.8rem',
			fontWeight: 'bold',
			color: 'white',
			backgroundColor: 'rgba(0,0,0,0.6)',
			padding: '30px',
			display: 'flex',
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'flex-start',
		},
		content_top: {
			display: 'flex',
			flexDirection: 'row',
			backgroundColor: 'rgba(153,204,255,0.2)',
		},
		content_bottom: {
			display: 'flex',
			flexDirection: 'row',
			backgroundColor: 'rgba(153,204,255,0.2)',
			height: '500px',
			width: '100%',
		},
		content_left: {
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'space-between',
			flex: '2',
			margin: '20px 20px 20px 50px',
			backgroundColor: 'rgba(153,204,255,0)',
			padding: '10px'
		},
		content_right: {
			display: 'flex',
			flexDirection: 'column',
			flex: '1',
			margin: '20px 50px 20px 20px',
		},
		textMarkup: {
			fontSize: '1rem',
			lineHeight: '2rem',
		},
		about: {
			fontSize: '2.5rem',
			lineHeight: '2.5rem',
			fontWeight: 'bold',
			margin: '10px 0px 10px 0px',
			padding: '5px 0px 5px 0px',
		},
		amenities: {
			margin: '10px 0px 10px 0px',
			backgroundColor: 'white',
		},
		map: {
			margin: '30px 0px 0px 0px',
			width: '100%',
			height: '480px',
		},
		building_header: {
			backgroundColor: 'white',
			display: 'flex',
			flexDirection: 'column',
			borderRadius: '2px',
			padding: '10px',
		},
		description: {
			backgroundColor: 'white',
			margin: '10px 0px 10px 0px',
			borderRadius: '2px',
			padding: '10px',
			borderTop: 'gray solid thin'
		},
		suites_table: {
			backgroundColor: 'white',
			margin: '10px 0px 10px 0px',
			borderRadius: '2px',
			padding: '10px',
		}
	}
}
