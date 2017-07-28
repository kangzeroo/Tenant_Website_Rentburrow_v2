// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
  Image,
  Button,
	Modal,
  Icon,
} from 'semantic-ui-react'
import { getRoomsFromDb } from '../../../api/room/room_api'
import { getSuitesForBuilding } from '../../../api/suite/suite_api'
import { shortenAddress } from '../../../api/general/general_api'
import { selectBuilding, selectSuite, selectRooms } from '../../../actions/selection/selection_actions'
import RoomsList from '../room/RoomsList'
import CreateRoom from '../room/CreateRoom'


class SuitePage extends Component {

  constructor() {
    super()
    this.state = {
      suite: {},
      toggle_modal: false,        // toggle visibilty of modal
      building: {},
      modal_set: '',              // which modal to show
      context: {}                 // for when you need info from the room
    }
  }

  componentWillMount() {
    if (this.props.suite) {
      this.setState({
        suite: this.props.suite
      })
    }
    if (this.props.building) {
      this.setState({
        building: this.props.building
      })
    }
    // instead of grabbing the building from the redux store, we grab it from the url
    // then compare it against all the buildings in the redux store to get the appropriate one
    const building_id_loc = this.props.location.pathname.indexOf('buildings/')
    const building_id_loc_end = this.props.location.pathname.indexOf('/suite/')
    const building_id = this.props.location.pathname.slice(building_id_loc+10, building_id_loc_end)
    // we do the same for the suite_id
    const suite_id_loc = this.props.location.pathname.indexOf('suite/')
    const suite_id = this.props.location.pathname.slice(suite_id_loc+6)
    // compare building_id from url to all buildings in the redux store
    let building = {}
    this.props.buildings.forEach((b) => {
      if (b.building_id === building_id) {
        building = b
        this.setState({
          building: b
        })
      }
    })
    console.log(building)
    // get suites for building based off url
    getSuitesForBuilding({
      building_id: building_id,
      corporation_id: this.props.corporation.corp_id,
    }).then((results) => {
      const suites = results.map(s => JSON.parse(s)).filter((s) => {
        return s.suite_id === suite_id
      })
      console.log(suites)
      this.setState({
        suite: suites[0] ? suites[0] : {}
      })
      console.log(suites)
      this.props.selectSuite(suites[0])
      this.props.selectBuilding(building)
    })

    // get the rooms for this building
    getRoomsFromDb({
      suite_id: suite_id,
      corporation_id: this.props.corporation.corp_id,
      building_id: building_id,
    }).then((rooms) => {
      this.props.selectRooms(
        rooms.map(r => JSON.parse(r))
      )
    })
  }

  renderAppropriateModal(modal_set, context) {
    if (modal_set === 'add') {
      return this.renderAddRoom()
    } else if (modal_set === 'edit') {
      return this.renderEditSuite()
    } else if (modal_set === 'contract') {
      return this.renderContract(context)
    } else if (modal_set === 'room') {
      return this.renderRoomInfo(context)
    } else if (modal_set === 'message') {
      console.log('Opening up chat...')
    }
  }

