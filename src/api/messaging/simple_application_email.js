// AWS SES (Simple Email Service) for sending emails via Amazon
import AWS_SES from 'aws-sdk/clients/ses'
import AWS from 'aws-sdk/global'
import moment from 'moment'
import { BUCKET_NAME } from '../aws/aws-profile'
import { aliasToURL } from '../general/general_api'


export const sendSimpleApplicationEmailToRentburrow = ({ group_members }, building_alias, landlord) => {
  const ses = new AWS_SES({
		region: 'us-east-1',
	})
  const p = new Promise((res, rej) => {
		const params = createInquiryParamsConfig(building_alias, landlord, group_members.length, generateHTMLInquiryEmail(group_members))
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

// For Text button
export const sendSimpleTextEmailToRentburrow = (leasingObj, building, landlord) => {
  const ses = new AWS_SES({
		region: 'us-east-1',
	})
  const p = new Promise((res, rej) => {
		const params = createInquiryParamsConfig(building.building_alias, landlord, leasingObj.group_size, generateHTMLInquiryEmail([leasingObj]))
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

const createInquiryParamsConfig = (building_alias, landlord, group_members_count, HTML_Email) => {
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
	      landlord.email
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
	      Data: `+${group_members_count} Tenants for ${building_alias}`, /* required */
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

const generateHTMLInquiryEmail = (group_members) => {
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
                       group_members.map((mem) => {
                         return (
                           `<tr style='background-color:#74a9d8'>
                              <td align='center' valign='top'>
                                ${mem.name} - ${mem.gender} attending ${mem.school_and_term}. Email: ${mem.email}, Phone: ${mem.phone}. Interested in ${mem.building_alias}
                              </td>
                           </tr>`
                         )
                       })
                     }
		                <tr style='background-color:#74a9d8; font-size: 1rem; border: 1px solid red'>
		                    <td align='center' valign='top'>
		                       ${group_members[0].group_notes ? group_members[0].group_notes : ''}
		                    </td>
		                </tr>
		            </table>
		        </td>
		    </tr>
		    </table>
		  </body>
		</html>
	`
}
