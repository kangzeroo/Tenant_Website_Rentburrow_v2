import axios from 'axios'
import AWS_SES from 'aws-sdk/clients/ses'
import AWS from 'aws-sdk/global'
import moment from 'moment'
import { BUCKET_NAME } from '../aws/aws-profile'
import { aliasToURL } from '../general/general_api'
import { CONTRACTING_MICROSERVICE } from '../API_URLS'
import authHeaders from '../authHeaders'

export const insertTour = ({ inquiry_id, date_1, time_1_begin, time_1_end, date_2, time_2_begin, time_2_end, date_3, time_3_begin, time_3_end, notes, }) => {
  const p = new Promise((res, rej) => {
    axios.post(`${CONTRACTING_MICROSERVICE}/insert_tour`, { inquiry_id, date_1, time_1_begin, time_1_end, date_2, time_2_begin, time_2_end, date_3, time_3_begin, time_3_end, notes, }, authHeaders())
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

export const insertTourDetails = ({ tour_id, date, time_begin, time_end, notes, meetup_address }) => {
  const p = new Promise((res, rej) => {
    axios.post(`${CONTRACTING_MICROSERVICE}/insert_tour_details`, { tour_id, date, time_begin, time_end, notes, meetup_address }, authHeaders())
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

export const insertRideForTour = ({ tour_id, pickup_address, }) => {
  const p = new Promise((res, rej) => {
    axios.post(`${CONTRACTING_MICROSERVICE}/insert_ride_for_tour`, { tour_id, pickup_address, }, authHeaders())
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

export const getTourById = (tour_id) => {
  const p = new Promise((res, rej) => {
    axios.post(`${CONTRACTING_MICROSERVICE}/get_tour_by_id`, { tour_id, }, authHeaders())
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

export const getTourDetailsById = (tour_id) => {
  const p = new Promise((res, rej) => {
    axios.post(`${CONTRACTING_MICROSERVICE}/get_tour_details_by_id`, { tour_id, }, authHeaders())
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

export const sendTourEmailToLandlord = (tourObj, building) => {
  const ses = new AWS_SES({
		region: 'us-east-1',
	})
  const p = new Promise((res, rej) => {
		const params = createInquiryParamsConfig(tourObj, building, generateHTMLTourRequestEmail(tourObj, building))
		AWS.config.credentials.refresh(() => {
			ses.sendEmail(params, (err, data) => {
			  if (err) {
			  	 rej(err)
			  } else {
				res('Success! Email sent')
			  }
			})
		})
	})
	return p
}

export const sendTourConfirmationEmailToTenant = (tourObj, mailObj, building) => {
  const ses = new AWS_SES({
		region: 'us-east-1',
	})
  const p = new Promise((res, rej) => {
		const params = createInquiryResponseParamsConfig(building, mailObj, generateHTMLTourResponseEmail(tourObj, building))
		AWS.config.credentials.refresh(() => {
			ses.sendEmail(params, (err, data) => {
			  if (err) {
			  	 rej(err)
			  } else {
				res('Success! Email sent')
			  }
			})
		})
	})
	return p
}

const createInquiryParamsConfig = (tourObj, building, HTML_Email) => {
  const params = {
	  Destination: { /* required */
	    BccAddresses: [
	      /* more items */
        'email.records.rentburrow@gmail.com'
	    ],
	    CcAddresses: [
	      /* more items */
	    ],
	    ToAddresses: [
	      //'support@rentburrow.com'
	      /* more items */
        tourObj.corp_email
	    ]
	  },
	  Message: { /* required */
	    Body: { /* required */
	      Html: {
	        Data: HTML_Email,
	        Charset: 'UTF-8'
	      },
	      // Text: {
	      //   Data: corporationInfo.corporationMessage,
	      //   Charset: 'UTF-8'
	      // }
	    },
	    Subject: { /* required */
	      Data: `Viewing Requested for ${building.building_alias}`, /* required */
	      Charset: 'UTF-8'
	    }
	  },
	  Source: 'inquiries@rentburrow-messaging.com', /* required */
	  // ConfigurationSetName: 'STRING_VALUE',
	  ReplyToAddresses: [
	      'inquiries@rentburrow-messaging.com'
	    /* more items */
	  ],
	  ReturnPath: 'inquiries@rentburrow-messaging.com',
	  // ReturnPathArn: 'STRING_VALUE',
	  // SourceArn: 'STRING_VALUE',
	  Tags: [
	    {
	      Name: 'LeaseInquiry', /* required */
	      Value: 'lease' /* required */
	    },
	    /* more items */
	  ]
	}
	return params
}

const createInquiryResponseParamsConfig = (building, mailObj, HTML_Email) => {
  const params = {
	  Destination: { /* required */
	    BccAddresses: [
        'email.records.rentburrow@gmail.com'
	      /* more items */
	    ],
	    CcAddresses: [
	      /* more items */
	    ],
	    ToAddresses: [
	      // 'support@rentburrow.com'
	      /* more items */
        mailObj.email

	    ]
	  },
	  Message: { /* required */
	    Body: { /* required */
	      Html: {
	        Data: HTML_Email,
	        Charset: 'UTF-8'
	      },
	      // Text: {
	      //   Data: corporationInfo.corporationMessage,
	      //   Charset: 'UTF-8'
	      // }
	    },
	    Subject: { /* required */
	      Data: `Viewing Confirmed for ${building.building_alias}`, /* required */
	      Charset: 'UTF-8'
	    }
	  },
	  Source: 'inquiries@rentburrow-messaging.com', /* required */
	  // ConfigurationSetName: 'STRING_VALUE',
	  ReplyToAddresses: [
	      'inquiries@rentburrow-messaging.com'
	    /* more items */
	  ],
	  ReturnPath: 'inquiries@rentburrow-messaging.com',
	  // ReturnPathArn: 'STRING_VALUE',
	  // SourceArn: 'STRING_VALUE',
	  Tags: [
	    {
	      Name: 'LeaseInquiry', /* required */
	      Value: 'lease' /* required */
	    },
	    /* more items */
	  ]
	}
	return params
}

const generateHTMLTourRequestEmail = (tourObj, building) => {
  return `
		<!DOCTYPE html>
		<html>
		  <head>
		    <meta charset='UTF-8' />
		    <title>title</title>
		  </head>
		  <body>
		  	<table border='0' cellpadding='0' cellspacing='0' height='100%' width='100%' id='bodyTable'>
		    <tr>
		        <td align='center' valign='top'>
		            <table border='0' cellpadding='20' cellspacing='0' width='600' id='emailContainer'>
                  <h1>Viewing Requested for ${building.building_alias} </h1>
                  <p>Please Select a timeslot at https://rentburrow.com/landlord-confirm-tour/${tourObj.tour_id}</p>
		            </table>
		        </td>
		    </tr>
		    </table>
		  </body>
		</html>
	`
}

const generateHTMLTourResponseEmail = (tourObj, building) => {
  return `
		<!DOCTYPE html>
		<html>
		  <head>
		    <meta charset='UTF-8' />
		    <title>title</title>
		  </head>
		  <body>
		  	<table border='0' cellpadding='0' cellspacing='0' height='100%' width='100%' id='bodyTable'>
		    <tr>
		        <td align='center' valign='top'>
		            <table border='0' cellpadding='20' cellspacing='0' width='600' id='emailContainer'>
                  <h1>Viewing for ${building.building_alias} Confirmed!</h1>
                  <p>Please meet at ${tourObj.meetup_address} \n
                     for your viewing on ${moment(tourObj.date).format('MMMM Do YYYY')}
                     from ${moment(tourObj.time_begin, 'HHmm').format('HH:mm a')} to
                     ${moment(tourObj.time_end, 'HHmm').format('HH:mm a')}</p>
                  <br />
                  <h4>Additional Notes from the Landlord</h4>
                  <p>${tourObj.notes}</p>
		            </table>
		        </td>
		    </tr>
		    </table>
		  </body>
		</html>
	`
}
