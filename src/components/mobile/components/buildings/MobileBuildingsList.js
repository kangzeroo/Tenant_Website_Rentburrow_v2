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
import MobileBuildingCard from '../cards/MobileBuildingCard'

class MobileBuildingsList extends Component {

  constructor() {
		super()
		this.state = {

			running: true,

			page_start: 0,
			page_end: 20,
			page_number: 1,

			dimmer: false,
		}
		this.scrollStream = null
	}

	componentWillMount() {
		// this.props.selectHelpThread()
	}

	componentDidMount() {
		this.scrollStream = new Rx.Subject()
				.debounceTime(500)
				.subscribe(
					(position) => {
		        // Probably you want to load new cards?
						if (position.scrollTop / position.scrollHeight > 0.8) {
		        	this.nextPage(1, position.scrollTop, position.scrollHeight, position.target)
						} else if (position.scrollTop === 0) {
							this.nextPage(-1, position.scrollTop, position.scrollHeight, position.target)
						}
					},
					(err) => {
						// console.log('Stream error occurred:')
						// console.log(err)
					},
					() => {
						// console.log('Stream finished')
					}
				)
	}

	handleScroll(e) {
    this.scrollStream.next({
			target: e.target,
			scrollHeight: e.target.scrollHeight,
			scrollTop: e.target.scrollTop,
			clientHeight: e.target.clientHeight,
		})
		// .filter((positions) => {
		// 	// positions = [0, 1] events from scrollStream
		// 	// check that the position of [1] is less than [0], which indicates that we are scrolling down
		// 	// check that the position of [1] is more than 70% the height of the container
		// 	return positions[0].scrollTop < positions[1].scrollTop && ((positions[1].scrollTop + positions[1].clientHeight) / positions[1].scrollHeight) > (70 / 100)
		// })
  }

	nextPage(direction, scrollTop, scrollHeight, target) {
		if (this.state.page_number + direction !== 0) {
			// edge case where scroll up does not work when you have already reached the end of all sublets
      if (this.props.building_search_results.length >= this.state.page_end) {
        if (this.state.page_end + (direction * 20) < this.props.building_search_results.length) {
  				this.setState({
  					page_start: this.state.page_number === 0 ? 0 : this.state.page_start + (direction * 20),
  					page_end: this.state.page_end + (direction * 20),
  					page_number: this.state.page_number + direction
  				}, () => {
  					if (direction > 0) {
  						target.scrollTop = target.scrollHeight * 0.2
  					} else {
  						target.scrollTop = target.scrollHeight * 0.8
  					}
  				})
        }
			}
		}
	}

	render() {
		return (
      <div id='MobileBuildingsList' style={comStyles().container} >
  			<div onScroll={(e) => this.handleScroll(e)} style={comStyles().scroll}>
  				{
            this.props.building_search_results.slice(this.state.page_start, this.state.page_end).map((building) => {
              return (
                <MobileBuildingCard
                  key={building.building_id}
                  building={building}
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
MobileBuildingsList.propTypes = {
	history: PropTypes.object.isRequired,
  building_search_results: PropTypes.array.isRequired,
  buildings: PropTypes.array.isRequired,        // passed in
}

// for all optional props, define a default value
MobileBuildingsList.defaultProps = {
  // building_search_results: []
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(MobileBuildingsList)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
    building_search_results: redux.search.building_search_results,
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
      background: "transparent url('https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif') center no-repeat",
		},
    regular_nonscroll: {
			display: 'flex',
			flexDirection: 'row',
			flexWrap: 'wrap',
			maxHeight: '100%',
			width: '100%',
			justifyContent: 'flex-start',
		},
		scroll: {
			display: 'flex',
			flexDirection: 'row',
			flexWrap: 'wrap',
      minHeight: '93vh',
			maxHeight: '93vh',
			width: '100%',
			overflowY: 'scroll',
			padding: '10px',
			justifyContent: 'flex-start',
		},
	}
}
