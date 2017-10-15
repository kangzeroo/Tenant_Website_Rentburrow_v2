import AWS from 'aws-sdk/global'
import { TENANT_KMS_ID } from './aws-profile'


export const test_kms = () => {
  AWS.config.credentials.refresh(() => {
    const kms = new AWS.KMS()
    console.log()
    const params = {
      KeyId: TENANT_KMS_ID,
      Plaintext: 'Hello world this is Kangze calling in encrypted with Amazon Key Management Service!'
    }
    kms.encrypt(params, (err, data) => {
       if (err) {
         console.log(err, err.stack)
       } else {
         console.log(data)
       }
    })
  })
}
