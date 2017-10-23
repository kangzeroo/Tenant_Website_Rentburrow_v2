// AWS SES (Simple Email Service) for sending emails via Amazon
import AWS_SES from 'aws-sdk/clients/ses'
import AWS from 'aws-sdk/global'
import moment from 'moment'
import { BUCKET_NAME } from '../aws/aws-profile'
import { aliasToURL } from '../general/general_api'


export const sendChatMessageToLandlord = (tenant_name, tenant_email, landlord_email, building, message) => {
  const ses = new AWS_SES({
		region: 'us-east-1',
	})
  const p = new Promise((res, rej) => {
		const params = createInquiryParamsConfig(tenant_name, tenant_email, landlord_email, building, generateHTMLInquiryEmail(tenant_name, building, message))
    console.log(params)
		// console.log('Sending email with attached params!')
		AWS.config.credentials.refresh(() => {
			// console.log(AWS.config.credentials)
			ses.sendEmail(params, (err, data) => {
			  if (err) {
			  	 // console.log(err, err.stack); // an error occurred
			  	 rej(err)
			  } else {
			  	console.log(data);           // successful response
				res('Success! Email sent')
			  }
			})
		})
	})
	return p
}

const createInquiryParamsConfig = (tenant_name, tenant_email, landlord_email, building, HTML_Email) => {

  // tenant_email --> The sender (to be hidden from receiver)
  // inquiries@rentburrow-messaging.com --> the email server
  // landlord_email --> The target for inquiries@rentburrow-messaging.com

  const params = {
	  Destination: { /* required */
	    BccAddresses: [
	      /* more items */
	    ],
	    CcAddresses: [
	      /* more items */
	    ],
	    ToAddresses: [
	      /* more items */
        'inquiries@rentburrow-messaging.com'
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
	      Data: ' - ' + tenant_name + ' asked a question about ' + building.building_address, /* required */
	      Charset: 'UTF-8'
	    }
	  },
	  Source: 'inquiries@rentburrow-messaging.com', /* required */
	  // ConfigurationSetName: 'STRING_VALUE',
	  ReplyToAddresses: [
	      'inquiries@rentburrow-messaging.com',
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

const generateHTMLInquiryEmail = (tenant_name, building, message) => {
  const building_url = `https://rentburrow.com/${aliasToURL(building.building_alias)}`
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
		                <tr style='background-color:#74a9d8'>
		                    <td align='center' valign='top'>
		                        <table border='0' cellpadding='20' cellspacing='0' width='100%' id='emailHeader'>
		                            <tr>
		                                <td align='center' valign='top'>
                                        <h1 style='color:#337ab7;'>Rentburrow.com</h1>
		                                    <img src='https://s3.amazonaws.com/${BUCKET_NAME}/rentburrow_logo.png' style='width:150px; height: auto; margin: auto;' />
		                                </td>
		                            </tr>
		                        </table>
		                    </td>
		                </tr>
		                <tr style='background-color:#99ccff;'>
		                    <td align='center' valign='top'>
		                        <table border='0' cellpadding='20' cellspacing='0' width='100%' id='emailBody'>
		                            <tr>
		                                <td align='center' valign='top' style='color:#337ab7;'>
		                                    <h2>${building.building_address}</h2>
		                                    <h3>${tenant_name} ask a question:</h3>
		                                </td>
		                            </tr>
		                            <tr style='border: 1px solid red; font-size: 1.2rem'>
		                                <td align='center' valign='top'>
		                                    <p>${message}</p>
		                                </td>
		                            </tr>
		                        </table>
		                    </td>
		                </tr>
		                <tr style='background-color:#74a9d8; font-size: 1rem; border: 1px solid red'>
		                    <td align='center' valign='top'>
		                        View your property on Rentburrow.com at <a href=${building_url}> ${building_url}</a>
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
