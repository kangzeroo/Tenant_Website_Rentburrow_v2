import {
	SELECT_BUILDING,
} from '../../actions/action_types'
import { searchForSpecificBuilding } from '../search/search_api'

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

export const redirectPath = (urlPath) => {
	const p = new Promise((res, rej) => {
		searchForSpecificBuilding().then((building) => {
			res({
				// re-route to a different path if needed
				path: urlPath,
				// a set of redux actions to conduct if needed (eg. saving a selected file)
				actions: [{
					type: SELECT_BUILDING,
					payload: building,
				}],
			})
		}).catch((err) => {
			console.log(err)
			res({
				path: '/',
				actions: []
			})
		})
	})
	return p
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
		}
		res(dictionary[country_code])
	})
	return p
}
