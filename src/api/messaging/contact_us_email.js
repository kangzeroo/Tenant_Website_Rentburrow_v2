// AWS SES (Simple Email Service) for sending emails via Amazon
import AWS_SES from 'aws-sdk/clients/ses'
import AWS from 'aws-sdk/global'
import moment from 'moment'
import { BUCKET_NAME } from '../aws/aws-profile'
import { aliasToURL } from '../general/general_api'


export const contactUsEmail = (contact_form) => {
  const ses = new AWS_SES({
		region: 'us-east-1',
	})
  const p = new Promise((res, rej) => {
    // console.log(saved_form_state)
    // console.log(building)
		const params = createInquiryParamsConfig(contact_form.name, generateHTMLInquiryEmail(contact_form))
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

const createInquiryParamsConfig = (name, HTML_Email) => {
  const params = {
	  Destination: { /* required */
	    BccAddresses: [
	      'email.records.rentburrow@gmail.com',
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
	      Data: 'Contact Us: Inquiry from ' + name, /* required */
	      Charset: 'UTF-8'
	    }
	  },
	  Source: 'email.records.rentburrow@gmail.com', /* required */
	  // ConfigurationSetName: 'STRING_VALUE',
	  ReplyToAddresses: [
	      'email.records.rentburrow@gmail.com'
	    /* more items */
	  ],
	  ReturnPath: 'email.records.rentburrow@gmail.com',
	  // ReturnPathArn: 'STRING_VALUE',
	  // SourceArn: 'STRING_VALUE',
	  Tags: [
	    {
	      Name: 'GiftInquiry', /* required */
	      Value: 'gift' /* required */
	    },
	    /* more items */
	  ]
	}
	return params
}

const generateHTMLInquiryEmail = (contact_form) => {
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
		                                    <h2>${contact_form.name} reached out to contact Rentburrow:</h2>
		                                </td>
		                            </tr>
		                            <tr style='border: 1px solid red; font-size: 1.2rem'>
		                                <td align='center' valign='top'>
		                                    <p>Email: ${contact_form.email}</p>
		                                </td>
		                            </tr>
		                            <tr style='border: 1px solid red; font-size: 1.2rem'>
		                                <td align='center' valign='top'>
		                                    <p>Phone: ${contact_form.phone}</p>
		                                </td>
		                            </tr>
		                            <tr style='border: 1px solid red; font-size: 1.2rem'>
                                    <td align='center' valign='top'>
                                        <p>Notes: ${contact_form.notes}</p>
                                    </td>
		                            </tr>
		                        </table>
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