  renderAddRoom() {
    return (
      <div>
        <Modal.Header>Add New Room</Modal.Header>
        <Modal.Content image>
          <CreateRoom suite_id={this.state.suite.suite_id} building_id={this.props.building.building_id} corporation_id={this.props.corporation.corp_id} />
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => this.toggleModal(false)}>
            Nope
          </Button>
        </Modal.Actions>
      </div>
    )
  }

  renderEditSuite() {
    return (
      <div>
        <Modal.Header>Edit Suite</Modal.Header>
        <Modal.Content image>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => this.toggleModal(false)}>
            Nope
          </Button>
        </Modal.Actions>
      </div>
    )
  }

  renderContract(context) {
    return (
      <div>
        <Modal.Header>Contract</Modal.Header>
        <Modal.Content image>
          { context.room_alias }
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => this.toggleModal(false)}>
            Nope
          </Button>
        </Modal.Actions>
      </div>
    )
  }

  renderRoomInfo(context) {
    return (
      <div>
        <Modal.Header>About Room</Modal.Header>
        <Modal.Content image>
          { context.room_alias }
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => this.toggleModal(false)}>
            Nope
          </Button>
        </Modal.Actions>
      </div>
    )
  }

  toggleModal(bool, attr, context) {
    this.setState({
      toggle_modal: bool,
      modal_set: attr,
      context: context
    })
  }

	render() {
		return (
			<div style={comStyles().container}>
        <div style={coverStyles().outer_sleeve}>
          <Image src={this.state.suite.thumbnail} style={coverStyles().cover} />
          <div style={coverStyles().title_sticker}>
            <div onClick={() => this.props.history.push(`/buildings/${this.props.building.building_id}`)} style={coverStyles().leftSide}>
              <Icon name='arrow left' style={coverStyles().backBtn} />
            </div>
            <div style={coverStyles().rightSide}>
              <div style={coverStyles().suite_num}>{`Suite ${this.state.suite.suite_num}`}</div>
              <div style={coverStyles().suite_alias}>{ shortenAddress(this.state.building.building_address) }</div>
            </div>
          </div>
          <div style={coverStyles().action_sticker}>
            <Button.Group size='large'>
              <Button onClick={() => this.toggleModal(true, 'add')}>New Room</Button>
              <Button.Or />
              <Button onClick={() => this.toggleModal(true, 'edit')}>Edit Suite</Button>
            </Button.Group>
          </div>
        </div>

        <RoomsList rooms={this.props.current_rooms} toggleModal={(bool, attr, context) => this.toggleModal(bool, attr, context)} style={comStyles().room_table} />

 				<Modal dimmer='blurring' open={this.state.toggle_modal} onClose={() => this.toggleModal(false)}>
          {
            this.renderAppropriateModal(this.state.modal_set, this.state.context)
          }
 				</Modal>
			</div>
		)
	}
}

// defines the types of variables in this.props
SuitePage.propTypes = {
	history: PropTypes.object.isRequired,
  suite: PropTypes.object,
  building: PropTypes.object.isRequired,
  corporation: PropTypes.object.isRequired,
  selectRooms: PropTypes.func.isRequired,
  current_rooms: PropTypes.array,
  location: PropTypes.object.isRequired,
}

// for all optional props, define a default value
SuitePage.defaultProps = {
  selectSuite: PropTypes.object,
  selectBuilding: PropTypes.object,
  current_rooms: [],
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(SuitePage)

// Get access to state from the Redux store
function mapReduxToProps(state) {
	return {
    suite: state.selection.current_suite,
    buildings: state.corporation.buildings,
    building: state.selection.current_building,
    corporation: state.auth.corporation_profile,
    current_rooms: state.selection.current_rooms,
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
    selectSuite,
    selectBuilding,
    selectRooms,
	})(RadiumHOC)
)

// ===============================

// the JS function that returns Radium JS styling
const comStyles = () => {
	return {
		container: {
      display: 'flex',
      flexDirection: 'column',
      maxHeight: '100%',
      overflowY: 'scroll',
		},
    roomThumbnail: {
      width: '50px',
      height: '50px',
    },
    room_table: {
      margin: '30px auto'
    }
	}
}

const coverStyles = () => {
  return {
    outer_sleeve: {
      minHeight: '400px',
      maxHeight: '400px',
      maxWidth: '100%',
      minWidth: '100%',
      overflow: 'hidden',
      position: 'relative',
    },
    cover: {
      height: 'auto',
      width: '100%',
    },
    action_sticker: {
      position: 'absolute',
      bottom: '10px',
      right: '20px',
      height: '50px',
      width: '250px',
      color: 'white',
      fontSize: '1.5rem'
    },
    title_sticker: {
      minHeight: '100px',
      maxHeight: '100px',
      minWidth: '300px',
      maxWidth: '300px',
      position: 'absolute',
      backgroundColor: 'rgba(0,0,0,0.7)',
      top: '100px',
      color: 'white',
      borderRadius: '3px',
      display: 'flex',
      flexDirection: 'row',
    },
    leftSide: {
      width: '70px',
      maxHeight: '100%',
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      cursor: 'pointer'
    },
    rightSide: {
      width: '230px',
      maxHeight: '100%',
      display: 'flex',
      flexDirection: 'column',
    },
    backBtn: {
      fontSize: '2rem',
      color: 'white',
    },
    suite_num: {
      fontSize: '2rem',
      height: '60px',
      textAlign: 'center',
      alignItems: 'flex-end',
      justifyContent: 'center',
      padding: '20px 0px 0px 0px'
    },
    suite_alias: {
      fontSize: '1rem',
      height: '40px',
      textAlign: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      flexWrap: 'wrap'
    }
  }
}
