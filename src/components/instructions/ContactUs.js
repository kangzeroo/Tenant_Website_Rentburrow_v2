// Compt for copying as a ContactUs
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter, Link } from 'react-router-dom'
import {
	Card,
	Image,
	Icon,
	Modal,
} from 'semantic-ui-react'
import BookPhotoshootForm from '../community/landlord_info/forms/BookPhotoshootForm'
import ContactUsForm from '../community/student_info/forms/ContactUsForm'
import RedeemGiftForm from '../community/student_info/forms/RedeemGiftForm'


class ContactUs extends Component {

	constructor() {
		super()
		this.state = {
			toggle_modal: false,
      modal_name: '',
      context: {},
		}
	}

	toggleModal(bool, attr, context) {
		this.setState({
      toggle_modal: bool,
      modal_name: attr,
      context,
    })
  }

	renderAppropriateModal(modal_name, context) {
		if (modal_name === 'support') {
	    return (
	      <Modal
					dimmer
					open={this.state.toggle_modal}
					onClose={() => this.toggleModal(false)}
					closeIcon
					size='large'
				>
	        <Modal.Content>
						<ContactUsForm />
	        </Modal.Content>
	      </Modal>
	    )
		} else if (modal_name === 'filming') {
			return (
	      <Modal
					dimmer
					open={this.state.toggle_modal}
					onClose={() => this.toggleModal(false)}
					closeIcon
					size='large'
				>
	        <Modal.Content>
						<BookPhotoshootForm />
	        </Modal.Content>
	      </Modal>
	    )
		} else if (modal_name === 'gift') {
			return (
	      <Modal
					dimmer
					open={this.state.toggle_modal}
					onClose={() => this.toggleModal(false)}
					closeIcon
					size='large'
				>
	        <Modal.Content>
						<RedeemGiftForm />
	        </Modal.Content>
	      </Modal>
	    )
		}
  }

	renderGeneralSupport() {
		return (
			<Card onClick={() => this.toggleModal(true, 'support')} raised style={comStyles().card}>
		    <Image src={supportIcon} width='25%' height='100%' />
				<div style={comStyles().content}>
			    <Card.Content>
		        <Card.Header style={comStyles().title}>
			        Contact Us
			      </Card.Header>
			      <Card.Meta>
			        <span className='date'>
			          General Inquiries
			        </span>
			      </Card.Meta>
			      <Card.Description>
			        Email us any questions you may have or use our in-app chat. We will get back to you as soon as possible.
			      </Card.Description>
			    </Card.Content>
					<br/>
			    <Card.Content extra>
						<a>
							<Icon name='mail' />
							support@rentburrow.com
						</a>
			    </Card.Content>
				</div>
		  </Card>
		)
	}

	renderFilmingSupport() {
		return (
			<Card onClick={() => this.toggleModal(true, 'filming')} raised style={comStyles().card}>
		    <Image src={cameraIcon} width='25%' height='100%' />
				<div style={comStyles().content}>
			    <Card.Content>
			      <Card.Header style={comStyles().title}>
			        Book A Photoshoot
			      </Card.Header>
			      <Card.Meta>
			        <span className='date'>
			          Free for all Landlords & Subletors
			        </span>
			      </Card.Meta>
			      <Card.Description>
			        A full professional photoshoot including free virtual tours. Contact us to book a time for our camera crew to come over.
			      </Card.Description>
			    </Card.Content>
					<br/>
			    <Card.Content extra>
						<a>
							<Icon name='mail' />
							vincent@rentburrow.com
						</a>
						&nbsp; &nbsp;
			      <a>
			        <Icon name='phone' />
			        Vincent (226) 989-7881
			      </a>
			    </Card.Content>
				</div>
		  </Card>
		)
	}

	renderGiftSupport() {
		return (
			<Card onClick={() => this.toggleModal(true, 'gift')} raised style={comStyles().card}>
		    <Image src={giftIcon} width='25%' height='100%' />
				<div style={comStyles().content}>
			    <Card.Content>
			      <Card.Header style={comStyles().title}>
			        Redeem Your Gift
			      </Card.Header>
			      <Card.Meta>
			        <span className='date'>
			          Subject: Redeem Gift
			        </span>
			      </Card.Meta>
			      <Card.Description>
							Email us to let us know which gift you want. We will verify your lease with the landlord your gift will be available for pickup at SLC or Laurier Concourse. <Link to='/prizes'>Click here to see full list of gifts.</Link>
			      </Card.Description>
			    </Card.Content>
					<br/>
			    <Card.Content extra>
			      <a>
			        <Icon name='mail' />
			        support@rentburrow.com
			      </a>
			    </Card.Content>
				</div>
		  </Card>
		)
	}

	render() {
		return (
			<div style={comStyles().container}>
				{
					this.renderGeneralSupport()
				}
				{
					this.renderFilmingSupport()
				}
				{
					this.renderGiftSupport()
				}
				{
          this.renderAppropriateModal(this.state.modal_name, this.state.context)
        }
			</div>
		)
	}
}

// defines the types of variables in this.props
ContactUs.propTypes = {
	history: PropTypes.object.isRequired,
}

// for all optional props, define a default value
ContactUs.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(ContactUs)

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
			width: '100%',
			height: '60%',
			justifyContent: 'center',
			alignItems: 'center',
			padding: '100px',
		},
		card: {
			margin: '20px auto',
			width: '600px',
			height: '150px',
      display: 'flex',
      flexDirection: 'row',
			cursor: 'pointer',
		},
		title: {
			fontSize: '1.5rem',
			fontWeight: 'bold',
		},
		content: {
			width: '75%',
			height: '100%',
			padding: '15px',
		}
	}
}

const cameraIcon = `data:image/png;base64,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`

