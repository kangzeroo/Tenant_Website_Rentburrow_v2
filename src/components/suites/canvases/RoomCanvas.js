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
import {
  getRoomPage,
} from '../../../api/building/building_api'
import SingularImageGallery from '../../image/SingularImageGallery'

class RoomCanvas extends Component {

	constructor() {
		super()
		this.state = {
			room: {}
		}
	}

	componentWillMount() {
		getRoomPage({
			building_id: this.props.bottomContextValue.building_id,
			suite_id: this.props.bottomContextValue.suite_id,
			room_id: this.props.bottomContextValue.room_id,
		})
		.then((data) => {
			this.setState({
				room: JSON.parse(data)
			})
			console.log(this.state.room)
		})
	}

	createMarkup(string) {
		return {
			__html: string,
		}
	}

	render() {
		return (
			<div style={comStyles().container}>
				<div style={comStyles().cover_photo} >
					<SingularImageGallery
						list_of_images={[this.state.room.thumbnail].concat(this.state.room.imgs)}
					/>
				</div>
				<div style={comStyles().content} >
					<div style={comStyles().content_left} >
						<h2>Room {this.state.room.room_code}</h2>
						<p>{this.state.room.room_alias}</p>
						<div style={comStyles().description} >
							<div
								dangerouslySetInnerHTML={this.createMarkup(this.state.room.room_desc)}
								style={comStyles().textMarkup}
							/>
						</div>
					</div>
					<div style={comStyles().content_right} >

					</div>
				</div>
			</div>
		)
	}
}

// defines the types of variables in this.props
RoomCanvas.propTypes = {
	history: PropTypes.object.isRequired,
	bottomContextValue: PropTypes.object.isRequired,		// passed in
}

// for all optional props, define a default value
RoomCanvas.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(RoomCanvas)

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
			overflow: 'scroll',
			maxHeight: '100%',
		},
    cover_photo: {
    },
	}
}
