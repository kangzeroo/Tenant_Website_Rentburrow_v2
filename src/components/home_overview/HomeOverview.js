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
	Table,
  Button,
	Modal,
	Image,
	Card,
} from 'semantic-ui-react'
import HomeExplorer from '../home_explorer/HomeExplorer'
import { xGreyText, xBootstrapRed } from '../../styles/base_colors'
import BuildingOverviewRow from './rows/BuildingOverviewRow'
import SuiteOverviewRow from './rows/SuiteOverviewRow'


class HomeOverview extends Component {
	constructor() {
		super()
		this.state = {
			all_suite_amenities: [],
			toggle_modal: false,
      modal_name: '',
      context: {},
    }
	}

	componentWillMount() {
		Promise.all(this.props.promise_array_of_suite_amenities_with_id).then((all_results) => {
			this.setState({
				all_suite_amenities: all_results.map((amenity_summary) => {
					return {
						suite_id: amenity_summary.suite_id,
						amenities: amenity_summary.amenities.map((amenity_string) => {
							return JSON.parse(amenity_string)
						})
					}
				})
			})
		})
	}

	toggleModal(bool, attr, context) {
		console.log('toggleModal')
		this.setState({
      toggle_modal: bool,
      modal_name: attr,
      context,
    }, () => console.log(this.state))
  }

	renderAppropriateModal(modal_name, context) {
		if (modal_name === 'suite') {
	    return (
	      <Modal
					dimmer
					open={this.state.toggle_modal}
					onClose={() => this.toggleModal(false)}
					closeIcon
					size='fullscreen'
				>
	        <Modal.Content>
						<HomeExplorer
							building={this.props.building}
							current_suite={context}
							all_suites={this.props.suites}
						/>
	        </Modal.Content>
	      </Modal>
	    )
		} else if (modal_name === 'building') {
			return (
				<Modal
					dimmer
					open={this.state.toggle_modal}
					onClose={() => this.toggleModal(false)}
					closeIcon
					size='fullscreen'
				>
	        <Modal.Content>
						<HomeExplorer
							building={this.props.building}
							all_suites={this.props.suites}
							showBuildingCommonAreaFirst
						/>
	        </Modal.Content>
	      </Modal>
			)
		}
  }

	render() {
		return (
			<div style={comStyles().container} >
				<BuildingOverviewRow
					key='building_overview_row'
					building={this.props.building}
					toggleModal={(bool, title, context) => this.toggleModal(bool, title, context)}
				/>
				{
					this.props.suites.map((suite) => {
						return (
							<SuiteOverviewRow
								key={suite.suite_id}
								building={this.props.building}
								suite={suite}
								toggleModal={(bool, title, context) => this.toggleModal(bool, title, context)}
							/>
						)
					})
				}
				{
          this.renderAppropriateModal(this.state.modal_name, this.state.context)
        }
			</div>
		)
	}
}

// defines the types of variables in this.props
HomeOverview.propTypes = {
  history: PropTypes.object.isRequired,
  suites: PropTypes.array.isRequired,			// passed in
	building: PropTypes.object.isRequired,	// passed in
	promise_array_of_suite_amenities_with_id: PropTypes.array,		// passed in
}

