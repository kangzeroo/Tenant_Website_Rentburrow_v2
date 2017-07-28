import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Radium from 'radium'
import Rx from 'rxjs'
import { selectPinToRedux } from '../../actions/search/search_actions'
import { pinAlreadyPlaced, checkWherePinExistsInArray, generateEventCard, generatePromoCard } from '../../api/map/map_api'

class MapComponent extends Component {

	constructor() {
		super()
		this.state = {
			mapTarget: null,
			mapEvents: null
		}
		// this.pins holds the actual pins to be placed on the map
		// note that only 1 pin is added per gps coord. if multiple properties with the same gps coords exist, then they will all share 1 pin
		// matching a property to a pin is done by matching gps coords, not property ids. this is done for performance
		this.pins = []
		// this.recenteredPins holds the new pins that were received from server
		// we use this.recenteredPins as a holding array so that we can diff old pins (held in this.pins) with new pins (held in this.recenteredPins)
		// diffing like this improved performance
		// this.recenteredPins = []

		this.paintPins.bind(this)
		this.highlightPin.bind(this)
		this.refreshPins.bind(this)


		this.grey_map_pin = 'http://www.iconsdb.com/icons/preview/icon-sets/grey-wall/pin-8-xxl.png'
		this.red_map_pin = 'https://www.google.com/intl/en_us/mapfiles/marker.png'
		this.blue_map_pin = 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
	}

	componentWillMount() {
		// create an observable stream as a Subject so that it can act as both an observable and an observer
		const center_changed_event_stream = new Rx.Subject()
		// console.log(center_changed_event_stream)
		this.setState({
      mapEvents: center_changed_event_stream
    })
	}

	componentDidMount() {
		this.mountGoogleMap()
	}

	// dont re-render on any redux prop changes, only state changes
	shouldComponentUpdate(prevProps, prevState) {
		let change = false
		if (this.props.listOfResults !== prevProps.listOfResults) {
			change = true
		}
		if (this.props.selected_pin !== prevProps.selected_pin) {
			change = true
		}
		return change
	}

	componentDidUpdate() {
		this.refreshPins(this.props.listOfResults)
	}

	mountGoogleMap() {
		const self = this
		let coords = {
      lat: 43.473897,
      lng: -80.531995
    }
		const mapOptions = {
      center: coords,
      zoom: 15
    }
		const mapTarget = new google.maps.Map(document.getElementById('mapTarget'), mapOptions)
    self.setState({
    	mapTarget: mapTarget
    }, () => {
		    self.refreshPins(self.props.listOfResults)
    })
		// console.log(self.state)
		self.state.mapEvents.debounceTime(500).subscribe(
			(x) => {
				// do something when event happens
			},
			(err) => {
				// console.log('Stream error occurred:')
				console.log(err)
			},
			() => {
				// console.log('Stream finished')
			}
		)
		google.maps.event.addListener(mapTarget, 'center_changed', (event) => {
			const center = mapTarget.getCenter()
			const currentCenterCoords = [parseFloat(center.lng().toFixed(7)), parseFloat(center.lat().toFixed(7))]
		})
	}

	// map the pins on every update
	refreshPins(listOfResults) {
		const self = this
		listOfResults.forEach((n, i) => {
			if (!pinAlreadyPlaced(n, self.pins)) {
				let marker
        let infowindow
				if (true) {
	        marker = new google.maps.Marker({
	            position: new google.maps.LatLng(n.gps_x, n.gps_y),
	            pin_type: 'building',
							icon: this.red_map_pin,
	        })
	        marker.pin_id = n.building_id
          marker.infowindow = new google.maps.InfoWindow({
            content: `<div>${n.building_address}</div>`
          })
	      }
        // listen to marker click
        marker.addListener('click', (event) => {
          marker.infowindow.open(self.state.mapTarget, marker)
					self.props.selectPinToRedux(marker.pin_id)
					this.highlightPin(marker)
        })
				// save the pins
				if (marker) {
					marker.setMap(self.state.mapTarget)
					self.pins.push(marker)
				}
			}
		})
		// remove old pins
		self.pins = self.pins.filter((xPin) => {
			const where = checkWherePinExistsInArray(xPin, self.props.listOfResults)
			// console.log(where)
			if (where < 0) {
				// remove the pin from self.recenteredPins
				xPin.setMap(null)
				return false
			} else {
				return true
			}
		})
		// recolor appropriate pins
		self.paintPins()
	}

	// set the pin to a bouncing blue pin
	highlightPin(marker) {
		this.paintPins(marker)
	}

	// this command is to efficiently recolor the pins to their appropriate colors (blue, red, gray)
	paintPins(marker) {
		// let alreadyViewed = {}
		// // console.log(this.props.alreadyViewed.length)
		// this.props.alreadyViewed.forEach((clicked, index)=>{
		// 	alreadyViewed[clicked] = index
		// })

		if (this.pins) {
			// loop through all pins
			for (let m = 0; m<this.pins.length; m++) {
				// check if pin has already been clicked
				let alreadyClicked = false
				// if (alreadyViewed[this.pins[m].pin_id]) {
				// 	alreadyClicked = true
				// }
				// found a pin thats already clicked
        if (alreadyClicked) {
					// if the icon is not a gray pin, set it to one
					if ((this.pins[m].icon !== this.grey_map_pin) || (this.pins[m].animating)) {
          	this.pins[m].setIcon(this.grey_map_pin)
						this.pins[m].setAnimation(null)
						this.pins[m].infowindow.close()
					}
				} else {
					// found a pin that has not yet been clicked
					if ((this.pins[m].icon !== this.red_map_pin) || (this.pins[m].animating)) {
						this.pins[m].setIcon(this.red_map_pin)
						this.pins[m].setAnimation(null)
						this.pins[m].infowindow.close()
					}
        }
				// check if there is a marker passed in
				if (marker) {
					// check if the pin is the one highlighted and set the color to blue and bouncing animation
					if (this.pins[m].pin_id === marker.pin_id) {
	          this.pins[m].setIcon(this.blue_map_pin)
						this.pins[m].setZIndex(12)
						this.pins[m].setAnimation(google.maps.Animation.BOUNCE)
	        }
				}
	    }
		}
	}

	render() {
		return (
			<div style={comStyles().mapContainer}>
				<div id='mapTarget' style={comStyles().mapTarget} />
			</div>
		)
	}
}

MapComponent.propTypes = {
  listOfResults: PropTypes.array,        // passed in
	selected_pin: PropTypes.string,				// passed in
  selectPinToRedux: PropTypes.func.isRequired,
}

// for all optional props, define a default value
MapComponent.defaultProps = {
  listOfResults: []
}

const RadiumHOC = Radium(MapComponent)

const mapStateToProps = (redux) => {
	return {
	}
}

export default connect(mapStateToProps, {
	selectPinToRedux,
})(RadiumHOC)


// =====================================
const comStyles = () => {
	return {
		mapContainer: {
			width: '100%',
			height: '93vh'
		},
		mapTarget: {
			width: '40vw',
			height: '100%'
		}
	}
}
