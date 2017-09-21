
export const pinAlreadyPlaced = (pin, newPins) => {
	// access pin coords with pin.coords (where pin.coords[1] = gps_y, pin.coords[0] = lng)
	// access marker coords in newPins with marker.position.lat() and marker.position.lng()
	let exists = false
	newPins.forEach((marker) => {
		if (parseFloat(pin.gps_x).toFixed(7) === marker.position.lat().toFixed(7) && parseFloat(pin.gps_y).toFixed(7) === marker.position.lng().toFixed(7)) {
			exists = true
		}
	})
	return exists
}

// check if lease exists via gps coords
export const checkWherePinExistsInArray = (pin, existingPins) => {
	let where = -1
	existingPins.forEach((x, i) => {
		if (parseFloat(x.gps_x).toFixed(7) === pin.position.lat().toFixed(7) && parseFloat(x.gps_y).toFixed(7) === pin.position.lng().toFixed(7)) {
			where = i
		}
	})
	return where
}

// return an array of buildings that match the GPS coords
export const findAllMatchingGPS = (building, all_buildings) => {
	// sublets
	if (building.post_id) {
		return all_buildings.filter((sublet) => {
			return sublet.gps_x === building.gps_x && sublet.gps_y === building.gps_y
		})
	} else {
	// leases
		return all_buildings.filter((sublet) => {
			return sublet.gps_x === building.gps_x && sublet.gps_y === building.gps_y
		})
	}
}

// return the Pin_ID of the pin with GPS coords matching the Pin passed in
// FIX THIS
export const matchPinIDFromPins = (pin_id, pins, listOfResults) => {
	let match
	listOfResults.forEach((building) => {
		if (building.post_id === pin_id) {
			match = building
		}
	})
	const sames = pins.filter((pin) => {
		return pin.position.lat().toFixed(7) === match.gps_x.toFixed(7) && pin.position.lng().toFixed(7) === match.gps_y.toFixed(7)
	})
	if (sames[0] && sames[0].pin_id) {
		return sames[0].pin_id
	} else {
		return pin_id
	}
}
