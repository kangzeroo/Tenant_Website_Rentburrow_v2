import axios from 'axios'
import FileDownload from 'react-file-download'
import { SUBLETTING_MICROSERVICE } from '../API_URLS'
import authHeaders from '../authHeaders'

export const generateSubletContract = (contract_id) => {
  const p = new Promise((res, rej) => {
    axios.post(`${SUBLETTING_MICROSERVICE}/generate_sublet_contract`, { contract_id }, authHeaders())
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

export const generateLeaseContract = (application_id) => {
  const p = new Promise((res, rej) => {
    axios.post(`${SUBLETTING_MICROSERVICE}/generate_lease_contract`, { application_id }, authHeaders())
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

export const authenticatePandaDoc = (code) => {
  const p = new Promise((res, rej) => {
    axios.post(`${SUBLETTING_MICROSERVICE}/pandadoc_authentication`, { code }, authHeaders())
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

export const generateNewTokens = (obj) => {
  const p = new Promise((res, rej) => {
    axios.post(`${SUBLETTING_MICROSERVICE}/generate_new_tokens`, obj, authHeaders())
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

export const generateNewSubleteeSession = (obj) => {
  const p = new Promise((res, rej) => {
    axios.post(`${SUBLETTING_MICROSERVICE}/generate_new_subletee_session`, obj, authHeaders())
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

export const generateNewSubletorSession = (obj) => {
  const p = new Promise((res, rej) => {
    axios.post(`${SUBLETTING_MICROSERVICE}/generate_new_subletor_session`, obj, authHeaders())
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

export const generateNewLeaseSession = (obj) => {
  const p = new Promise((res, rej) => {
    axios.post(`${SUBLETTING_MICROSERVICE}/generate_new_lease_session`, obj, authHeaders())
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

export const updateDocumentStatus = (tenant_id) => {
  const p = new Promise((res, rej) => {
    axios.post(`${SUBLETTING_MICROSERVICE}/update_document_status`, { tenant_id, }, authHeaders())
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

export const updateLeaseDocumentStatus = (tenant_id) => {
  const p = new Promise((res, rej) => {
    axios.post(`${SUBLETTING_MICROSERVICE}/update_lease_document_status`, { tenant_id, }, authHeaders())
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

export const uploadHello = (obj) => {
  const p = new Promise((res, rej) => {
    axios.post(`${SUBLETTING_MICROSERVICE}/upload_hello`, obj, authHeaders())
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

export const downloadContract = (doc_id) => {
  const p = new Promise((res, rej) => {
    // console.log('starting download...')
    generateNewTokens()
		.then((data) => {
			axios({
				method: 'get',
				url: `https://api.pandadoc.com/public/v1/documents/${doc_id}/download`,
				headers: { 'Authorization': `Bearer ${data.access_token}` }
			})
			.then((response) => {
    //    uploadPDFToS3('application.pdf', response.data)
        // FileDownload(response.data, `contract${doc_id}.pdf`)
        res()
			})
      .catch((err) => {
        rej(err)
      })
		})
  })
  return p
}
