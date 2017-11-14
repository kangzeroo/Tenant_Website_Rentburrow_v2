// AWS SES (Simple Email Service) for sending emails via Amazon
import AWS_SES from 'aws-sdk/clients/ses'
import AWS from 'aws-sdk/global'
import moment from 'moment'
import { BUCKET_NAME } from '../aws/aws-profile'
import { aliasToURL } from '../general/general_api'


export const bookPhotoShoot = (buildings) => {
  const ses = new AWS_SES({
		region: 'us-east-1',
	})
  const p = new Promise((res, rej) => {
		const params = createInquiryParamsConfig(buildings[0].landlord_name, buildings.length, generateHTMLInquiryEmail(buildings))
    // console.log(params)
		// console.log('Sending email with attached params!')
		AWS.config.credentials.refresh(() => {
			// console.log(AWS.config.credentials)
			ses.sendEmail(params, (err, data) => {
			  if (err) {
			  	 // console.log(err, err.stack); // an error occurred
			  	 rej(err)
			  } else {
			  	// console.log(data);           // successful response
				res('Success! Email sent')
			  }
			})
		})
	})
	return p
}

const createInquiryParamsConfig = (landlord_name, num_of_buildings, HTML_Email) => {
  const params = {
	  Destination: { /* required */
	    BccAddresses: [
	      /* more items */
	    ],
	    CcAddresses: [
	      /* more items */
	    ],
	    ToAddresses: [
	      'support@rentburrow.com'
	      /* more items */
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
	      Data: `Photoshoot Request: ${num_of_buildings} buildings for ${landlord_name}`, /* required */
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
	      Name: 'PhotoshootInquiry', /* required */
	      Value: 'photoshoot' /* required */
	    },
	    /* more items */
	  ]
	}
	return params
}

const generateHTMLInquiryEmail = (buildings) => {
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
                     ${
                       buildings.map((building) => {
                         return (
                           `<tr style='background-color:#74a9d8'>
                              <td align='center' valign='top'>
                                ${building.building_address} (${building.building_place_id}) - ${ building.plan_a_filming_date_later ? 'Filming Date TBD' : `${building.filming_date.format('ddd MMM do YYYY')} at ${building.filming_time.format('h:mm a')}.` }. ====> ${building.building_notes}. Landlord Name: ${building.landlord_name}, Email: ${building.landlord_email}, Phone: ${building.landlord_phone}.
                              </td>
                           </tr>`
                         )
                       })
                     }
		            </table>
		        </td>
		    </tr>
		    </table>
		  </body>
		</html>
	`
}
