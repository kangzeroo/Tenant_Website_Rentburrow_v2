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
import { getAmenitiesForSuite  } from '../../api/building/building_api'
import { calculateSimpleSuiteBaths } from '../../api/amenities/amenity_calculations'


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
		const promises = this.props.suites.map((suite) => {
			return getAmenitiesForSuite({
				building_id: this.props.building.building_id,
				suite_id: suite.suite_id,
			}).then((data) => {
				return Promise.resolve({
					suite_id: suite.suite_id,
					amenities: data,
				})
			})
		})
		Promise.all(promises).then((all_results) => {
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
		}
  }

	render() {
		return (
      <div style={comStyles().container} >
        <h3>Select a Suite</h3>
        <Table basic selectable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Suite Style</Table.HeaderCell>
              <Table.HeaderCell>Rooms</Table.HeaderCell>
              <Table.HeaderCell>Baths</Table.HeaderCell>
              <Table.HeaderCell>Rooms starting at</Table.HeaderCell>
              <Table.HeaderCell />
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {
              this.props.suites.map((suite) => {
                return (
                  <Table.Row key={suite.suite_code} >
                    <Table.Cell>{suite.suite_alias}</Table.Cell>
                    <Table.Cell>{suite.total}</Table.Cell>
                    <Table.Cell>{ this.state.all_suite_amenities.length > 0 ? calculateSimpleSuiteBaths(suite, this.state.all_suite_amenities) : '?'}</Table.Cell>
                    <Table.Cell>${parseInt(suite.min_price)}</Table.Cell>
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
}

// for all optional props, define a default value
AvailableSuites.defaultProps = {
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

	}
}
