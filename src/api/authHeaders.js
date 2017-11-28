
// in order to use JWT in the authHeaders, we need to set up a AWS Cognito User Pool for Tenants
// including MFA for email and phone verification

// const authHeaders = () => {
//   console.log('authHeaders')
//   console.log(localStorage.getItem('cognito_student_token'))
//   return {
//     headers: {
//       jwt: localStorage.getItem('cognito_student_token'),
//     }
//   }
// }

// this is our alternative hacky security, which isn't that great but will deter X % of amateur hackers so good enough for now
// the problem is, they can still copy the client_key from the headers... so kinda redundant?
// import CryptoJS from 'crypto-js'
// const authHeaders = () => {
//   const lameCryptionClientKey = CryptoJS.AES.encrypt(JSON.stringify('80/20_principle_FTW'), 'lameCryption').toString()
//   return {
//     headers: {
//       client_key: lameCryptionClientKey
//     }
//   }
// }

// export default authHeaders;
