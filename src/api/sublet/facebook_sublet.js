import axios from 'axios'
import { SEARCH_MICROSERVICE } from '../API_URLS'

export const scrapeFacebookSublets = (profile, city = 'Waterloo') => {
	console.log('scrapeFacebookSublets')
	getGroupsForCity({ city, profile })
		.then(latestPostInServerPerGroup)
		.then(getPostsFromGroups)
		.then(filterNonSublets)
		.then(sendToServer)
}

// user profile is not saved to TENANT_MICROSERVICE
const getGroupsForCity = ({ city, profile }) => {
	console.log('getGroupsForCity')
	const p = new Promise((res, rej) => {
		res({
			profile,
			groups: [
				{
					groupid: 1591404561120090,
					groupname: 'RentBurrow Sublets',
					city_name: 'Waterloo',
					active: true,
					main: true
				},
				{
					groupid: 142679255268,
					groupname: 'UW/WLU 4 Month Subletting',
					city_name: 'Waterloo',
					active: true,
					main: false
				},
				{
					groupid: 110354088989367,
					groupname: 'Student Housing in Waterloo',
					city_name: 'Waterloo',
					active: true,
					main: false
				},
				{
					groupid: 198200603621455,
					groupname: 'Housing',
					city_name: 'Waterloo',
					active: true,
					main: false
				},
				{
					groupid: 1572498759686621,
					groupname: 'Western University (UWO) - Off-Campus Housing',
					city_name: 'London',
					active: true,
					main: true
				},
				{
					groupid: 140018679520133,
					groupname: 'McMaster Student Housing Postboard',
					city_name: 'Hamilton',
					active: true,
					main: true
				},
				{
					groupid: 370115193161790,
					groupname: 'University of Toronto - Off-Campus Housing (St. George)',
					city_name: 'Toronto',
					active: true,
					main: true
				},
				{
					groupid: 542272205912816,
					groupname: 'University of Toronto (UTSC) - Off-Campus Housing (Scarborough)',
					city_name: 'Scarborough',
					active: true,
					main: true
				},
				{
					groupid: 435084536664813,
					groupname: 'University of Toronto (UTM) - Off-Campus Housing (Mississauga)',
					city_name: 'Mississauga',
					active: true,
					main: true
				}/*,
				{
					groupid: 524220117678841,
					groupname: 'Carleton U/ uOttawa/ Algonquin C off-Campus Housing',
					city_name: 'Ottawa',
					active: true,
					main: true
				}*/
				// Closed Groups to be added
				// https://www.facebook.com/groups/Queenshousing/
			]
		})
	})
	return p
}

const latestPostInServerPerGroup = ({ groups, profile }) => {
	console.log('latestPostInServerPerGroup')
	const p = new Promise((res, rej) => {
		const promises = groups.map((group) => {
			return axios.post(`${SEARCH_MICROSERVICE}/check_latest_sublet`, group)
				.then((data) => {
					if (data.data.length > 0) {
						// lastPostTime = data.data
						const lastPostTime = JSON.parse(data.data[0]).posted_date || 0
						console.log(`${group.groupname}: ${lastPostTime}`)
						return Promise.resolve({
              ...group,
              lastPostTime
            })
					} else {
						return Promise.resolve({
							...group,
						 lastPostTime: 0
						})
					}
				})
		})
		Promise.all(promises).then((groupsWithLatestPostTime) => {
			res({
				groupsTime: groupsWithLatestPostTime,
				profile,
			})
		})
	})
	return p
}

const getPostsFromGroups = ({ groupsTime, profile }) => {
	console.log(groupsTime)
	console.log('getPostsFromGroups')
	const p = new Promise((res, rej) => {
		const postsArray = []
		let doneAsyncTicker = 0
		const locallySavedAccessToken = localStorage.getItem('fbToken')
		const access_token = profile.accessToken || locallySavedAccessToken
		for (let g = 0; g < groupsTime.length; g++) {
			FB.api(
        `/${groupsTime[g].groupid}/feed?limit=100`,
        { access_token: access_token },
      	(response) => {
          if (response && !response.error) {
						console.log(response.data)
		  			response.data.filter((post) => {
							post.updated_time = new Date(post.updated_time).getTime() / 1000
				  		return post.updated_time > groupsTime[g].lastPostTime
				  	}).forEach((post) => {
				  		postsArray.push({
				  			...post,
				  			city: groupsTime[g].city_name,
				  			groupid: groupsTime[g].groupid
				  		})
				  	})
          }
          doneAsyncTicker++
			  	if (doneAsyncTicker === groupsTime.length) {
						res({
							postsArray,
							profile
						})
					}
        }
		  )
		}
	})
	return p
}

const filterNonSublets = ({ postsArray, profile }) => {
	const p = new Promise((res, rej) => {
		const filteredSublets = postsArray.filter((post, index) => {
			if (post.message) {
				// return post.message.match(/\(?(\d+[a-fA-F]?)(\s|\,\s|\.\s)(\b[a-zA-Z]*\b)\s(\.|,|\()?([a-zA-Z]*\b)(\.|,|\:|\)|\n)?\s(?:[a-zA-Z]*\b)?(\.|\,|\s)?/ig)
				return !post.message.match(/(looking)+|(wanted)+/ig)
			} else if (post.story) {
				return !post.story.match(/(looking)+|(wanted)+/ig)
			} else {
				return false
			}
		})
		res({
			filteredSublets,
			profile
		})
	})
	return p
}

const sendToServer = ({ filteredSublets, profile }) => {
	console.log(filteredSublets)
	axios.post(`${SEARCH_MICROSERVICE}/new_sublets`, { newSublets: filteredSublets, profile })
		.then((data) => {
			// console.log(data);
		}).catch((err) => {
			// console.log(err);
		})
}