// for all optional props, define a default value
HomeOverview.defaultProps = {
	promise_array_of_suite_amenities_with_id: [],
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(HomeOverview)

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
			width: '100%',
			height: '100%',
		},
		images_gallery: {
			width: 'auto',
			height: '100%'
		},
		hardCard: {
      width: '100%',
      minHeight: '225px',
      margin: '10px auto',
      display: 'flex',
      flexDirection: 'row',
    },
    info: {
      backgroundColor: 'rgba(0,0,0,0)',
      display: 'flex',
      flexDirection: 'column',
      // padding: '30px 10px 10px 10px',
    },
    more_info: {
      display: 'flex',
      flexDirection: 'row',
    },
    user_container: {
      display: 'flex',
      flexDirection: 'row',
      right: '5px',
      top: '5px',
      position: 'absolute',
      maxHeight: '45px',
      maxWidth: '45px',
      cursor: 'pointer',
    },
		infobar: {
			width: '100%',
			display: '-webkit-box', display: '-webkit-flex', display: 'flexbox', display: 'box', display: 'flex',
			justifyContent: 'flex-start',
			alignItems: 'flex-start',
			WebkitBoxOrient: 'horizontal', WebkitBoxDirection: 'normal', flexDirection: 'row',
			padding: '10px',
      maxHeight: '150px',
		},
		price: {
			fontSize: '2.5rem',
			fontWeight: 'bold',
			color: xGreyText,
		},
		imageTile: {
			position: 'absolute',
			right: '0px',
			margin: '0 auto',
		},
		imageTileIcon: {
			fontSize: '1.7rem',
			margin: '0 auto',
			cursor: 'pointer',
			':hover': {
				color: xBootstrapRed
			}
		},
		iconbar: {
			width: '100%',
			display: '-webkit-box', display: '-webkit-flex', display: 'flexbox', display: 'box', display: 'flex',
			WebkitBoxPack: 'justify', WebkitJustifyContent: 'center', justifyContent: 'center',
			fontSize: '1rem',
			color: xGreyText,
			flexWrap: 'wrap'
		},
		buttonsBar: {
			display: '-webkit-box', display: '-webkit-flex', display: 'flexbox', display: 'box', display: 'flex',
			WebkitBoxPack: 'justify', WebkitJustifyContent: 'center', justifyContent: 'center',
			width: '100%',
			margin: 'auto',
			fontSize: '1.1rem',
			fontWeight: 'bold'
		},
    desc: {
      height: '80%',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
		seeOriginalAhref: {
			flexGrow: 3
		},
		seeOriginal: {
			borderRadius: '0px',
			width: '100%'
		},
		map: {
			borderRadius: '0px',
			flexGrow: 1
		},
		heartIcon: {
			fontSize: '2rem',
			fontWeight: 'bold',
			right: '0px',
			width: '10%',
			color: xBootstrapRed,
			cursor: 'pointer'
		},
		thumbnailBar: {
			display: '-webkit-box', display: '-webkit-flex', display: 'flexbox', display: 'box', display: 'flex',
			WebkitBoxOrient: 'horizontal', WebkitBoxDirection: 'normal', flexDirection: 'row',
			WebkitBoxPack: 'justify', WebkitJustifyContent: 'center', justifyContent: 'center',
			maxHeight: '30px',
			margin: '10px 0px 0px 0px',
			overflowX: 'scroll'
		},
		thumbnail: {
			height: '30px',
			width: 'auto',
			opacity: '0.3',
			':hover': {
				opacity: '1'
			},
		},
		blankPlaceholderImage: {
			height: '30px',
			width: '100%'
		},
    amenity_icon: {
      display: 'flex',
      flexDirection: 'column',
      margin: '10px',
      justifyContent: 'center',
      alignItems: 'center',
    },
    amenity_caption: {
      margin: '5px auto',
    },
		left: {
      width: '40%',
      minHeight: '100%',
      maxHeight: '100%',
      minWidth: '360px',
			padding: '20px',
    },
		left_top: {
			height: '30%',
			width: '100%',
			color: xGreyText,
			fontSize: '2.2rem',
			fontWeight: 'bold',
			margin: '5px 0px 0px 0px',
			textAlign: 'center',
			padding: '15px',
			lineHeight: '35px',
		},
		left_middle: {
			height: '55%',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
		},
		left_bottom: {
			height: '15%',
		},
		explore_button: {
			height: '100%',
			width: '100%',
			fontSize: '1.8rem',
		},
    center: {
      width: '60%',
      minWidth: '360px',
      minHeight: '100%',
    },
    imageGallery: {
      height: '100%',
      minHeight: '250px',
      maxHeight: '250px',
    },
    right: {
      width: '40%',
      color: xGreyText,
      minHeight: '100%',
      maxHeight: '100%',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      justifyContent: 'center',
      padding: '20px',
      minWidth: '360px',
    },
		ImageGallery: {
			height: '100%',
			maxHeight: '100%',
		}
	}
}
