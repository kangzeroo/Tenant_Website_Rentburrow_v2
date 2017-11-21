// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
	Dimmer,
	Loader,
} from 'semantic-ui-react'
import AmenityProofs from '../canvases/AmenityProofs'
import BuildingCommonAreaCanvas from '../canvases/BuildingCommonAreaCanvas'
import SuiteCommonAreaCanvas from '../canvases/SuiteCommonAreaCanvas'
import VirtualTourCanvas from '../canvases/VirtualTourCanvas'
import RoomCanvas from '../canvases/RoomCanvas'


class HomeExplorerCanvas extends Component {

	renderAppropriateCanvas() {
		if (this.props.topContextText === 'Building' && this.props.topContextValue) {
			if (this.props.bottomContextText === 'Common Area' && this.props.bottomContextValue) {
				if (JSON.parse(this.props.bottomContextValue).length && JSON.parse(this.props.bottomContextValue).length > 0) {
	 				return (
	 					<BuildingCommonAreaCanvas
	 						building={this.props.building}
	 						images={this.props.bottomContextValue ? JSON.parse(this.props.bottomContextValue) : null }
	 					/>
	 				)
			  } else {
				 	return (
						<Dimmer active>
			        <Loader>Loading</Loader>
			      </Dimmer>
					)
			  }
			} else if (this.props.bottomContextText === 'Virtual Tour' && this.props.bottomContextValue) {
				return (
					<VirtualTourCanvas
						istaging_url={JSON.parse(this.props.bottomContextValue).istaging_url}
						matterport_url={JSON.parse(this.props.bottomContextValue).matterport_url}
						iguide_url={JSON.parse(this.props.bottomContextValue).iguide_url}
						video_url={JSON.parse(this.props.bottomContextValue).video_url}
					/>
				)
			} else if (this.props.bottomContextValue) {
				return (
					<AmenityProofs
						building={this.props.building}
						bottomContextValue={
							this.props.bottomContextValue
							?
							JSON.parse(this.props.bottomContextValue).map((am) => {
								return {
									value: am
								}
							})
							:
							null
						}
					/>
				)
			}
		} else if (this.props.topContextValue) {
			if (this.props.bottomContextText === 'Common Area' && this.props.bottomContextValue) {
				const btmContext = JSON.parse(this.props.bottomContextValue)
				return (
					<SuiteCommonAreaCanvas
						building={this.props.building}
						images={btmContext && btmContext.imgs && btmContext.imgs.length > 0 ? JSON.parse(this.props.bottomContextValue).imgs.map((i) => {
							return {
								image_url: i
							}
						}) : []}
						suite={this.props.bottomContextValue ? JSON.parse(this.props.bottomContextValue) : null}
					/>
				)
			} else if (this.props.bottomContextText === 'Virtual Tour' && this.props.bottomContextValue) {
				return (
					<VirtualTourCanvas
						istaging_url={JSON.parse(this.props.bottomContextValue).istaging_url}
						matterport_url={JSON.parse(this.props.bottomContextValue).matterport_url}
						iguide_url={JSON.parse(this.props.bottomContextValue).iguide_url}
						video_url={JSON.parse(this.props.bottomContextValue).video_url}
					/>
				)
			} else if (this.props.bottomContextValue && (this.props.bottomContextText.toLowerCase().indexOf('room') > -1 || this.props.bottomContextText.toLowerCase().indexOf('unit') > -1)) {
				return (
					<RoomCanvas
						bottomContextValue={this.props.bottomContextValue ? JSON.parse(this.props.bottomContextValue) : null }
					/>
				)
			} else {
				return (
					<AmenityProofs
						building={this.props.building}
						bottomContextValue={this.props.bottomContextValue && typeof this.props.bottomContextValue === 'array' ? JSON.parse(this.props.bottomContextValue) : [] }
						for_suites={JSON.parse(this.props.bottomContextValue).suite_id}
					/>
				)
			}
		} else {
			return (
				<Dimmer active>
	        <Loader>Loading</Loader>
	      </Dimmer>
			)
		}
	}

	render() {
		return (
			<div id='HomeExplorerCanvas' className='pretty_scrollbar' style={comStyles().container}>
				{
					this.renderAppropriateCanvas()
				}
			</div>
		)
	}
}

// defines the types of variables in this.props
HomeExplorerCanvas.propTypes = {
	history: PropTypes.object.isRequired,
	building: PropTypes.object.isRequired,							// passed in
	topContextValue: PropTypes.string.isRequired,				// passed in
	bottomContextValue: PropTypes.string.isRequired,		// passed in
  topContextText: PropTypes.string,
  bottomContextText: PropTypes.string,
}

// for all optional props, define a default value
HomeExplorerCanvas.defaultProps = {
  topContext: {},
  bottomContext: {},
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(HomeExplorerCanvas)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
    topContextText: redux.selection.nav_top_title,
    bottomContextText: redux.selection.nav_bottom_title,
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
			maxHeight: '100%',
			overflow: 'scroll',
		}
	}
}
