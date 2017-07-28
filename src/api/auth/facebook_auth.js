// import { FB } from 'fb'
import { FB_APP_ID } from '../API_URLS'

// initialization of facebook api in order to get the 'FB' global variable
export const initiateFacebook = () => {
  // initialize facebook
	window.fbAsyncInit = () => {
    FB.init({
      appId: FB_APP_ID,
      xfbml: true,
      version: 'v2.10'
    })
    FB.AppEvents.logPageView()
  }
  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = '//connect.facebook.net/en_US/sdk.js';
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));
}

// the auth flow of logging into facebook and saving details, sending long lived token to server and retreiving facebook profiles
export const loginFacebook = () => {
  return facebookLoginFlow()
    .then((fbToken) => {
      return grabFacebookProfile(fbToken)
    })
    .then((fbProfile) => {
      return grabFacebookImage(fbProfile)
    })
    // registerFacebookLoginWithCognito({
		// 			authResponse: {
		// 				accessToken: longLiveToken
		// 			}
		// 		})
}

// log into facebook and get auth token
const facebookLoginFlow = () => {
  const p = new Promise((res, rej) => {
    FB.login((response) => {
     	if (response.status === 'connected') {
  	    // get access token
  	    const accessToken = response.authResponse.accessToken
  	    localStorage.setItem('fbToken', accessToken)
        res(accessToken)
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
					res({
            ...profile,
            fbToken: fbToken
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
