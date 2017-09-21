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
import { calculateSimpleSuiteBaths } from '../../api/amenities/amenity_calculations'
import SingularImageGallery from '../image/SingularImageGallery'
import { xGreyText, xBootstrapRed } from '../../styles/base_colors'

class AvailableSuites extends Component {
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
		this.setState({
      toggle_modal: bool,
      modal_name: attr,
      context,
    })
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

	/*render() {
		return (
      <div style={comStyles().container} >
        <h3>Explore Photos Of This Home</h3>
        <Table basic selectable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Suite Style</Table.HeaderCell>
              <Table.HeaderCell>Rooms</Table.HeaderCell>
              <Table.HeaderCell>Baths</Table.HeaderCell>
              <Table.HeaderCell>Rooms starting at</Table.HeaderCell>
							<Table.HeaderCell></Table.HeaderCell>
              <Table.HeaderCell />
            </Table.Row>
          </Table.Header>
          <Table.Body>
						<Table.Row key='Building' >
							<Table.Cell>The Building Common Areas</Table.Cell>
							<Table.Cell></Table.Cell>
							<Table.Cell></Table.Cell>
							<Table.Cell></Table.Cell>
							<Table.Cell></Table.Cell>
							<Table.Cell>
								<Button
									basic
									fluid
									onClick={() => this.toggleModal(true, 'building', this.props.building)}
									color='green'
									content='Explore'
								/>
							</Table.Cell>
						</Table.Row>
            {
              this.props.suites.map((suite) => {
                return (
                  <Table.Row key={suite.suite_code} >
                    <Table.Cell>{`${suite.suite_alias} Unit`}</Table.Cell>
                    <Table.Cell>{suite.total}</Table.Cell>
                    <Table.Cell>{ this.state.all_suite_amenities.length > 0 ? calculateSimpleSuiteBaths(suite, this.state.all_suite_amenities) : '?'}</Table.Cell>
                    <Table.Cell>${parseInt(suite.min_price, 10)}</Table.Cell>
										<Table.Cell>
										<div style={comStyles().images_gallery}>
											{ console.log(suite)}
											<SingularImageGallery
												list_of_images={suite.imgs}
												image_size='thumbnail'
											/>
										</div>
										</Table.Cell>
                    <Table.Cell>
                      <Button
                        basic
												fluid
												onClick={() => this.toggleModal(true, 'suite', suite)}
                        color='green'
                        content='Explore'
                      />
                    </Table.Cell>
                  </Table.Row>
                )
              })
            }
          </Table.Body>
        </Table>
				{
          this.renderAppropriateModal(this.state.modal_name, this.state.context)
        }
      </div>
    )
	} */

	renderSuiteCard(suite) {
		return (
			<Card
				key={suite.suite_id}
				raised
				style={comStyles().hardCard}
			>
				<div style={comStyles().left} >
					<div id='infobar' style={comStyles().infobar} >
							<Image
								shape='circular'
								src={suite.thumbnail}
								size='tiny'
								bordered
							/>

						<div id='infobadge' style={comStyles().infobadge} >
							<div style={comStyles().address}>
								{suite.suite_code}
							</div>
							<div style={comStyles().userinfo}>
								{suite.suite_alias}
							</div>
						</div>

						<div style={comStyles().pricediv}>
							<div style={comStyles().price}>
								${parseInt(suite.min_price, 10)}
							</div>
						</div>
					</div>


				</div>

				<div style={comStyles().center} >
					<div style={comStyles().ImageGallery} >
						<SingularImageGallery
							list_of_images={[suite.cover_photo].concat(suite.imgs)}
							image_size='thumbnail'
						/>
					</div>
				</div>
			</Card>
		)
	}

	render() {
		return (
			<div style={comStyles().container} >
				{
					this.props.suites.map((suite) => {
						return this.renderSuiteCard(suite)
					})
				}
			</div>
		)
	}
}

// defines the types of variables in this.props
AvailableSuites.propTypes = {
  history: PropTypes.object.isRequired,
  suites: PropTypes.array.isRequired,			// passed in
	building: PropTypes.object.isRequired,	// passed in
	promise_array_of_suite_amenities_with_id: PropTypes.array,		// passed in
}

// for all optional props, define a default value
AvailableSuites.defaultProps = {
	promise_array_of_suite_amenities_with_id: [],
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(AvailableSuites)

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
      minWidth: '600px',
      width: '100%',
      minHeight: '225px',
      maxHeight: '225px',
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
      backgroundColor: 'rgba(0,0,0,0.05)',
      maxHeight: '70px',
		},
		infobadge: {
			display: '-webkit-box', display: '-webkit-flex', display: 'flexbox', display: 'box', display: 'flex',
			WebkitBoxOrient: 'vertical', WebkitBoxDirection: 'normal', flexDirection: 'column',
			margin: '1% 1% 1% 5%',
			width: '70%',
		},
		address: {
			fontSize:'1.6rem',
			fontWeight:'bold',
			width: '100%',
			height:'60%',
			color: xGreyText,
		},
		userinfo: {
			width: '100%',
			height: '35%',
			color: xGreyText,
			fontSize: '1.1rem',
			margin: '5px 0px 0px 0px'
		},
		pricediv: {
			textAlign:'center',
			padding: '50px',
			display: '-webkit-box', display: '-webkit-flex', display: 'flexbox', display: 'box', display: 'flex',
			WebkitBoxOrient: 'horizontal', WebkitBoxDirection: 'normal', flexDirection: 'row',
			WebkitBoxPack: 'justify', WebkitJustifyContent: 'center', justifyContent: 'center',
			position: 'relative',
		},
		price: {
			fontSize:'2.5rem',
			fontWeight:'bold',
			color: xGreyText,
			width: '100%',
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
      width: '30%',
      height: '100%',
      minWidth: '360px',
    },
    center: {
      width: '30%',
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
    }
	}
}
