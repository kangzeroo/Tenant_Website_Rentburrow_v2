// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
// import {
//
// } from 'antd-mobile'


class PrivacyPolicyCard extends Component {

	render() {
		return (
			<div id='PrivacyPolicyCard' style={comStyles().container}>
				<div style={comStyles().title}>Privacy Policy</div>
        <div style={comStyles().desc}>
          {`
            ByteNectar Inc. (“RentHero”/”we”/”us”/”our”), operates Rentburrow.com (“Site”) and a family of Web sites and associated Web pages. ByteNectar Inc. refers to this group of websites as “RentHero” (collectively, the “Sites, and each, a “Site”).
The Renthero family of Web sites, mobile apps, mobile-optimized Web sites and other applications, linking to or bearing this privacy policy (“Privacy Policy”) and operated by or on behalf of RentHero are committed to implementing policies and procedures designed to provide for privacy and security and deliver the best possible online experience.
The RentHero family of websites includes, but is not limited to:
(i) https://rentburrow.com,
(ii) https://renthero.ca,
(iii) https://m.renthero.ca.
In conjunction with this Privacy Policy, please review our Terms of Use for a better and complete understanding of the rules governing our Sites.

          `}
        </div>


				<div style={comStyles().subtitle}>Collection of Information</div>
				<div style={comStyles().desc}>
          <div style={comStyles().subsubtitle}>1. Information you provide.</div>
          {`
            Information collected from you will vary, depending on how you access, visit, use or otherwise take advantage of the Sites and what information you may choose to provide to us (whether through email or otherwise). It may be possible to browse various sections of the Sites without submitting any Personal Information. “Personal Information” means individually identifiable information about you that we collect online or otherwise through the Sites, including, but not limited to, your full name, a username and password, email address, phone number, physical address, or, for certain products or services, your social security number, or financial information, and for certain e-commerce transactions your credit card information. Information in a form that is aggregated with other information, anonymized or otherwise processed so as not to be reasonably identifiable with you, and information in a form that otherwise is detached, combined, organized, segmented, modified or processed so as not to be reasonably capable of being associated with you, will not be considered Personal Information, and will not be restricted by this Privacy Policy as to use, sharing or otherwise. If you access, visit, use or otherwise take advantage of certain of our products and/or services, or certain of our tools, Sites or Site functionality, we may receive, or you may be asked to provide Personal Information. Whenever we ask for Personal Information, we strive to provide a link to this Privacy Policy to help you understand how Personal Information will be used before you decide whether to disclose it. You can choose not to provide us with Personal Information, but then you may not be able to fully take advantage of certain features of our Sites and we may not be able to provide you with certain requested information, products and/or services.
          `}
        </div>
        <div style={comStyles().desc}>
          <div style={comStyles().subsubtitle}>2. Automatic Collection of Information.</div>
          {`
            We automatically track certain information about you as you access, visit, use or otherwise take advantage of our Sites; this is for various reasons, including to help us (i) better understand, offer, operate, improve and modify the Sites, (ii) better understand how the Sites are used and experienced, (iii) enhance, or better understand how we can enhance, your or others’ overall experience on one or more of the Sites, including providing advertising and other information that is relevant to you, and (iv) provide a reliable and accurate history of communications between you and landlords for purposes of safety and improved customer service. This tracked or automatically gathered information may include, among other things, your computer’s (as used in this Privacy Policy:, meaning a computer, tablet, smartphone or other relevant device) IP address (Internet Protocol address), identification number or location, the URLs and Site pages you’ve visited, sections of or content on Site pages on which you click or in which you are interested, the number of times you visit each Site page, what downloads and/or search queries you have made, when emails are opened or links are clicked, how long you spent on particular sections of each Site and on each Site generally, and information about your computer, browser or operating system type. This automatically gathered data includes information provided through the use of “cookies” (which is described in more detail below) and other technology or methods and may also include information gathered in connection with your use of third-party Websites and media (for example, through the use of “web beacons,” “clear GIFs” or “pixels”). Although not restricted by this Privacy Policy, we may also gather and use information, generated our self or obtained from others, derived from or based on information you have provided or that is obtained by way of the collection means referred to in this Privacy Policy (e.g., automatically).
          `}
        </div>
        <div style={comStyles().desc}>
          <div style={comStyles().subsubtitle}>3. Usage Logs and Cookies.</div>
          {`
            Cookies are small files that we or others send to and store on or with your computer so that your computer, browser, mobile app or other application can be recognized as unique the next time you access, visit, use or otherwise take advantage of the Sites or other media. Cookies may also reflect demographic data pertaining to you or other data linked to information you submit. One use or consequence of cookies is to enable you to receive customized ads, alerts, content, services or information. You are always free to decline any cookies we use by adjusting the settings of your browser, as your browser may permit; however, some products, services or features might not be available or operate properly if cookies are not enabled. In addition, we, our service providers and others sometimes use “web beacons” or “clear GIFs.” These perform statistical and administrative functions, such as ascertaining and measuring site and page traffic, verifying advertising paths, better understanding user interests and activity, gathering related information (such as information relating to a particular browser, device or I.P. address) and positioning images, and typically do so without detracting from your online experience. Web beacons and clear GIFs are not necessarily designed to collect Personal Information. In addition, if you have provided your email address, we might use a non-human unreadable form (or “hash”) of your email address to deliver, or facilitate delivery of, relevant advertisements and information to you on or by way of the Sites or on or by way of other Websites or media, including, for example, popular social media sites and features.
          `}
        </div>
        <div style={comStyles().desc}>
          <div style={comStyles().subsubtitle}>4. Mobile Device and Mobile Browser.</div>
          {`
            You may adjust settings on your mobile device and mobile browser regarding cookies and sharing of certain information, such as your mobile device model or the language your mobile device uses, by adjusting the privacy and security settings on your mobile device.  Please refer to the instructions provided by your mobile service provider or mobile device manufacturer.
          `}
        </div>
        <div style={comStyles().desc}>
          <div style={comStyles().subsubtitle}>5. Social Networks.</div>
          {`
            If you use the social networking connection functions offered through the Services, we may access all of your social network profile information that you have made available to be shared and to use it in accordance with this privacy policy.  Please refer to the instructions governing your social network account to manage the information that is shared through your account.
          `}
        </div>
        <div style={comStyles().desc}>
          <div style={comStyles().subsubtitle}>6. Calls/Text Messages/Email Management.</div>
          {`
            Calls and text messages to RentHero or to third parties through RentHero may be recorded or monitored for quality assurance and customer service purposes. If a call or message is sent between you and a third party, it will be deemed private information of both you and the third party, and may be released to either of you. You may also receive emails, SMS text messages and phone calls from RentHero for a variety of reasons - for example, if you took an action through the Services, you signed up for a regular report, or you posted a listing and an interested party sent you a message. We respect your desire to manage email correspondence. If you have an account with RentHero, you can select your preferences through your account settings and manage your receipt of some types of communication. Please note that, even if you unsubscribe from certain email correspondences, we may still need to contact you with important transactional or administrative information.
          `}
        </div>
        <div style={comStyles().desc}>
          <div style={comStyles().subsubtitle}>7. Children Under the Age of 18.</div>
          {`
            RentHero will not knowingly collect personally identifiable information from any person under the age of 18. The Services are not designed to attract the attention of persons under the age of 18.
          `}
        </div>


        <div style={comStyles().subtitle}>Usage and Disclosure</div>
        <div style={comStyles().desc}>
          <div style={comStyles().subsubtitle}>1. User Requested Services and Information. </div>
          {`
            For information, features, products and services provided by the Sites, the information you submit is used by us to provide the information, feature, product or service you’ve requested. We may also share this information with others to fulfill your request or to facilitate your use of the information, features, products or services, or as otherwise outlined in this Privacy Policy. When sharing Personal Information in such a manner, we may also share your computer’s Internet Protocol (IP) address, identification number or location. In addition, we may use and share any registration information that you submit as set forth in the “Registration Information” section below.

          `}
        </div>
        <div style={comStyles().desc}>
          <div style={comStyles().subsubtitle}>2. Registration Information.</div>
          {`
            The Personal Information you provide when you become a registered user or customer of one of the Sites is used primarily to help us customize or enhance your or others’ online experience, increase the convenience of accessing new or existing tools, products and services, and, if applicable, provide the information, features, products and/or services you purchase or request. This Personal Information may also be shared among the Sites to make use of the Sites more convenient by, for example, limiting the number of times you have to register with us. Your email address serves as a unique identifier in our record system, and together with your password is designed to help us prevent unauthorized access to information you choose to store on the Sites. The data you give us about your personal preferences and demographics, as well as other information we might have or obtain ourselves or from other sources (for example, based on or related to such data), may be used to help us offer content, advertisements, products, and services that we believe will be of interest to you. In addition, we may share this information, in aggregate or other protected form (see “Information you provide,” above) or under confidentiality terms, with our current and potential third parties so that they, or we, can present and deliver advertisements more effectively. If you forget your password for any registered area of the Sites, we have an automated password recovery system, which can be accessed by clicking on the “Forgot Password?” link on the sign-in page.
          `}
        </div>


				<div style={comStyles().subtitle}>3. Leads and Referrals</div>
        <div style={comStyles().desc}>
          <div style={comStyles().subsubtitle}>3.1 Consumers.</div>
          {`
            We may use the information you submit, as well as other data we might have or obtain ourselves or from other sources (for example, based on or related to such information), to determine which of our participating Professional(s) may be willing, able and/or compatible to serve your needs or possible interests and to assist them or others in doing so. We may forward or share information relating to you, which may include such information as well as Personal Information obtained through our sign-up form or otherwise, to certain Professional(s), which may sometimes include multiple Professionals (such as in cases where a given Professional has a marketing or business relationship with one or more other Professionals and designates them to receive such information, or in cases where the nature of a product, service or feature offered on or through a Site is designed to involve participation by multiple Professionals). Those Professionals or their affiliates, contractors, advertisers, agents or other designees may use such information and contact you regarding your needs or possible interests, as may we ourselves. The following paragraph applies only to Professionals; others may not infer any commitments or assurances from such following paragraph.
          `}
        </div>
        <div style={comStyles().desc}>
          <div style={comStyles().subsubtitle}>3.2 Professionals</div>
          {`
            Professionals might receive information from, or originating from, consumers seeking the Professional’s products or services or related information. These information submissions or related inquiries or leads might include, without limitation, Personal Information. Protecting personal privacy is important, so we require that Professionals treat data received from RentHero consumers as if it was still on the Sites and in accordance with this Privacy Policy. Professionals may use the information sent to the Professionals via our Sites only for the purposes of providing the consumer products and/or services about which the consumer inquired or such purpose(s), if any, specified by us in connection with such information being made available to you. We require that Professionals not make any other use of any such data and that Professionals otherwise not share or transmit this information with or to any third party without the consumer’s consent.
          `}
        </div>

        <div style={comStyles().subtitle}>4. Protection of Rights.</div>
        <div style={comStyles().desc}>
          {`
            We will release Personal Information or other information we collect from you if we believe that such action is appropriate to: (1) comply with legal process; (2) enforce the Terms of Use agreement for the applicable Site; (3) identify, contact or bring legal action against persons or entities who are or we believe have caused or might cause injury to us or a third party, (4) defend or respond to claims brought or threatened against RentHero, its employees, directors, suppliers or service providers, Site users or others or (5) otherwise protect or assert the rights, property, interests or personal safety of RentHero, its employees, directors, suppliers or service providers, Site users or others. Any such release decisions may be made by us in our sole discretion.
          `}
        </div>

        <div style={comStyles().subtitle}>5. Merger or Sale.</div>
        <div style={comStyles().desc}>
          {`
            We continue to develop our business and in doing so might choose to buy or sell, or expand or otherwise restructure (e.g., by way of joint ventures) with respect to, businesses or assets. Personal Information and other information we collect from you is generally one of the assets acquired, transferred otherwise shared or affected in connection with such transactions.
          `}
        </div>


        <div style={comStyles().subtitle}>Protection of Information</div>
        <div style={comStyles().desc}>
          {`
            Security of your information is of utmost importance to us. We use commercially reasonable efforts to store and maintain your Personal Information in a secure environment. We take technical, contractual, administrative, and physical security steps designed to protect Personal Information that you provide to us. Whenever we receive Personal Information, that information is protected from unauthorized access or use by way of passwords or other industry-acknowledged means. In addition, we utilize the cloud computing services of AWS to compute, store and run our databases over a secure network. Our servers are encrypted at storage holding sensitive information and analytics are anonymized. Since your Personal Information is especially sensitive, we take special care to keep it secure. We will only electronically transmit or ask for this information over secure Internet connections using precautions such as SSL (Secure Sockets Layer) encryption, security keys, and password authentication.
          `}
        </div>

        <div style={comStyles().subtitle}>Amendment of this Policy</div>
        <div style={comStyles().desc}>
          {`
            We reserve the right to change this Privacy Policy at any time. If we decide to change this Privacy Policy in the future, we will post an appropriate notice on the home page. Any non-material change (such as clarifications) to this Privacy Policy will become effective on the date the change is posted and any material changes will become effective 30 days from their posting on the Website.  Unless stated otherwise, our current Privacy Policy applies to all Personal Information that we have about you.  The date on which the latest update was made is indicated at the bottom of this document.  We recommend that you print a copy of this Privacy Policy for your reference and revisit this policy from time to time to ensure you are aware of any changes.  Your continued use of the Website signifies your acceptance of any changes.
          `}
        </div>
			</div>
		)
	}
}

// defines the types of variables in this.props
PrivacyPolicyCard.propTypes = {
	history: PropTypes.object.isRequired,
}

// for all optional props, define a default value
PrivacyPolicyCard.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(PrivacyPolicyCard)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {

	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {

	})(RadiumHOC)
)

// ===============================

// the JS function that returns Radium JS styling
const comStyles = () => {
	return {
		container: {
      display: 'flex',
      flexDirection: 'column',
      color: 'white',
		},
    title: {
      fontSize: '2rem',
      fontWeight: 'bold',
      margin: '0px 0px 20px 0px',
    },
    subtitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      margin: '20px 0px 10px 0px',
    },
    subsubtitle: {
      fontSize: '1.2rem',
      fontWeight: 'bold',
    },
    desc: {
      fontSize: '1rem',
      margin: '10px 0px 10px 0px',
    }
	}
}
