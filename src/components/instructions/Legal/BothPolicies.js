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


class BothPolicies extends Component {

	render() {
		return (
			<div id='BothPolicies' style={comStyles().container}>
				<div style={comStyles().title}>Terms Of Use</div>
        <div style={comStyles().desc}>
          {`
            ByteNectar Inc. (“Company”/”we”/”us”/”our”), operates Rentburrow.com (“Site”) and a family of Web sites and associated Web pages. ByteNectar Inc. refers to this group of websites as “RentHero”. Any person accessing or using RentHero is referred to as “User”. RentHero and other associated services and offerings, includes, without limitation, mobile and tablet applications.
RentHero provides an online platform that enables registered users to list properties that are available for rent (“Landlords”) and/or to search listed rental properties and contact Landlords to rent available properties (“Tenants”) (collectively, the “Services”).
          `}
          <br />
          {`
            BY ACCESSING OR USING ANY PART OF RENTHERO, COMPLETING THE REGISTRATION PROCESS, AND/OR CLICKING THE “I ACCEPT” BUTTON, YOU REPRESENT AND WARRANT THAT (1) YOU HAVE READ, UNDERSTOOD, AND AGREE TO BE BOUND BY THESE TERMS AND CONDITIONS OF THESE TERMS OF USE (“TERMS OF USE”), (2) YOU ARE OF LEGAL AGE TO FORM A BINDING CONTRACT WITH BYTENECTAR,, AND (3) YOU HAVE THE AUTHORITY TO ENTER INTO THE TERMS OF USE PERSONALLY OR ON BEHALF OF THE ENTITY YOU HAVE NAMED AS THE USER, AND TO BIND THAT ENTITY TO THESE TERMS. THE TERM “YOU” REFERS TO THE INDIVIDUAL OR LEGAL ENTITY, AS APPLICABLE, IDENTIFIED AS THE USER WHEN YOU REGISTERED ON THE SERVICES. IF YOU DO NOT AGREE TO THESE TERMS, YOU MAY NOT USE THE SITE, APPLICATION, OR SERVICES.
          `}
        </div>


				<div style={comStyles().subtitle}>1. Applicable Terms and Policies</div>
				<div style={comStyles().desc}>
          <div style={comStyles().subsubtitle}>1.1 Guidelines.</div>
          {`
            When using the Service, you will be subject to any additional posted guidelines or rules applicable to specific services and features, including, without limitation, end user license agreements for downloadable applications, which may be posted from time to time (collectively, the "Guidelines"). All such Guidelines are hereby incorporated by reference into the Terms.
          `}
        </div>
        <div style={comStyles().desc}>
          <div style={comStyles().subsubtitle}>1.2 Privacy Policy.</div>
          {`
            Please read the Privacy Policy (the “Privacy Policy”) carefully for details relating to what information and data RentHero collects from you and other users, and how we use that information internally and disclose it to third parties. RentHero’s Privacy Policy is hereby incorporated into these Terms by reference.
          `}
        </div>


        <div style={comStyles().subtitle}>2. Our Proprietary Rights</div>
        <div style={comStyles().desc}>
          <div style={comStyles().subsubtitle}>2.1 General.</div>
          {`
            The content, interactive and visual features, software, information, listings, and all other elements of the Service provided by RentHero (“RentHero Materials”) are owned and/or licensed by RentHero and protected by all relevant intellectual property, proprietary, and other applicable laws and regulations. RentHero Materials do not include User Submissions (as defined below). Except as expressly authorized by RentHero, you agree not to sell, license, distribute, copy, modify, publicly perform or display, or otherwise make unauthorized use of the Service and RentHero Materials. RentHero reserves all rights not expressly granted herein.
          `}
        </div>
        <div style={comStyles().desc}>
          <div style={comStyles().subsubtitle}>2.2 License.</div>
          {`
            RentHero grants you a limited non-exclusive license to access and use the Service for your personal, non-commercial purposes.
          `}
        </div>
        <div style={comStyles().desc}>
          <div style={comStyles().subsubtitle}>2.3 Further Restrictions.</div>
          {`
            You further agree not to (i) intentionally interfere with, damage, impair, or disable the Service’s operation, by any means (whether through automated means or otherwise), including uploading or otherwise disseminating viruses, worms, spyware, adware or other malicious code; (ii) make unsolicited offers, advertisements, proposals, or send junk mail or spam to other Users; (iii) use the Service or RentHero Materials for any unlawful purpose or as prohibited by these Terms; (iv) defame, harass, abuse, threaten, stalk, impersonate, or defraud other Users, or collect personal information about them or third parties without their consent; (v) use any robot, spider, scraper, site search/retrieval application, or other automated means to access the Service for any purpose (including, without limitation, to retrieve information from or data mine the Service) without RentHero’s express consent or bypass RentHero’s robot exclusion headers or similar measures; (vi) remove, circumvent, disable, damage or otherwise interfere with the Service’s security-related features, features that prevent or restrict the use or copying of any part of the Service, or features that enforce Service limitations; (vii) attempt to gain unauthorized access to the Service, other User accounts, computer systems or networks connected to the Service through hacking, password mining, or any other means; (viii) deep-link to the Service, and you agree you will promptly remove any links that RentHero finds objectionable in its sole discretion; (ix) reverse engineer, decompile, disassemble or otherwise attempt to discover the source code of the Service, except and only to the extent that such activity is expressly permitted by applicable law notwithstanding this limitation; (x) harm or exploit minors; or (xi) modify, adapt, reproduce, translate, or create derivative works based upon the Service, except to the extent expressly permitted by applicable law notwithstanding this limitation.
          `}
        </div>
        <div style={comStyles().desc}>
          <div style={comStyles().subsubtitle}>2.4 Service Access.</div>
          {`
            The Service is controlled and offered by RentHero from its facilities in Canada and elsewhere, including all or a portion of the Service that may be operated from the “cloud”, or other similar distributed hosting environment. RentHero makes no representations that the Service is appropriate or available for use in other locations. If you are accessing or using the Service from other jurisdictions, you do so at your own risk and you are responsible for compliance with local law.
          `}
        </div>


				<div style={comStyles().subtitle}>3. User Submissions</div>
        <div style={comStyles().desc}>
          <div style={comStyles().subsubtitle}>3.1 General.</div>
          {`
            The Service may now or in the future permit the submission and posting of or linking to data, files, text, photos, commentary or any other content submitted by you and other Users, including without limitation, listings for apartments, other real estate or roommates (collectively, “User Submissions”), and the hosting and/or publishing of such User Submissions. RentHero may or may not use your User Submissions in its sole discretion. You understand that whether or not such User Submissions are published, RentHero does not guarantee confidentiality with respect thereto. For example, RentHero may provide you with a service to anonymize your email address to communicate with other users. However, RentHero does not guarantee that such feature will keep your email address confidential. Furthermore, the Service may now or in the future restrict the amount and/or number of User Submissions you may host on the Service, and you agree that RentHero may impose such limits in its sole discretion.
          `}
        </div>
        <div style={comStyles().desc}>
          <div style={comStyles().subsubtitle}>3.2 Grant of Rights.</div>
          {`
            By submitting User Submissions to RentHero or the Service, you hereby grant RentHero and its affiliates a worldwide, non-exclusive, fully paid-up, royalty-free, irrevocable, transferable license, with the right to grant and authorize sublicenses, to use, reproduce, distribute, modify, adapt, prepare derivative works of, display, perform, and otherwise exploit (collectively, “Use”) your User Submissions in connection with the Service (including, without limitation, to provide you with any related services) and/or RentHero’s (and its successor’s) business (including without limitation for promoting and redistributing part or all of the Service (and derivative works thereof) in any media formats and through any media channels now known or hereafter discovered). You grant RentHero, its affiliates, and sublicensees the right to use any personal information that you submit in connection with such User Submission, as provided for in the Privacy Policy. You also agree to irrevocably waive (and cause to be waived) any claims and assertions of moral rights or attribution with respect to your User Submissions. You also hereby grant to each User of the Service a non-exclusive license to access your User Submissions through the Service, and to use, reproduce, distribute, prepare derivative works of, display, and perform such User Submissions as permitted by the functionality of the Service and these Terms. Except for the limited rights set forth in these Terms, each User retains all right, title, and interest in its User Submissions. If you make suggestions or provide feedback to RentHero on improving or adding new features to the Service, RentHero may Use such suggestions or feedback in any manner without any compensation to you.
          `}
        </div>
        <div style={comStyles().desc}>
          <div style={comStyles().subsubtitle}>3.3 User Submissions Representations and Warranties.</div>
          {`
            You and each User shall be solely responsible for your User Submissions and the consequences of uploading, posting, or publishing them through the Service. In connection with User Submissions, you represent and warrant that: (i) you own, or have the necessary rights to use and authorize RentHero to use, all intellectual property or other proprietary rights to User Submissions to enable inclusion and use of User Submissions in the manner contemplated by these Terms, and to grant the rights and license set forth above (without any additional compensation); and (ii) your User Submissions, RentHero’s and other Users’ use of such User Submissions in connection with the Service, and RentHero’s and other Users’ exercise of the license rights set forth above, do not and will not: (a) infringe, violate, or misappropriate any third-party right, including any intellectual property and proprietary rights; (b) slander, defame, libel, or invade the right of privacy, publicity or other property rights of any other person; or (c) violate any applicable law or regulation (including, without limitation, any statute, rule or regulation applicable to housing or real estate, such as the Fair Housing Act).
          `}
        </div>
        <div style={comStyles().desc}>
          <div style={comStyles().subsubtitle}>3.4 User Submissions Prohibited Uses.</div>
          {`
            In connection with your User Submissions, you further agree that you will not: (i) publish falsehoods or misrepresentations that could damage RentHero or any third party; (ii) submit material that is inaccurate, misleading, defamatory, threatening, pornographic, obscene, vulgar, harassing, harmful, hateful, abusive, racially or ethnically offensive or encourages (or provides instruction regarding) conduct that would be considered a criminal offense, give rise to civil liability, or is otherwise inappropriate; (iii) impersonate another person or entity or falsely state or otherwise misrepresent your affiliation with a person or entity; or (iv) upload User Submissions that would be harmful to minors in any manner.
          `}
        </div>


				<div style={comStyles().subtitle}>4. Non-RentHero Content Disclaimer</div>
        <div style={comStyles().desc}>
          {`
            You understand that when using the Service, you will be exposed to User Submissions and other content from a variety of sources, including listings information that RentHero aggregates from third parties (collectively, “Non-RentHero Content”). RENTHERO IS NEITHER RESPONSIBLE NOR LIABLE IN ANY WAY FOR THE ACCURACY, INTEGRITY, QUALITY, LEGALITY, USEFULNESS, SAFETY, OR INTELLECTUAL PROPERTY RIGHTS OR INFRINGEMENT RELATING TO SUCH NON-RENTHERO CONTENT, NOR FOR ANY LOSS OR DAMAGE OF ANY KIND INCURRED AS A RESULT OF THE USE OF ANY NON-RENTHERO CONTENT DISPLAYED OR TRANSMITTED VIA THE SERVICE, OR ANY CONTACT YOU HAVE WITH ANY THIRD PARTY PROVIDER/ CONTRIBUTOR OF NON-RENTHERO CONTENT, OR ANY TRANSACTION YOU CONSUMMATE IN CONNECTION WITH YOUR USE OF OR ACCESS TO ANY NON-RENTHERO CONTENT (INCLUDING, WITHOUT LIMITATION, ANY TRANSACTIONS RELATING TO THE RENTING, LEASING OR PURCHASING OF HOUSING UNITS OR OTHER REAL ESTATE). WITHOUT LIMITING THE GENERALITY OF THE FOREGOING, RENTHERO IS NOT RESPONSIBLE OR LIABLE (UNDER ANY THEORY OF LIABILITY) FOR ANY USER’S OR THIRD PARTY’S VIOLATION OF ANY LAWS OR REGULATIONS RELATING TO HOUSING, RENT-TO-OWN TRANSACTIONS, OR NON-DISCRIMINATION. YOU FURTHER UNDERSTAND AND ACKNOWLEDGE THAT YOU MAY BE EXPOSED TO NON-RENTHERO CONTENT THAT IS OFFENSIVE, INDECENT, OR OBJECTIONABLE, AND YOU AGREE TO WAIVE, AND HEREBY DO WAIVE, ANY LEGAL OR EQUITABLE RIGHTS OR REMEDIES YOU HAVE OR MAY HAVE AGAINST RENTHERO WITH RESPECT THERETO. RENTHERO DOES NOT ENDORSE ANY USER SUBMISSION OR OTHER NON-RENTHERO CONTENT OR ANY OPINION EXPRESSED THEREIN.
          `}
        </div>


        <div style={comStyles().subtitle}>5. Non-Monitoring of Non-RentHero Content and Users</div>
        <div style={comStyles().desc}>
          {`
            RentHero does not control the Non-RentHero Content posted by Users and does not have any obligation to pre- screen or monitor such Non-RentHero Content. If at any time, RentHero chooses, in its sole discretion, to pre-screen or monitor the Non-RentHero Content, RentHero nonetheless assumes no responsibility for the Non-RentHero Content, no obligation to modify or remove any inappropriate Non-RentHero Content, and no responsibility for the conduct of the User submitting any such Non-RentHero Content. Without limiting the foregoing, RentHero and its designees may, at any time and without prior notice, remove any Non-RentHero Content, in whole or in part, for any reason. Furthermore, you alone are responsible for your involvement with other Users. RentHero reserves the right, but has no obligation, to monitor disagreements between you and other Users. RentHero disclaims all liability related to any User disagreement.
          `}
        </div>


        <div style={comStyles().subtitle}>6. Monitoring User Communications</div>
        <div style={comStyles().desc}>
          {`
            You may be able to communicate through the Services with other users. You agree that RentHero may, but is not required to, monitor user communications made through the Services and take actions with respect to your account and access to the Services, in its sole discretion. For example, if RentHero concludes that a user is using the Services as part of a scam or other illegal activity, RentHero can take actions, such as blocking (e.g. IP addresses) and terminating the user’s access/account/license. RentHero may also filter, delete, delay posting, omit entirely, or verify any Non-RentHero Content. RentHero may also keep records of communications for organizational and customer support purposes. You agree that you will not circumvent RentHero’s monitoring activity, and RentHero is not liable for any consequences that may result from actions taken as a result of monitoring or not monitoring user communications. You also agree to give RentHero permission and consent to record any phone calls, SMS, emails or other communications conducted through the Services.
          `}
        </div>


        <div style={comStyles().subtitle}>7. Account Information</div>
        <div style={comStyles().desc}>
          {`
            In order to use some features of the Service, you will have to create an account through our online form(s) or depending on the service, through the use of your login(s) for Facebook or other social networking sites. When creating an account, you must provide true, accurate, current, and complete information. You also must ensure that this information is kept accurate and up-to-date at all times. Our use and disclosure of such information is specified in our Privacy Policy.
            If you are opening an account or using the Service on behalf of yourself, you represent that you are the age of majority in your jurisdiction and fully able and competent to enter into these Terms. In any case, you affirm that you are over the age of 18, as the Service is not intended for Users under 18.
            If you are opening an account or using the Service on behalf of a RentHero, entity, or organization (collectively “Registering Organization”), then you represent and warrant that you are an authorized representative of that Registering Organization with the authority to bind such organization to the Terms, and agree to be bound by the Terms on behalf of such Registering Organization.
          `}
        </div>


        <div style={comStyles().subtitle}>8. Password</div>
        <div style={comStyles().desc}>
          {`
            When you register you will be asked to provide a password. As you will be responsible for all activities that occur under your password, you should keep your password confidential. You are solely responsible for maintaining the confidentiality of your account and password and for restricting access to your computer, and you agree to accept responsibility for all activities that occur under your account or password. If you have reason to believe that your account is no longer secure (for example, in the event of a loss, theft or unauthorized disclosure or use of your account ID or password), you should immediately notify RentHero. You may be liable for the losses incurred by RentHero or others due to any unauthorized use of your account.
          `}
        </div>


        <div style={comStyles().subtitle}>9. Third Party Services and Third Party Materials</div>
        <div style={comStyles().desc}>
          {`
            RentHero may provide tools through the Service that enable you to export information, including exporting User Submissions to third party services (such as Facebook) or to your devices. By using these tools, you agree that we may transfer such information accordingly and that you will not use such exported information other than for your personal, non-commercial use. Such third party services are not under our control, and we are not responsible for their use of your exported information. The Service may also contain links, information, and references to third party products, services, and websites, which RentHero does not control or maintain (“Third Party Sites”). Access to and use of any Third Party Sites is at the User's own risk and RentHero is not responsible for the legality, accuracy or reliability of information or statements on Third Party Sites. RentHero provides these links merely as a convenience, and the inclusion of such links does not imply an endorsement. You should review any applicable terms and policies of such Third Party Sites, as RentHero’s Terms do not apply to them.
          `}
        </div>


        <div style={comStyles().subtitle}>10. Availability of the Service</div>
        <div style={comStyles().desc}>
          {`
            RentHero may make changes to or discontinue any part of the Service at any time without notice. The Service may be out of date, and RentHero makes no commitment to update materials on the Service.
          `}
        </div>


        <div style={comStyles().subtitle}>11. Termination</div>
        <div style={comStyles().desc}>
          {`
            These Terms become effective on the date you first use the Service and continue in effect until terminated in accordance with the provisions herein. You agree that RentHero may suspend, disable, delete or terminate your account or use of the Service at any time in its sole discretion, and you agree that RentHero shall not be liable to you or any third-party for any such termination. You may terminate these Terms at any time by closing your account, if any, and discontinuing use of the Service. In the event that these Terms are terminated, you will not register a new account under a different name. Upon termination, all licenses granted by RentHero herein will terminate. In the event that your account is removed or deleted for any reason, User Submissions that you submitted or saved may no longer be available. RentHero shall not be responsible for the loss of such content.
          `}
        </div>


        <div style={comStyles().subtitle}>12. Indemnification; Hold Harmless</div>
        <div style={comStyles().desc}>
          {`
            You agree to indemnify, defend, and hold harmless RentHero, and its parent, subsidiaries, affiliates or any related companies, its suppliers, licensors and partners, and the officers, directors, employees, agents and representatives of any of them from any and all claims, losses, obligations, damages, liabilities, costs or debt and expenses (including attorney’s fees) arising out of (i) your use or misuse of the Service; (ii) your User Submissions, including RentHero’s or other Users’ use, display or other exercise of their license rights granted herein with respect to your User Submissions; (iii) your violation of these Terms; (iv) your violation of the rights of any other person or entity, including claims that any User Submission infringes or violates any third party intellectual property rights; and (v) your breach of the foregoing representations, warranties, and covenants. RentHero reserves the right to assume the exclusive defense and control of any matter for which you are required to indemnify us and you agree to cooperate with our defense of these claims. You agree not to settle any matter without the prior written consent of RentHero. RentHero will use reasonable efforts to notify you of any such claim or proceeding upon becoming aware of it.
          `}
        </div>


        <div style={comStyles().subtitle}>13. DISCLAIMER</div>
        <div style={comStyles().desc}>
          {`
            THE SERVICE, RENTHERO MATERIALS, AND ANY NON-RENTHERO CONTENT MADE AVAILABLE ON THE SERVICE ARE PROVIDED ON AN “AS IS” BASIS, AND TO THE FULLEST EXTENT PERMISSIBLE PURSUANT TO APPLICABLE LAW, RENTHERO, ITS AFFILIATES, PARTNERS, AND SUPPLIERS DISCLAIM ALL WARRANTIES, STATUTORY, EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON- INFRINGEMENT. RENTHERO, ITS AFFILIATES, PARTNERS AND SUPPLIERS DO NOT WARRANT THAT THE RENTHERO MATERIALS, NON-RENTHERO CONTENT, THE SERVICE, OR ANY OTHER INFORMATION OFFERED THROUGH THE SERVICE OR ANY THIRD PARTY SITES WILL BE UNINTERRUPTED, OR FREE OF ERRORS, VIRUSES OR OTHER HARMFUL COMPONENTS AND DO NOT WARRANT THAT ANY OF THE FOREGOING WILL BE CORRECTED. RENTHERO, ITS AFFILIATES, PARTNERS AND SUPPLIERS DO NOT WARRANT OR MAKE ANY REPRESENTATIONS REGARDING USE OR THE RESULTS OF USE OF THE SERVICE OR ANY THIRD PARTY SITES IN TERMS OF CORRECTNESS, ACCURACY, RELIABILITY, OR OTHERWISE. RENTHERO, ITS AFFILIATES, PARTNERS AND SUPPLIERS DO NOT WARRANT OR MAKE ANY REPRESENTATIONS REGARDING THE PRODUCTS AND SERVICES THAT MAY BE OFFERED BY THIRD PARTIES IN ASSOCIATION WITH ANY NON-RENTHERO CONTENT OR THIRD PARTY SITES, OR THAT YOU MAY TRANSACT WITH THIRD PARTIES FOR AS A RESULT OF OR IN CONNECTION WITH YOUR USE OF THE SERVICE. WITHOUT LIMITING THE GENERALITY OF THE FOREGOING, RENTHERO DOES NOT WARRANT THAT ANY OF THE LISTINGS ON ITS RENT-TO-OWN OR OTHER WEBSITES ARE AFFORDABLE OR A GOOD DEAL FOR YOU, AND RENTHERO EXPRESSLY DISCLAIMS ALL LIABILITY ARISING FROM YOUR RELATIONSHIP WITH LANDLORDS OR SELLERS.
YOU UNDERSTAND AND AGREE THAT YOU USE, ACCESS, DOWNLOAD, OR OTHERWISE OBTAIN INFORMATION, MATERIALS, OR DATA THROUGH THE SERVICE OR ANY THIRD PARTY SITES AT YOUR OWN DISCRETION AND RISK AND THAT YOU WILL BE SOLELY RESPONSIBLE FOR ANY DAMAGE TO YOUR PROPERTY (INCLUDING YOUR COMPUTER SYSTEM) OR LOSS OF DATA THAT RESULTS FROM THE DOWNLOAD OR USE OF SUCH MATERIALS OR DATA, OR ANY LOSSES OR HARMS OF ANY KIND YOU MAY SUFFER AS A RESULT OF FOLLOWING UP ON, TRANSACTING AS A RESULT OF, OR OTHERWISE RELYING ON ANY SUCH INFORMATION.
          `}
        </div>


        <div style={comStyles().subtitle}>14. LIMITATION OF LIABILITY</div>
        <div style={comStyles().desc}>
          {`
            UNDER NO CIRCUMSTANCES, AND UNDER NO LEGAL THEORY, INCLUDING WITHOUT LIMITATION NEGLIGENCE, SHALL RENTHERO, ITS AFFILIATES, PARTNERS OR SUPPLIERS BE LIABLE FOR ANY SPECIAL, INDIRECT, INCIDENTAL, CONSEQUENTIAL, OR EXEMPLARY DAMAGES (INCLUDING WITHOUT LIMITATION LOSS OF PROFITS, DATA OR USE OR COST OF COVER) ARISING UNDER THESE TERMS OR THAT RESULT FROM YOUR USE OR INABILITY TO USE THE RENTHERO MATERIALS, NON-RENTHERO CONTENT, OR THE SERVICE, EVEN IF RENTHERO HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. IN NO EVENT SHALL RENTHERO, ITS AFFILIATES, PARTNERS OR SUPPLIERS’ TOTAL AGGREGATE LIABILITY TO YOU UNDER THESE TERMS OR IN CONNECTION WITH THE SERVICE EXCEED THE GREATER OF ONE HUNDRED DOLLARS OR FEES PAID IN THE PRECEDING TWELVE MONTHS. APPLICABLE LAW MAY NOT ALLOW THE LIMITATION OR EXCLUSION OF LIABILITY OR INCIDENTAL OR CONSEQUENTIAL DAMAGES, SO THE ABOVE LIMITATION OR EXCLUSION MAY NOT APPLY TO YOU. IN SUCH CASES, RENTHERO’S LIABILITY WILL BE LIMITED TO THE EXTENT PERMITTED BY LAW.
          `}
        </div>


        <div style={comStyles().subtitle}>15. Trademarks</div>
        <div style={comStyles().desc}>
          {`
            Trademarks of RentHero may be included within the Service. All trademarks, logos and service marks found on the Service (“RentHero Marks”) are the property of RentHero or other third parties. Users are not permitted to use any RentHero Marks without the prior written consent of RentHero or the third party that owns the respective RentHero Mark. RentHero bears no responsibility or liability for, and disclaims sponsorship of or affiliation with, any third party marks uploaded to or displayed through the Service. RentHero is generally unable to evaluate the merits of disputes regarding third party marks and encourages Users to resolve any such disputes directly.
          `}
        </div>

        <br /><br /><br />

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
BothPolicies.propTypes = {
	history: PropTypes.object.isRequired,
}

// for all optional props, define a default value
BothPolicies.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(BothPolicies)

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
      background: 'linear-gradient(269deg, #0bacbd, #1a76c1)',
      backgroundSize: 'cover',
      maxHeight: '100vh',
      padding: '30px',
      overflowY: 'scroll',
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
