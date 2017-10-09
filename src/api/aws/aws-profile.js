import { CognitoUserPool } from 'amazon-cognito-identity-js';
import 'amazon-cognito-js'
import AWS from 'aws-sdk/global'

const REGION = 'us-east-1'
const STUDENT_USER_POOL_ID = 'us-east-1_zkNWHQGYR'
const STUDENT_CLIENT_ID = '7jm0vca96ep26e7s3ea17tl15e'

AWS.config.update({
	region: REGION
})
const studentData = {
    UserPoolId: STUDENT_USER_POOL_ID,
    ClientId: STUDENT_CLIENT_ID
}

export const BUCKET_NAME = 'rentburrow3-images'

export const studentPool = new CognitoUserPool(studentData);
export const STUDENT_USERPOOL_ID = `cognito-idp.${REGION}.amazonaws.com/${STUDENT_USER_POOL_ID}`
export const STUDENT_IDENTITY_POOL_ID = 'us-east-1:1f1f24e4-d3bb-44f1-92e8-7855f261640e'
