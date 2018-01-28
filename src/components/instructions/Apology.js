// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'


class Apology extends Component {

	render() {
		return (
			<div id='Apology' style={comStyles().container}>
				<div style={comStyles().title}>What happened...</div>
				<div style={comStyles().subtitle}>Is RentHero just shit?</div>

				<div style={comStyles().desc}>
          {`
            Of course not. We pride ourselves in providing a useful service.
            Before I explain what happened, I want to thank you for using our website. Your experience matters a lot to us, especially because you've entrusted RentHero to help with such a big important decision - finding where to live.
          `}
        </div>
        {/*<div style={comStyles().iconBreak}>
          <i className='material-icons' style={comStyles().icon}>home</i>
        </div>*/}
        <div style={comStyles().desc}>
          {`
            Some of you only had 1 or 2 landlords reply to your inquiries after waiting several days. Basically we were manually sending inquiries to landlords in the first week, which was ok up until Day 8. Then we got overwhelmed. Over the holidays our tech team was working on an automated system to distribute your inquiries directly to landlords, but it was not quite ready yet.
            By Day 10 we rolled out the automated system and slowly transitioned landlords onto it one by one. The only problem was, we had already entered a death spiral.
          `}
        </div>

        <div style={comStyles().desc}>
          {`
            What is a death spiral? In business it refers to a negative feedback loop, but in our case it was from growing too fast - 700% per week. We had so many inquiries coming in that every 1 day of not being fully automated was 2 days of extra work.
            We were calling up landlords non-stop while trusting them to work just as fast calling up tenants.
            By Day 15 we thought we had finally moved everything into the automated system, but there was still many users using the old version of our website cached in their browser. Then things got worse.
          `}
        </div>

        <div style={comStyles().desc}>
          {`
            In the rush to get everything automated, we forgot the obvious. It wasn't until Day 20 that we realized some of our automated emails to landlords were being caught in their Spam folders. That's fixed now, but we still had the problem of slow landlords - the ones that take a few days to reply and only read messages on Tuesdays and Thursdays.
          `}
        </div>

        <div style={comStyles().desc}>
          {`
            So what have we done to improve landlord responsiveness? First, we began measuring average landlord response times and % of messages replied to. These metrics are public and have immediately improved speed.
            The second thing we've done is sit down with certain landlords to explain the need for good customer service. The majority of landlords are respectful of your time, space and rights as a tenant.
          `}
        </div>

        <div style={comStyles().desc}>
          {`
            And now we're here - Day 23. All systems stable (that we know of) and all landlords automated. It's been a crazy month for us, but more importantly, we know each one of you are having your own unique January 2018.
          `}
        </div>

        <div style={comStyles().desc}>
          {`
            Being in the business of rent is like being in the business of life - we're helping you find a home to live in. I always tell my team to be respectful to every person, because everyone is going through their own struggles.
            The person we're helping may be hoping for that dream co-op job, or in the hospital, or falling in love. When we see your name pop-up on our task queue, you matter to us.
          `}
        </div>

        <div style={comStyles().desc}>
          {`
            So thank you for enduring our fumbles and entrusting us to help you find a home. Whether you've already found a place or are still looking, we want the best for you. Breathe strong, its a new year.
          `}
        </div>

        <div style={comStyles().desc}>
          <div style={comStyles().salutation}>{`Happy Home Hunting!`}</div>
          <div style={comStyles().end}>{`- The RentHero Team`}</div>
        </div>

        <div style={comStyles().ps}>
          <div style={comStyles().capital_ps}>P. S.</div>
          If you have signed a lease, text us at <a href='tel:519-572-6998' style={{ color: 'white', fontStyle: 'underline' }}>519-572-6998</a> so we can get you your signing gift! Every roommate gets one :)
        </div>
			</div>
		)
	}
}

// defines the types of variables in this.props
Apology.propTypes = {
	history: PropTypes.object.isRequired,
}

// for all optional props, define a default value
Apology.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(Apology)

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
      background: 'linear-gradient(269deg, #0bacbd, #1a76c1)',
      backgroundSize: 'cover',
      maxHeight: '100vh',
      padding: '30px',
      overflowY: 'scroll',
		},
    title: {
      fontSize: '2.7rem',
      fontWeight: 'bold',
      color: 'white',
      lineHeight: '40px',
    },
    subtitle: {
      fontSize: '1.5rem',
      color: 'white',
      margin: '10px 0px 0px 0px',
      lineHeight: '25px',
    },
    desc: {
      fontSize: '1.2rem',
      color: 'white',
      margin: '30px 0px 0px 0px',
      lineHeight: '25px',
      fontStyle: 'italic',
    },
    iconBreak: {
      margin: '35px 0px 0px 25px',
      // textAlign: 'center',
    },
    icon: {
      fontSize: '5rem',
      color: 'white',
    },
    salutation: {
      fontSize: '1.2rem',
      color: 'white',
      lineHeight: '25px',
    },
    end: {
      fontSize: '1.6rem',
      color: 'white',
      margin: '10px 0px 0px 0px',
      lineHeight: '25px',
      fontWeight: 'bold',
    },
    capital_ps: {
      fontSize: '1.5rem',
      color: 'white',
      fontWeight: 'bold',
      margin: '0px 0px 15px 0px',
    },
    ps: {
      fontSize: '1.1rem',
      color: 'white',
      margin: '40px 0px 0px 0px',
      lineHeight: '25px',
    }
	}
}
