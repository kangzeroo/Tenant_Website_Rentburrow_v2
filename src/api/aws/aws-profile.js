import { CognitoUserPool } from 'amazon-cognito-identity-js';
import 'amazon-cognito-js'
import AWS from 'aws-sdk/global'

const REGION = 'us-east-1'
const USER_POOL_ID = 'us-east-1_CbdIjfPig'
const CLIENT_ID = '58vh7b29qsg6r6p0hdbi8qeci5'

AWS.config.update({
	region: REGION
})
const studentData = {
    UserPoolId: USER_POOL_ID,
    ClientId: CLIENT_ID
}

export const BUCKET_NAME = 'rentburrow3-images'
export const ENCRYPTED_BUCKET_NAME = 'rentburrow3-tenant-images'

export const studentPool = new CognitoUserPool(studentData);
export const STUDENT_USERPOOL_ID = `cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`
export const STUDENT_IDENTITY_POOL_ID = 'us-east-1:ff74ea73-940d-402d-94e8-b6bea6cc0574'
