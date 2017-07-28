
export const pinAlreadyPlaced = (pin, newPins) => {
	// access pin coords with pin.coords (where pin.coords[1] = gps_y, pin.coords[0] = lng)
	// access marker coords in newPins with marker.position.lat() and marker.position.lng()
	let exists = false
	newPins.forEach((marker) => {
		if (pin.gps_x.toFixed(7) === marker.position.lat().toFixed(7) && pin.gps_y.toFixed(7) === marker.position.lng().toFixed(7)) {
			exists = true
		}
	})
	return exists
}


// check if lease exists via gps coords
export const checkWherePinExistsInArray = (pin, existingPins) => {
	let where = -1
	existingPins.forEach((x, i) => {
		if (x.gps_x.toFixed(7) === pin.position.lat().toFixed(7) && x.gps_y.toFixed(7) === pin.position.lng().toFixed(7)) {
			where = i
		}
	})
	return where
}


export const generateEventCard = (event) => {
  return `
    <div>${event.title}</div>
  `
}

export const generatePromoCard = (promo) => {
  return `
    <div>${promo.title}</div>
  `
}
