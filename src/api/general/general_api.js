import {
	SELECT_BUILDING,
} from '../../actions/action_types'
import { searchForSpecificBuilding, searchForSpecificBuildingByAlias } from '../search/search_api'
import PossibleRoutes from '../../components/PossibleRoutes'

// to shorten a long street address by removing city and postal code
export const shortenAddress = (address) => {
	if (address) {
		const comma = address.indexOf(',')
		if (comma > 7) {
			return address.slice(0, comma)
		} else {
			const nextAddr = address.slice(comma + 1, address.length - 1)
			const nextComma = nextAddr.indexOf(',')
			return address.slice(0, comma + nextComma + 1)
		}
	} else {
		return null
	}
}

export const shortenTimestamp = (timestamp) => {
	return timestamp.split('T')[0]
}

export const redirectPath = (urlPath) => {
	const p = new Promise((res, rej) => {
		searchForSpecificBuildingByAlias(URLToAlias(urlPath)).then((building) => {
			if (building) {
				res({
					// re-route to a different path if needed
					path: urlPath,
					// a set of redux actions to conduct if needed (eg. saving a selected file)
					actions: [{
						type: SELECT_BUILDING,
						payload: building,
					}],
				})
			} else {
				const altURL = redirectToAnotherRoute(urlPath)
				if (altURL.success) {
					res(altURL)
				} else {
					res(altURL)
				}
			}
		}).catch((err) => {
			_LTracker.push({
				'error': err,
				'tag' : `${localStorage.getItem('tenant_id')}`
			})
			const altURL = redirectToAnotherRoute(urlPath)
			if (altURL.success) {
				res(altURL)
			} else {
				res(altURL)
			}
		})
	})
	return p
}

const redirectToAnotherRoute = (urlPath) => {
	const partOfRoutes = checkIfPartOfRoutes(urlPath)
	if (partOfRoutes) {
		return ({
			success: true,
			path: partOfRoutes.path,
			actions: partOfRoutes.actions
		})
	} else {
		console.log('ROUTE DOESNT BELONG ANYWHERE')
		return ({
			success: false,
			path: '/',
			actions: []
		})
	}
}

// convert the browser language locale into a standard language code
// we do this because we dont want 3 versions of en, en-CA, en-US for translation, just use en
export const setLanguageFromLocale = (country_code) => {
	const p = new Promise((res, rej) => {
		const dictionary = {
			'en': 'en',
			'en-CA': 'en',
			'en-US': 'en',
			'zh': 'zh',
			'zh-hk': 'zh',
			'zh-cn': 'zh',
			'zh-sg': 'zh',
			'zh-tw': 'zh',
			'ar': 'ar',
			'kr': 'kr',
		}
		res(dictionary[country_code ? country_code : 'en'])
	})
	return p
}

// checks if the url path is part of the defined routes in AppRoot.js
export const checkIfPartOfRoutes = (urlPath) => {
	let exists = false
	PossibleRoutes.forEach((route) => {
		if (urlPath.indexOf(route) > -1) {
			exists = true
		}
	})
	if (exists) {
		return {
			path: urlPath,
			actions: []
		}
	} else {
		return false
	}
}


export const renderProcessedImage = (url) => {
	if (url) {
		const newurl = url.replace('rentburrow3-images.s3.amazonaws.com', 'rentburrow3-watermark-processed.s3.amazonaws.com')
		const new_name = newurl.slice(0, newurl.lastIndexOf('/')) + '/hd' + newurl.slice(newurl.lastIndexOf('/'))
		return new_name
	} else {
		return url
	}
}

export const renderProcessedThumbnail = (url) => {
	if (url) {
		const newurl = url.replace('rentburrow3-images.s3.amazonaws.com', 'rentburrow3-processed-images.s3.amazonaws.com')
		const new_name = newurl.slice(0, newurl.lastIndexOf('/')) + '/thumbnail' + newurl.slice(newurl.lastIndexOf('/'))
		return new_name
	} else {
		return url
	}
}

export const aliasToURL = (building_alias) => {
	return building_alias.replace(/ /g, '-')
}

export const URLToAlias = (building_alias) => {
	return building_alias.replace(/-/g, ' ').toLowerCase()
}

export const validateEmail = (email) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email)
}

export const authenticateTenant = (tenant) => {
	return tenant && tenant !== null && tenant !== {} && tenant.tenant_id
}

export const convertToArray = (obj) => {
  const array = []
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      array.push(obj[key])
    }
  }
  return array
}

export const dbTimeToCurrentTimeShort = (timestamp) => {
	return moment(timestamp).format('MMM Do YYY')
}

export const dbTimeToCurrentTimeLong = (timestamp) => {
	return moment(timestamp).subtract(5, 'hours').format('MMMM Do YYYY, hh:mm a')
}
