import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Radium from 'radium'
import Rx from 'rxjs'
import { pinAlreadyPlaced, checkWherePinExistsInArray, matchPinIDFromPins } from '../../api/map/map_api'
import { querySubletsInArea } from '../../api/search/sublet_api'
import { selectPopupBuilding } from '../../actions/selection/selection_actions'
import { setCurrentGPSCenter, saveBuildingsToRedux, saveSubletsToRedux, selectPinToRedux, } from '../../actions/search/search_actions'
import {
	queryBuildingsInArea,
} from '../../api/search/search_api'

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


		// this.grey_map_pin = 'http://www.iconsdb.com/icons/preview/icon-sets/grey-wall/pin-8-xxl.png'
		// this.red_map_pin = 'https://www.google.com/intl/en_us/mapfiles/marker.png'
		// this.blue_map_pin = 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'

		this.grey_map_pin = 'https://s3.amazonaws.com/rentburrow-static-assets/Icons/gray-dot.png'
		this.red_map_pin = 'https://s3.amazonaws.com/rentburrow-static-assets/Icons/red-dot.png'
		this.blue_map_pin = 'https://s3.amazonaws.com/rentburrow-static-assets/Icons/blue-dot.png'
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
		const mapOptions = {
      center: self.getCoordsOfCurrentPin(self.props.listOfResults, this.props.selected_pin),
      zoom: 15
    }
		const mapTarget = new google.maps.Map(document.getElementById('mapTarget'), mapOptions)
    self.setState({
    	mapTarget: mapTarget
    }, () => {
		    self.refreshPins(self.props.listOfResults)
    })
		// Observable on google maps 'center_changed' event, with debounceTime() to limit server calls
		self.state.mapEvents.debounceTime(500).subscribe(
			// pass in the currentMapTarget, which is `mapTarget` defined above
			(currentMapTarget) => {
				// do something when event happens
				console.log('Doing somehting!')
				// save to redux the new center gps position
				const center = currentMapTarget.getCenter()
				const currentCenterCoords = {
					lat: parseFloat(center.lat().toFixed(7)),
					lng: parseFloat(center.lng().toFixed(7)),
				}
				this.props.setCurrentGPSCenter(currentCenterCoords)
				// // We want to compare the current center coords with the prev center coords and only requery the db if the distance between the two points is greater than a certain amount
				// const prevCenterCoords = self.props.mapMoved
				// if(self.panToPrev == self.props.panTo && getDistanceFromLatLonInKm(prevCenterCoords, currentCenterCoords) >= 0.5){
					this.requeryDatabaseWithNewCoords(currentCenterCoords)
				// })
			},
			(err) => {
				console.log('Stream error occurred:')
				console.log(err)
			},
			() => {
				console.log('Stream finished')
			}
		)
		// listen to the google map event 'center_changed' and pass it along to the Observable `self.state.mapEvents`
		google.maps.event.addListener(mapTarget, 'center_changed', (event) => {
			self.state.mapEvents.next(mapTarget)
		})
	}

	requeryDatabaseWithNewCoords(currentCenterCoords) {
		if (this.props.rent_type === 'sublet') {
			querySubletsInArea({
				...currentCenterCoords,
				filterParams: this.props.sublet_filter_params,
			}).then((data) => {
        this.props.saveSubletsToRedux(data)
      })
		} else {
			queryBuildingsInArea({
				...currentCenterCoords,
				filterParams: this.props.lease_filter_params,
			}).then((buildings) => {
				this.props.saveBuildingsToRedux(buildings.map(s => JSON.parse(s)))
			})
		}
	}

	getCoordsOfCurrentPin(buildings, selected_pin) {
		// default coords
		let coords = { ...this.props.current_gps_center }
		// default replaced by coords of current pin
		for (let m = 0; m < buildings.length; m++) {
			// check if the pin is the one highlighted and set the color to blue and bouncing animation
			if (selected_pin && buildings[m].building_id === selected_pin) {
				coords = {
					lat: parseFloat(buildings[m].gps_x),
					lng: parseFloat(buildings[m].gps_y),
				}
			}
		}
		return coords
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
	        marker.pin_id = n.building_id || n.post_id
          marker.infowindow = new google.maps.InfoWindow({
            content: `<div>$${n.min_price}+</div>`
          })
	      }
        // listen to marker click
        marker.addListener('click', (event) => {
          marker.infowindow.open(self.state.mapTarget, marker)
					self.props.selectPinToRedux(marker.pin_id)
					self.props.selectPopupBuilding(n)
					this.highlightPin(marker)
					setTimeout(() => {
						marker.infowindow.close()
					}, 2000)
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
		if (self.props.selected_pin) {
			self.highlightPin({
				pin_id: self.props.selected_pin
			})
		} else {
			self.paintPins()
		}
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
					if (this.props.rent_type === 'sublet' ? matchPinIDFromPins(marker.pin_id, this.pins, this.props.listOfResults) === this.pins[m].pin_id : this.pins[m].pin_id === marker.pin_id) {
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
			<div style={comStyles({}).mapContainer}>
				<div
					id='mapTarget'
					style={comStyles({ CSS_mapWidth: this.props.CSS_mapWidth, CSS_mapHeight: this.props.CSS_mapHeight }).mapTarget}
				/>
			</div>
		)
	}
}

MapComponent.propTypes = {
  listOfResults: PropTypes.array,        // passed in
	selected_pin: PropTypes.string,				// passed in
  selectPinToRedux: PropTypes.func.isRequired,
	selectPopupBuilding: PropTypes.func.isRequired,
	setCurrentGPSCenter: PropTypes.func.isRequired,
	CSS_mapWidth: PropTypes.string,			// passed in
	CSS_mapHeight: PropTypes.string,		// passed in
	current_gps_center: PropTypes.object.isRequired,
  lease_filter_params: PropTypes.object.isRequired,
  sublet_filter_params: PropTypes.object.isRequired,
	rent_type: PropTypes.string.isRequired,
	saveBuildingsToRedux: PropTypes.func.isRequired,
	saveSubletsToRedux: PropTypes.func.isRequired,
}

// for all optional props, define a default value
MapComponent.defaultProps = {
  listOfResults: [],
	CSS_mapWidth: '100%',
	CSS_mapHeight: '100%',
  search_radius: 1000,
}

const RadiumHOC = Radium(MapComponent)

const mapReduxToProps = (redux) => {
	return {
		current_gps_center: redux.filter.current_gps_center,
    lease_filter_params: redux.filter.lease_filter_params,
    sublet_filter_params: redux.filter.sublet_filter_params,
		rent_type: redux.filter.rent_type,
	}
}

export default connect(mapReduxToProps, {
	selectPinToRedux,
	selectPopupBuilding,
	setCurrentGPSCenter,
	saveBuildingsToRedux,
	saveSubletsToRedux,
})(RadiumHOC)


// =====================================
const comStyles = ({ CSS_mapWidth, CSS_mapHeight }) => {
	return {
		mapContainer: {
			width: '100%',
			height: '100%'
		},
		mapTarget: {
			width: CSS_mapWidth,
			height: CSS_mapHeight,
		}
	}
}
