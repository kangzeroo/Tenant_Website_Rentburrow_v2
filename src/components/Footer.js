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


class Footer extends Component {

	render() {
		return (
			<div style={comStyles().container}>
        <div style={comStyles().leftFloat}>
          <Link to='/' onClick={() => this.refreshEverything()}>
            <img style={comStyles().logo} src='https://s3.amazonaws.com/rentburrow-static-assets/Logos/rbdesktop.png' alt='logo' />
          </Link>
          <div style={comStyles().desc}>
            Rentburrow.com is the marketplace for student housing.<br/>Tour, sign & pay for your rent online.
          </div>
          <div style={comStyles().copyright}>
            &nbsp; &nbsp; &copy; 2017 Bytenectar Inc
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
                <Link to='/prizes' onClick={() => this.props.forceScrollTop()} style={comStyles().link}>Signing Prizes</Link>
              </div>
              <div style={comStyles().col}>
                <Link to='/protips' style={comStyles().link}>FAQ & Protips</Link>
                <Link to='/contact' style={comStyles().link}>Contact Us</Link>
                <Link to='/privacy' style={comStyles().link}>Privacy Policy</Link>
              </div>
            </div>
          </div>
          <div style={comStyles().landlord_section}>
            <Header
              as='h1'
              inverted
              content='Landlords'
            />
            <div style={comStyles().grid}>
              <div style={comStyles().col}>
                <Link to='/how-it-works' style={comStyles().link}>How It Works</Link>
                <Link to='/pricing' style={comStyles().link}>Pricing</Link>
                <Link to='/landlord-faq' style={comStyles().link}>Landlord FAQ</Link>
              </div>
              <div style={comStyles().col}>
                <Link to='/join-landlord' style={comStyles().link}>Join The Network</Link>
                <Link to='/contact' style={comStyles().link}>Contact Us</Link>
              </div>
            </div>
          </div>
        </div>
			</div>
		)
	}
}

// defines the types of variables in this.props
Footer.propTypes = {
	history: PropTypes.object.isRequired,
  changeRentType: PropTypes.func.isRequired,
  forceScrollTop: PropTypes.func.isRequired,    // passed in
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
      backgroundColor: xMidBlue,
      padding: '20px',
      minHeight: '20vh',
      maxHeight: '20vh',
      width: '100%',
      zIndex: '1',
      display: 'flex',
      flexDirection: 'row',
      position: 'relative',
      color: 'white',
    },
    leftFloat: {
      display: 'flex',
      flexDirection: 'column',
      float: 'left',
      minWidth: '30%',
      maxWidth: '30%',
      height: '100%',
    },
    desc: {
      padding: '10px',
      fontSize: '1.1rem',
    },
    logo: {
      height: '5vh',
      width: 'auto',
      float: 'left',
      margin: '5px'
    },
    table_of_contents: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-end',
      minWidth: '70%',
      maxWidth: '70%',
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
      width: '40%',
    }
	}
}
