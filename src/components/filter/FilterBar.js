// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import {
  Image,
  Icon,
  Input,
  Dropdown,
  Checkbox,
  Segment,
  Header,
  Modal,
} from 'semantic-ui-react'
import {
  shortenAddress,
  renderProcessedImage,
  renderProcessedThumbnail,
} from '../../api/general/general_api'

class FilterBar extends Component {

  constructor() {
    super()
    this.state = {
      price: 300,
      num_of_rooms: 0,

      toggle_modal: false,
      modal_name: '',
      context: {},
    }
  }

  componentWillMount() {
    this.setState({
    })
  }

  handlePrice(e) {
    this.setState({
      price: e.target.value
    })
  }

  handleRoomNum(e) {
    this.setState({
      num_of_rooms: e.target.value
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
		if (modal_name === 'type') {
	    return (
	      <Modal
					dimmer
					open={this.state.toggle_modal}
					onClose={() => this.toggleModal(false)}
					closeIcon
          inverted
					size='fullscreen'
				>
        <div style={comStyles().type_container}>
          <Segment style={comStyles().type_seg}>
            <Checkbox />
            <Header
              content='Building'
              subheader='multistory building'
            />
            <Icon name='building' size='big' />
          </Segment>
          <Segment style={comStyles().type_seg}>
            <Checkbox />
            <Header
              content='House'
              subheader='Detached/Duplex House'
            />
            <Icon name='bed' size='big' />
          </Segment>
        </div>
	      </Modal>
	    )
		}
  }

	render() {
		return (
			<div style={comStyles().container}>
        <Dropdown
          text='Property Type'
        >
          <Dropdown.Menu>
            <div style={comStyles().type_container}>
              <Segment style={comStyles().type_seg}>
                <Checkbox />
                <Header
                  content='Building'
                  subheader='multistory building'
                />
                <Icon name='building' size='big' />
              </Segment>
              <Segment style={comStyles().type_seg}>
                <Checkbox />
                <Header
                  content='House'
                  subheader='Detached/Duplex House'
                />
                <Icon name='bed' size='big' />
              </Segment>
            </div>
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown
          text='Room Price Range'
        >
          <Dropdown.Menu >
          <div style={comStyles().price_container} >
            <h2>${this.state.price} CAD/month</h2>
            <Input
              min={300}
              max={3000}
              onChange={e => this.handlePrice(e)}
              step={10}
              type='range'
              style={comStyles().price_range}
            />
          </div>
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown
          text='Number of Rooms'
        >
          <Dropdown.Menu>
            <div style={comStyles().num_rooms_container} >
              <Checkbox
                label='1 Room'

                checked={this.state.num_of_rooms === 1}
                onClick={e => this.handleRoomNum(1)}
              />
              <Checkbox
                label='2 Rooms'
                checked={this.state.num_of_rooms === 2}
                onClick={e => this.handleRoomNum(2)}
              />
              <Checkbox
                label='3 Rooms'
                checked={this.state.num_of_rooms === 3}
                onClick={e => this.handleRoomNum(3)}
              />
              <Checkbox
                label='4 Rooms'
                checked={this.state.num_of_rooms === 4}
                onClick={e => this.handleRoomNum(4)}
              />
              <Checkbox
                label='5 Rooms'
                checked={this.state.num_of_rooms === 5}
                onClick={e => this.handleRoomNum(5)}
              />
            </div>
          </Dropdown.Menu>
        </Dropdown>
        {
          this.renderAppropriateModal(this.state.modal_name, this.state.context)
        }
			</div>
		)
	}
}

// defines the types of variables in this.props
FilterBar.propTypes = {
}

// for all optional props, define a default value
FilterBar.defaultProps = {
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(FilterBar)

// Connect together the Redux store with this React component
export default RadiumHOC

// ===============================

// the JS function that returns Radium JS styling
const comStyles = () => {
	return {
		container: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
      // minHeight: '500px',
      // maxHeight: '500px',
      minHeight: '40px',
      maxHeight: '40px',
      padding: '10px'
		},
    type_container: {
      height: 'auto',
      width: '300px',
      border: 'black solid thin',
      borderRadius: '3px',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
    },
    type_seg: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    price_container: {
      height: '200px',
      width: '500px',
      border: 'black solid thin',
      borderRadius: '3px',
      padding: '20px',
    },
    price_range: {
      width: '90%'
    },
    num_rooms_container: {
      height: '300px',
      width: '200px',
      border: 'black solid thin',
      borderRadius: '3px',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    }
	}
}
