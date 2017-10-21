// AWS SES (Simple Email Service) for sending emails via Amazon
import AWS_SES from 'aws-sdk/clients/ses'
import AWS from 'aws-sdk/global'
import { BUCKET_NAME } from '../aws/aws-profile'


export const sendSummaryEmailToLandlord = (saved_form_state, building) => {
  const ses = new AWS_SES({
		region: 'us-east-1',
	})
  const p = new Promise((res, rej) => {
    console.log(saved_form_state)
    console.log(building)
		const params = createInquiryParamsConfig(building.landlord_email, building.building_address, generateHTMLInquiryEmail(
      saved_form_state.about_tenant,
      saved_form_state.roommates,
      saved_form_state.suite_room_preferences,
      saved_form_state.guarantor,
      building,
    ))
    console.log(params)
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

const createInquiryParamsConfig = (landlord_email = 'huang.khan74@gmail.com', building_address, HTML_Email) => {
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
	      landlord_email
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
	      Data: 'RentBurrow Tenants for ' + building_address, /* required */
	      Charset: 'UTF-8'
	    }
	  },
	  Source: 'email.records.rentburrow@gmail.com', /* required */
	  // ConfigurationSetName: 'STRING_VALUE',
	  ReplyToAddresses: [
	      landlord_email,
	      'email.records.rentburrow@gmail.com'
	    /* more items */
	  ],
	  ReturnPath: 'email.records.rentburrow@gmail.com',
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

const generateHTMLInquiryEmail = (
                                  about_tenant,
                                  roommates,
                                  suite_room_preferences,
                                  guarantor,
                                  building,
                                ) => {
  const building_url = `https://rentburrow.com/${building.building_id}`
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
		                                    <h2>${building.building_address}</h2>
		                                    <h3>${about_tenant.first_name} sent a message:</h3>
		                                </td>
		                            </tr>
		                            <tr style='border: 1px solid red; font-size: 1.2rem'>
		                                <td align='center' valign='top'>
		                                    <p>${`HELLO WORLD`}</p>
		                                </td>
		                            </tr>
		                        </table>
		                    </td>
		                </tr>
		                <tr style='background-color:#74a9d8;'>
		                    <td align='center' valign='top'>
		                        <table border='0' cellpadding='20' cellspacing='0' width='100%' id='emailReply'>
		                            <tr style='font-size: 1.2rem'>
		                                <td align='center' valign='top'>
		                                    <span style='color:#286090; font-weight:bold;'>Reply:</span> <br/> ${about_tenant.email}
		                                </td>
		                                <td align='center' valign='top'>
		                                    <span style='color:#286090; font-weight:bold;'>Phone:</span> <br/> ${about_tenant.phone || 'None Provided'}
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
