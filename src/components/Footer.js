// Compt for copying as a Footer
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter, Link } from 'react-router-dom'
import {
  Header,
} from 'semantic-ui-react'
import { xMidBlue } from '../styles/base_colors'
import { changeRentType } from '../actions/search/search_actions'
import SocialMediaContainer from './share/SocialMediaContainer'

class Footer extends Component {

	render() {
		return (
			<div id='Footer' style={comStyles().container}>
        <div>
        <div style={comStyles().leftFloat}>
          <Link to='/' onClick={() => this.refreshEverything()}>
            <h1 style={comStyles().font_logo}>Rent Hero</h1>
          </Link>
          <div style={comStyles().desc}>
            RentHero.ca is the marketplace for student housing.<br/>Tour & apply for your rent online.
          </div>
          <div style={comStyles().copyright}>
            &nbsp; &nbsp; &copy; 2018 Bytenectar Inc
          </div>
        </div>
        <div style={comStyles().table_of_contents}>
          <div style={comStyles().student_section}>
            <Header
              as='h1'
              inverted
              content='Students'
            />
            <div style={comStyles().grid}>
              <div style={comStyles().col}>
                <Link to='/lease' onClick={() => this.props.changeRentType('lease')} style={comStyles().link}>Browse Leases</Link>
                <Link to='/sublet' onClick={() => this.props.changeRentType('sublet')} style={comStyles().link}>Browse Sublets</Link>
                <Link to='/postsublet' onClick={() => this.props.changeRentType('sublet')} style={comStyles().link}>Post Sublet</Link>
                {/*<Link to='/prizes' style={comStyles().link}>Signing Prizes</Link>*/}
              </div>
              {/*<div style={comStyles().col}>
                <Link to='/protips' style={comStyles().link}>FAQ & Protips</Link>
                <Link to='/privacy' style={comStyles().link}>Privacy Policy</Link>
                <Link to='/terms' style={comStyles().link}>Terms of Service</Link>
              </div>*/}
            </div>
          </div>
          <div style={comStyles().landlord_section}>
            <Header
              as='h1'
              inverted
              content='Landlords'
            />
            <div style={comStyles().grid}>
              {/*<div style={comStyles().col}>
                <Link to='/how-it-works' style={comStyles().link}>How It Works</Link>
                <Link to='/pricing' style={comStyles().link}>Pricing</Link>
                <Link to='/landlord-faq' style={comStyles().link}>Landlord FAQ</Link>
              </div>*/}
              <div style={comStyles().col}>
                <Link to='/join-landlord' style={comStyles().link}>Join The Network</Link>
                <Link to='/book-filming' style={comStyles().link}>Book A Filming</Link>
                <Link to='/contact' style={comStyles().link}>Contact Us</Link>
              </div>
            </div>
          </div>
          <div style={comStyles().about_section}>
            <Header
              as='h1'
              inverted
              content='About'
            />
            <div style={comStyles().grid}>
              {/*<div style={comStyles().col}>
                <Link to='/how-it-works' style={comStyles().link}>How It Works</Link>
                <Link to='/pricing' style={comStyles().link}>Pricing</Link>
                <Link to='/landlord-faq' style={comStyles().link}>Landlord FAQ</Link>
              </div>*/}
              <div style={comStyles().col}>
                <Link to='/termsofuse' style={comStyles().link}>Terms of Use</Link>
                <Link to='/privacypolicy' style={comStyles().link}>Policy Policy</Link>
              </div>
            </div>
          </div>
        </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} >
          <SocialMediaContainer />
        </div>
			</div>
		)
	}
}

// defines the types of variables in this.props
Footer.propTypes = {
	history: PropTypes.object.isRequired,
  changeRentType: PropTypes.func.isRequired,
}

// for all optional props, define a default value
Footer.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(Footer)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {

	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
    changeRentType,
	})(RadiumHOC)
)

// ===============================

// the JS function that returns Radium JS styling
const comStyles = () => {
	return {
    container: {
      // backgroundColor: xMidBlue,
      backgroundColor: '#222',
      padding: '20px',
      minHeight: '25vh',
      maxHeight: '25vh',
      width: '100%',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
    },
    leftFloat: {
      display: 'flex',
      flexDirection: 'column',
      float: 'left',
      minWidth: '40%',
      maxWidth: '40%',
      height: '100%',
    },
    desc: {
      padding: '10px',
      fontSize: '1.1rem',
      width: '100%'
    },
    logo: {
      height: '5vh',
      width: 'auto',
      float: 'left',
    },
    table_of_contents: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-end',
      minWidth: '60%',
      maxWidth: '60%',
      float: 'right',
    },
    student_section: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      color: 'white',
      width: '30%',
    },
    landlord_section: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      color: 'white',
      width: '30%',
    },
    about_section: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      color: 'white',
      width: '30%',
    },
    link: {
      fontSize: '1.1rem',
      color: 'white',
    },
    grid: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'flex-start',
    },
    col: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
    },
    font_logo: {
      color: 'white',
      fontFamily: `'Carter One', cursive`,
      margin: '0px 0px 0px 20px',
    }
	}
}
