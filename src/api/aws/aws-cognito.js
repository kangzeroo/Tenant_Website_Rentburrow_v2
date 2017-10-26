// AWS Cognito for authenticating user
// https://github.com/aws/amazon-cognito-identity-js
import uuid from 'uuid'
import AWS from 'aws-sdk/global'
import 'amazon-cognito-js'
import { CognitoUserPool, CognitoUserAttribute, CognitoUser, AuthenticationDetails, CognitoIdentityCredentials, WebIdentityCredentials } from 'amazon-cognito-identity-js';
import { studentPool, STUDENT_USERPOOL_ID, TENANT_IDENTITY_POOL_ID } from './aws-profile'
// import AWS_CognitoIdentity from 'aws-sdk/clients/cognitoidentity'
// import AWS_CognitoSyncManager from 'aws-sdk/clients/cognitosync'

// https://github.com/aws/amazon-cognito-js/
// entire cognito sync

export const RegisterStudent = ({ email, password }) => {
	const p = new Promise((res, rej) => {
		const attributeList = []
		const dataEmail = {
		    Name: 'email',
		    Value: email,
		}
		const attributeEmail = new CognitoUserAttribute(dataEmail)

		attributeList.push(attributeEmail)
		studentPool.signUp(email, password, attributeList, null, (err, result) => {
		    if (err) {
		        // console.log(err);
		        rej(err)
		        return;
		    }
		    res({
					cognito_id: result.userSub,
					email: result.user.username,
				})
		})
	})
	return p
}

export const LoginStudent = ({ email, password }) => {
	const p = new Promise((res, rej) => {
		const authenticationDetails = new AuthenticationDetails({
			Username: email,
			Password: password
		})
		const userData = {
			Username: email,
			Pool: studentPool
		}
		const cognitoUser = new CognitoUser(userData)
		let staffProfileObject
		authenticateStudent(cognitoUser, authenticationDetails)
			.then(() => {
				return buildUserObject(cognitoUser)
			})
    	.then((staffObject) => {
				staffProfileObject = staffObject
    	})
			.then((msg) => {
				res(staffProfileObject)
			})
			.catch((err) => {
				rej({
					message: err
				})
			})
	})
	return p
}

const authenticateStudent = (cognitoUser, authenticationDetails) => {
	const p = new Promise((res, rej) => {
		cognitoUser.authenticateUser(authenticationDetails, {
	        onSuccess: (result) => {
	            // console.log('access token + ' + result.getAccessToken().getJwtToken());
	            // localStorage.setItem('cognito_student_token', result.getAccessToken().getJwtToken());
	            localStorage.setItem('cognito_student_token', result.accessToken.jwtToken);
	            // console.log('======== VIEW THE REFRESH TOKEN =========')
	            // console.log(localStorage.getItem('cognito_student_token'))
	            // console.log(result)

			    		// Edge case, AWS Cognito does not allow for the Logins attr to be dynamically generated. So we must create the loginsObj beforehand
	            const loginsObj = {
	                // Change the key below according to the specific region your user pool is in.
	                [STUDENT_USERPOOL_ID]: result.getIdToken().getJwtToken()
	            }
			    		AWS.config.credentials = new AWS.CognitoIdentityCredentials({
	                IdentityPoolId: TENANT_IDENTITY_POOL_ID, // your identity pool id here
	                Logins: loginsObj
	            })
	            AWS.config.credentials.refresh(() => {
		            res()
	            })
	        },
	        onFailure: (err) => {
	            // console.log(err)
	            rej(err)
	        },
	    })
	})
	return p
}