const supportIcon = `data:image/png;base64,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`

const giftIcon = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAbkSURBVHhe7V1riFVVFNbeRe+iojckREaNc++d0aSyoKIielBCFL3JiEoT0zn73Kn7J6KCfgQmSA960I+UyurO3kcNlIIskIosSrSizIo0UssaH2nfOmdNnnPvdubec+55jKwPPmbuXXuvvfb+1n6dO48xAoEgK3T1mTNLrpledrUpKf0Nvm4qu2Z3SZmteH81vr5SVgPXT5r5xqFcpZCYOnXB/hWlpyD+uYj7U8S9mfqB13+hX9/hveXgoyVncZmrFAu9c/SpCPrFsjL/BoEPT3RmCzpXLdfePYxdFAO12n4VV9+Nfvxki9tKpb0etz6BPeQPDG6p5OpfrcGOQGTbz2XlXc6uckWl35xNs8EW54hUZlu5aqayq/xQquqzhpalvZKCtb3PhCg7MLtmsMtc0O14VyLOP2zxDRFJt932/hAh5s6S413DLvPA7rEIYnlTcMqsKLsDt1eq3mnjawsOopLja8sOp2mN8gqDv7apjl9PO77bjFFxzLW2pEGcGxDT0+jH5B5n6XFUlvaW82uLT4D9OvRlIZJxV7SeXt9Ve/to33HWwBS9JBqMn+2PkVBcxAoSCQMwx5ZxqH8/F8sENNgY+K2NcSC++a0MLB1QGsUsKW8Wm7MFGn85GohexKaWQKcY1Pk97CPonNfLRVLFRPX+icjyX8Lt+8uOGriXi7QExNwf9aFXsSlbYHquiQSizEVsahklpz6xOUP19+W+pUdxkZRAy61e0tDuLuwld3GBlkEzCfUHw34yX7bGPaQPpoaHgkCm/zOltuwANrcFf9o3rsXKPMfmVOAfbcPtgRCoxua2gZn1cdhXt2MuYFM24I0t3Jkf2BQLqP9U2B8EwX0mnaULd5/j0d7GcHs0W2jD5iJtAwn1Zthf2dFXsykbTKp5x4YDQIasY1MslKetPBCDsiriU5nP4s664YDBe6mhnc1d7nunsDkWaP+M+HT0FWzKCLjRBln8fxCDSQePTjwNPukoPJPNHUF3tX5x4/IIQR5gc2xAkE8iPvN4pIKGv4oEgRs7m2IDPuZFfCJ7u2cvOZnNiUAJ0zQLsfZTcnGRWIDfQ+Dn75DPnXTvYnN2QMMvRDqnzONsig06XSGD10f8uvp1NicC/Dwc8av0jgl9XhebYwOz+KawX8T/OZuyhf+4IRQIOrxx8uxFR7A5NnCxuiXsl5YYiN32kTqMnkfqJ9FsC/uFIM+yOQF2j0V8H4X94nWVjdkiWALMt+Fg8HoemxPA7+QHEb/KfJFkj0KyvBrxhwthb00fyebYwOy4J+wXHKQn32zOHujYndGA9K6KY25jc2zwc6+dYd8QxWVzW6i4A1dRXBFfjr6DzbGxl0vtXDbnheYHjP5AduB0BD+RDR4cbPdzBzqew8+6iB9lVoz0vG0kkMjwuyXiF3vfeU79GC6SH3CUPAMB/RYNjjJaP5/kEQJt8I2DiYxc22qn6aKHxPDC9cHBnn5zLhdpG/4yrbxZftKF/SqzDe9fysXyhz99mzLGH8ANCPa+uLdgumA1LTfKfDjysRIzFwkRrufXdY3iAm0jWPqiR32fuDvFeQaWOrBxTqKTVlPAPvV6DOST3f31c7h4y0CWP9Hojy5i9OEYF4mAZiUGfmFjHcRg2k0MugOhXh/69XWzPxAzoxN7ZmrAMnM6DZY1+CHS59XKvOV3tKpvDY7PXi/dbm30bUp/2exH/wk/8zFYN/jJ4HjXkHj43vJxst5UqZrLbP6HSPaK0jcjcWagzmsQdXWznz1ETD/S0wXuenFBWYjOTMdgDfuR6GglBN8OMZ5J/TZuy5ok9DPS1e8gO6OP1kcxafZXXO9GW3+T0CquLQBhRqzqC1mGPbAWzJ30Ey16ZcfYzs9bZcnRIgiWiDqH1xFg03ds7eROEaRgFEEKRhGkYBRBCkYRpGAUQQpGEaRgFEEKRhGkYBRBCkYRpGAUQQpGEaRgFEEKRhGkYBRBCkYRpGAUQQpGqyDKzC8cXe9BDq8j4L/YYG8rRyKucRyiQCAQjHrQ3yMpuXpa3qQ1n0PqCIJfBLK3lSXpV+w4pNYQ/PKl5TSQMffZU5btVDUcRJCUKYIEEEESUgRhiCApUwQJIIIkpAjCEEFSpggSQARJSBGEIYKkTBEkgAiSkCIIQwRJmSJIABEkIUUQhgiSMkWQACJIQoogDBEkZYogAUSQhBRBGCJIyhRBAoggCSmCMESQlCmCBBBBElIEYYggKVMECSCCJKQIwhBBUqYIEkAESUgRhCGCpEwRJIAIkpAiCEMESZkiSAARJCFFEIYIkjJHryBmA0RZ2imWXb3G1k7mHK2C7LMUQQpGEaRgbFcQ/59DWv7fnrAzTP2fUgoE+yjGjPkPuWUjj2hJWLEAAAAASUVORK5CYII=`
