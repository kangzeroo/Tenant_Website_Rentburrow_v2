import axios from 'axios'
import { FB_PARSER_MICROSERVICE } from '../API_URLS'

export const extractAndSaveFacebookPostsToDB = (city, profile) => {
	getGroupsForCity({ city, profile })
		.then(latestPostInServerPerGroup)
		.then(getPostsFromGroups)
		.then(filterNonSublets)
		.then(sendToServer)
}

// user profile is not saved to TENANT_MICROSERVICE
const getGroupsForCity = ({ city, profile }) => {
	const p = new Promise((res, rej) => {
		axios.post(`${FB_PARSER_MICROSERVICE}/city_groups`, city)
			.then((response, err) => {
				if (err) { rej(err) }
				res({
					groups: response.data,
					profile
				})
			})
	})
	return p
}

const latestPostInServerPerGroup = ({ groups, profile }) => {
	const p = new Promise((res, rej)=>{
		const groupsWithLatestPostTime = []
		for (let g = 0; g < groups.length; g++) {
			axios.post(`${FB_PARSER_MICROSERVICE}/check_latest_sublet`, groups[g])
				.then((data) => {
					let lastPostTime
					if (data) {
						lastPostTime = data.data
						groupsWithLatestPostTime.push({
              ...groups[g],
              lastPostTime
            })
					}
					if (g === groups.length - 1) {
						res({
							groupsTime: groupsWithLatestPostTime,
							profile
						})
					}
				})
		}
	})
	return p
}

const getPostsFromGroups = ({ groupsTime, profile }) => {
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
			  			response.data.filter((post) => {
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
				return post.message.match(/\(?(\d+[a-fA-F]?)(\s|\,\s|\.\s)(\b[a-zA-Z]*\b)\s(\.|,|\()?([a-zA-Z]*\b)(\.|,|\:|\)|\n)?\s(?:[a-zA-Z]*\b)?(\.|\,|\s)?/ig)
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
	axios.post(`${FB_PARSER_MICROSERVICE}/new_sublets`, { newSublets: filteredSublets, profile })
		.then((data) => {
			// console.log(data);
		}).catch((err) => {
			// console.log(err);
		})
}