const buildUserObject = (cognitoUser) => {
	const p = new Promise((res, rej) => {
		cognitoUser.getUserAttributes((err, result) => {
      if (err) {
          // console.log(err);
  		rej(err)
          return;
      }
      let staffProfileObject = {}
			for (let i = 0; i < result.length; i++) {
	      if (result[i].getName().indexOf('custom:') >= 0) {
	    		const name = result[i].getName().slice(7, result[i].getName().length)
	    		staffProfileObject[name] = result[i].getValue()
	    	} else {
	    		staffProfileObject[result[i].getName()] = result[i].getValue()
	    	}
	    }
	    const corporationAttrs = ['email']
	    for (let x = 0; x < corporationAttrs.length; x++) {
	    	if (!staffProfileObject[corporationAttrs[x]]) {
	    		staffProfileObject[corporationAttrs[x]] = null
	    	}
	    }
			staffProfileObject['id'] = result.sub
      res(staffProfileObject)
    })
	})
	return p
}

export const VerifyAccount = ({ email, pin }) => {
	const p = new Promise((res, rej) => {
		const userData = {
			Username: email,
			Pool: studentPool
		}
		const cognitoUser = new CognitoUser(userData)
		// console.log('Verifying account...')
		cognitoUser.confirmRegistration(pin, true, (err, result) => {
	        if (err) {
            // console.log(err);
		        rej(err)
            return;
	        }
	        // console.log('call result: ' + result)
	        if (result === 'SUCCESS') {
	        	// console.log('Successfully verified account!')
	        	cognitoUser.signOut()
	        	res()
	        } else {
	        	rej({
							message: 'Could not verify account',
						})
	        }
	    })
	})
	return p
}

export function updateStudentInfo(email, editedInfo) {
	// console.log(editedInfo)
	const p = new Promise((res, rej) => {
		const attrs = ['custom:company_name', 'custom:company_logo', 'custom:default_email', 'custom:default_phone', 'custom:email_forward', 'website']
		const attributeList = []
		for (let a = 0; a<attrs.length; a++) {
			if (editedInfo[attrs[a]]) {
				// console.log(editedInfo[attrs[a]])
				const attribute = {
	        Name: attrs[a],
	        Value: editedInfo[attrs[a]]
		    }
		    const x = new CognitoUserAttribute(attribute)
		    attributeList.push(x)
			}
		}
		// console.log(attributeList)
	    const cognitoUser = studentPool.getCurrentUser()
	    cognitoUser.getSession(function(err, result) {
            if (result) {
                cognitoUser.updateAttributes(attributeList, function(err, result) {
			        if (err) {
			            // console.log(err);
		        		rej(err)
			            return;
			        }
			        setTimeout(()=>{
				        cognitoUser.getUserAttributes(function(err, result) {
					        if (err) {
					            // console.log(err);
		        				rej(err)
					            return;
					        }
					        buildUserObject(cognitoUser)
					        	.then((staffProfileObject) => {
					        		res(staffProfileObject)
					        	})
					    })
			        }, 500)
			    });
            }
        });
	})
	return p
}

export function forgotPassword(email) {
	const p = new Promise((res, rej) => {
		// console.log(email)
		// console.log(studentPool)
		const userData = {
			Username: email,
			Pool: studentPool
		}
		const cognitoUser = new CognitoUser(userData)
		// console.log(cognitoUser)

		cognitoUser.forgotPassword({
	        onSuccess: (result) => {
						// console.log(result)
            // console.log('call result: ' + result);
	        },
	        onFailure: (err) => {
            // console.log(err);
		        rej(err)
	        },
	        // Optional automatic callback
	        inputVerificationCode: (data) => {
            res({
            	cognitoUser,
            	thirdArg: this
            })
	        }
	    })
	})
	return p
}

export const resetVerificationPIN = ({ email }) => {
	const p = new Promise((res, rej) => {
		const userData = {
			Username: email,
			Pool: studentPool,
		}
		const cognitoUser = new CognitoUser(userData)
		cognitoUser.resendConfirmationCode((err, result) => {
	        if (err) {
	            // console.log(err);
		        rej(err)
	        }
	        // console.log('call result: ' + result);
	        res()
	    })
	})
	return p
}

