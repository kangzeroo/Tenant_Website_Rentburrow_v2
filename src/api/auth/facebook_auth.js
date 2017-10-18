// import { FB } from 'fb'
import axios from 'axios'
import { FB_APP_ID, SEARCH_MICROSERVICE } from '../API_URLS'
import { registerFacebookLoginWithCognito } from '../aws/aws-cognito'
import { logoutTenant } from '../../actions/auth/auth_actions'

// initialization of facebook api in order to get the 'FB' global variable
export const initiateFacebook = () => {
	const p = new Promise((res, rej) => {
	  // initialize facebook
		window.fbAsyncInit = () => {
	    FB.init({
	      appId: FB_APP_ID,
	      xfbml: true,
	      version: 'v2.10'
	    })
	    FB.AppEvents.logPageView()
			res()
	  }
	  (function(d, s, id){
	     var js, fjs = d.getElementsByTagName(s)[0];
	     if (d.getElementById(id)) {return;}
	     js = d.createElement(s); js.id = id;
	     js.src = '//connect.facebook.net/en_US/sdk.js';
	     fjs.parentNode.insertBefore(js, fjs);
	   }(document, 'script', 'facebook-jssdk'));
	})
	return p
}

// the auth flow of logging into facebook and saving details, sending long lived token to server and retreiving facebook profiles
export const loginFacebook = () => {
  return requestFacebookLogin()
    .then((fbToken) => {
      return grabFacebookProfile(fbToken)
    })
    .then((fbProfile) => {
      return grabFacebookImage(fbProfile)
    })
}

// check if logged into facebook and get auth token
export const checkIfFacebookLoggedIn = () => {
  const p = new Promise((res, rej) => {
		FB.getLoginStatus((response) => {
		  if (response.status === 'connected') {
	      // save successful facebook login to cognito
		    const fbToken = response.authResponse.accessToken
				grabFacebookProfile(fbToken)
			    .then((fbProfile) => {
			      return grabFacebookImage(fbProfile)
			    }).then((fbProfile) => {
						res(fbProfile)
					})
		    // registerFacebookLoginWithCognito({
				// 	authResponse: {
				// 		accessToken: fbToken
				// 	}
				// })
		  } else {
	    	rej()
		  }
		})
  })
  return p
}

// request facebook login
const requestFacebookLogin = () => {
	const p = new Promise((res, rej) => {
		FB.login((response) => {
     	if (response.status === 'connected') {
  	    // get access token
  	    const fbToken = response.authResponse.accessToken
		    // registerFacebookLoginWithCognito({
				// 	authResponse: {
				// 		accessToken: fbToken
				// 	}
				// })
				res(fbToken)
  		} else if (response.status === 'not_authorized') {
		    // The person is logged into Facebook, but not your app.
        rej(response.status)
  		} else {
		    // The person is not logged into Facebook, so we're not sure if
		    // they are logged into this app or not.
		    rej('not logged in');
  		}
  	}, { scope: 'public_profile, email' })
	})
	return p
}

// use auth token to get facebook profile
const grabFacebookProfile = (fbToken) => {
	const p = new Promise((res, rej) => {
		FB.api(
      '/me',
	    { access_token: fbToken },
      (profile) => {
				if (profile.id) {
					convertTokenIntoLongLived(fbToken).then((longToken) => {
		        res({
	            ...profile,
	            fbToken: longToken
	          })
					}).catch((err) => {
						localStorage.setItem('fbToken', fbToken)
						res({
	            ...profile,
	            fbToken
	          })
					})
				} else {
					// console.log(profile)
					rej(profile.error)
				}
      }
    )
	})
	return p
}

export const logoutFacebook = () => {
	const p = new Promise((res, rej) => {
		localStorage.removeItem('fbToken')
		FB.logout()
		window.location.reload()
	})
}

// use auth token to get facebook profile picture
const grabFacebookImage = (profile) => {
	const p = new Promise((res, rej) => {
		FB.api(
		    '/me?fields=picture&type=small',
		    { access_token: profile.fbToken },
		    (response) => {
		      if (response && !response.error) {
		        const picurl = response.picture.data.url
		        res({
              ...profile,
              picurl
            })
		      } else {
	    		  rej('Could not get profile picture')
		      }
		   }
		)
	})
	return p
}

export const convertTokenIntoLongLived = (accessToken) => {
	registerFacebookLoginWithCognito({
		authResponse: {
			accessToken: accessToken
		}
	})
	const p = new Promise((res, rej)=>{
		axios.post(SEARCH_MICROSERVICE+'/longlivetoken', { accessToken })
			.then((longToken) => {
				// console.log(longToken)
				localStorage.setItem('fbToken', longToken)
				res(longToken.data.longLiveToken.access_token)
			})
			.catch((err) => {
				// console.log(err)
				rej(err)
			})
	})
	return p
}

export const insertUser = (fbProfile) => {
  const p = new Promise((res, rej) => {
    axios.post(`${SEARCH_MICROSERVICE}/insert_user`, fbProfile)
      .then((data) => {
        // once we have the response, only then do we dispatch an action to Redux
        res(data.data)
      })
      .catch((err) => {
        rej(err)
      })
  })
  return p
}
