import AWS from 'aws-sdk/global'
import { TENANT_KMS_ID } from './aws-profile'


export const encryptKMS = (string) => {
  const p = new Promise((res, rej) => {
    AWS.config.credentials.refresh(() => {
      const kms = new AWS.KMS()
      // console.log()
      const params = {
        KeyId: TENANT_KMS_ID,
        Plaintext: string,
      }
      kms.encrypt(params, (err, data) => {
         if (err) {
          //  console.log(err, err.stack)
          rej(err)
         } else {
           res(data)
         }
      })
    })
  })
  return p
}

export const decryptKMS = (string) => {
  const p = new Promise((res, rej) => {
    AWS.config.credentials.refresh(() => {
      const kms = new AWS.KMS()
      // console.log()
      const params = {
        CiphertextBlob: string,
      }
      kms.decrypt(params, (err, data) => {
         if (err) {
          //  console.log(err, err.stack)
          rej(err)
         } else {
           res({
             ...data,
             decoded_string: decodeUint8array(data.Plaintext)
           })
         }
      })
    })
  })
  return p
}

const decodeUint8array = (uint8array) => {
    return new TextDecoder('utf-8').decode(uint8array);
}