export const retrieveStaffFromLocalStorage = () => {
	const p = new Promise((res, rej) => {
	    const cognitoUser = studentPool.getCurrentUser();
	    // console.log('Getting cognitoUser from local storage...')
	    // console.log(cognitoUser)
	    if (cognitoUser != null) {
	        cognitoUser.getSession((err, session) => {
            if (err) {
                // console.log(err)
                return
            }
            // console.log('session validity: ' + session.isValid());
            // console.log(session);
            localStorage.setItem('cognito_student_token', session.getAccessToken().getJwtToken());
            // console.log(localStorage.getItem('cognito_student_token'))
            // Edge case, AWS Cognito does not allow for the Logins attr to be dynamically generated. So we must create the loginsObj beforehand
            const loginsObj = {
                // Change the key below according to the specific region your user pool is in.
                [STUDENT_USERPOOL_ID]: session.getIdToken().getJwtToken()
            }
				    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
		                IdentityPoolId: TENANT_IDENTITY_POOL_ID, // your identity pool id here
		                Logins: loginsObj
		            })
		            AWS.config.credentials.refresh(() => {
		            	// console.log(AWS.config.credentials)
		            	res(buildUserObject(cognitoUser))
		            })
		        })
	    } else {
	    	rej({
					message: 'Failed to retrieve corporation from localStorage'
				})
	    }
	})
	return p
}

export const signOutStudent = () => {
	const p = new Promise((res, rej) => {
		const cognitoUser = studentPool.getCurrentUser()
		if (cognitoUser) {
			cognitoUser.signOut()
		}
	})
	return p
}

export const registerFacebookLoginWithCognito = (response) => {
	// console.log('registerFacebookLoginWithCognito')
	// console.log(response)
	// Check if the user logged in successfully.
	  if (response.authResponse) {

	    // console.log('You are now logged in.');
	    const cognitoidentity = new AWS.CognitoIdentity()

	    // Add the Facebook access token to the Cognito credentials login map.
	    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
	      IdentityPoolId: TENANT_IDENTITY_POOL_ID,
	      Logins: {
	         'graph.facebook.com': response.authResponse.accessToken
	      }
	    })

	    // AWS Cognito Sync to sync Facebook
	    AWS.config.credentials.get(() => {
		    const client = new AWS.CognitoSyncManager()
		    // console.log(AWS.config.credentials)
			})

	  } else {
	    // console.log('There was a problem logging you in.');
	  }
}

// export function corporationClaimViewIdentity(){
// 	// Add the unauthenticated_staff user to the Cognito credentials login map.
// 	AWS.config.credentials = new AWS.CognitoIdentityCredentials({
// 		IdentityPoolId: TENANT_IDENTITY_POOL_ID
// 	})
//
// 	// AWS Cognito Sync to sync Facebook
// 	AWS.config.credentials.get(function() {
// 		const client = new AWS.CognitoSyncManager();
// 		// console.log(AWS.config.credentials)
// 	});
// }

export const unauthRoleStudent = () => {
	const p = new Promise((res, rej) => {
		// Add the unauthenticated_staff user to the Cognito credentials login map.
		AWS.config.credentials = new AWS.CognitoIdentityCredentials({
			IdentityPoolId: TENANT_IDENTITY_POOL_ID
		})
		// AWS Cognito Sync to sync Facebook
		AWS.config.credentials.get(() => {
			const client = new AWS.CognitoSyncManager();
			// console.log(AWS.config.credentials)
			res({
				tenant_id: AWS.config.credentials.data.IdentityId,
				first_name: 'Student on Rentburrow.com',
				last_name: '(Not Signed In)',
				thumbnail: 'https://image.flaticon.com/icons/png/128/149/149071.png',
				unauthRoleStudent: true,
			})
		})
		// res({
		// 	id: 'COGNITO_UNAUTH_USER'
		// })
	})
	return p
}
