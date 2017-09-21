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
} from 'semantic-ui-react'
import HomeExplorer from '../home_explorer/HomeExplorer'
import { calculateSimpleSuiteBaths } from '../../api/amenities/amenity_calculations'
import SingularImageGallery from '../image/SingularImageGallery'


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

	render() {
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
		images_gallery: {
			width: '300px',
			height: '175px'
		}
	}
}
