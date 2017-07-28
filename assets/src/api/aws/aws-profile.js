import { CognitoUserPool } from 'amazon-cognito-identity-js';
import 'amazon-cognito-js'
import AWS from 'aws-sdk/global'

const REGION = 'us-east-1'
const CORPORATION_USER_POOL_ID = 'us-east-1_StpUIXpsz'
const CORPORATION_CLIENT_ID = '5cu7c77s09ale7souamv2ltmn6'

AWS.config.update({
	region: REGION
})
const staffData = {
    UserPoolId: CORPORATION_USER_POOL_ID,
    ClientId: CORPORATION_CLIENT_ID
}

export const BUCKET_NAME = 'rentburrow3-images'

export const staffPool = new CognitoUserPool(staffData);
export const STAFF_USERPOOL_ID = `cognito-idp.${REGION}.amazonaws.com/${CORPORATION_USER_POOL_ID}`
export const STAFF_IDENTITY_POOL_ID = 'us-east-1:1f1f24e4-d3bb-44f1-92e8-7855f261640e'
