import React, { Component } from 'react';
import { connect } from 'react-redux';
import Radium from 'radium'
import PropTypes from 'prop-types'
import {
	Statistic,
} from 'semantic-ui-react'

import SalesWeek from './charts/SalesWeek'

class Dashboard extends Component {

	constructor() {
		super()
		this.state = {
		}
	}

	render() {
		return (
			<div style={comStyles().app}>
				{/* this.props.children */}
				{/* <iframe class="_virtualtour" src="http://www.walk-inside.com/202_188_king_st_waterloo/?format=0&amp;size=1&amp;compass=0&amp;noresize=1" width="100%" height="590"></iframe> */}
				<div style={comStyles().containerLeft}>
					<div style={welcomeStyles().welcomeContainer}>
						<div style={welcomeStyles().welcomeMsg} >
							{console.log(this.props.staffProfile)}
							<div style={welcomeStyles().goodAfternoon}> Good Afternoon, {this.props.staffProfile.name.split(' ', 1)} </div>
							<div style={welcomeStyles().update}>Here is whats happening with your properties today.</div>
						</div>
						<div style={welcomeStyles().salesStats} >
							<Statistic value='45' label="Today's Total Leads" size='tiny' />
							<Statistic value='4' label="Today's Signed Leases" size='tiny' />
						</div>
					</div>
				</div>
				<div style={comStyles().containerRight}>
					<div style={analyticStyles().top} >
						<div>
							<Statistic size='tiny'>
								<Statistic.Label>Total Sales</Statistic.Label>
								<Statistic.Value>$16,800</Statistic.Value>
							</Statistic>
						</div>
						<div>
					    <Statistic size='tiny'>
					      <Statistic.Label>July 12-18</Statistic.Label>
					      <Statistic.Value>10 Leases</Statistic.Value>
					    </Statistic>
					  </div>
					</div>
					<div style={analyticStyles().salesWeek}>
						<SalesWeek />
					</div>
				</div>
			</div>
		)
	}
}

Dashboard.propTypes = {
  children: PropTypes.object,
	setupWebsockets: PropTypes.func,
	initiatePouchDB: PropTypes.func,
	corporation: PropTypes.object,
	staffProfile: PropTypes.object.isRequired,
}

Dashboard.defaultProps = {
  children: {}
}

const RadiumHOC = Radium(Dashboard)

function mapStateToProps(state) {
	return {
		corporation: state.auth.corporation_profile,
		staffProfile: state.auth.staff_profile,
	}
}

export default connect(mapStateToProps, {
})(RadiumHOC)

// =============================

const comStyles = () => {
	return {
		app: {
			minWidth: '100%',
			maxWidth: '100%',
			minHeight: '100%',
			maxHeight: '100%',
			display: 'flex',
			flexDirection: 'row',
		},
		containerLeft: {
			flex: '2.5',
			borderRight: 'gray solid thin',
			display: 'flex',
			flexDirection: 'column',
			minHeight: '100%',
			maxHeight: '100%',
		},
		containerRight: {
			flex: '1.5',
			display: 'flex',
			flexDirection: 'column',
			minHeight: '100%',
			maxHeight: '100%',
		},
	}
}

const welcomeStyles = () => {
	return {
		welcomeContainer: {
			marginTop: '30px',
			marginRight: '50px',
			marginLeft: '30px',
			display: 'flex',
			flexDirection: 'column',
		},
		welcomeMsg: {
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'space-around',
			paddingBottom: '30px',
		},
		goodAfternoon: {
			fontSize: '30',
			fontWeight: 'bold',
		},
		update: {
			paddingTop: '10px',
			fontSize: '25',
			fontWeight: 'bold',
			width: '350px',
			color: 'gray',
		},
		salesStats: {
			display: 'flex',
			flexDirection: 'row',
		},
	}
}

const analyticStyles = () => {
	return {
		top: {
			width: '100%',
			height: '10vh',
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'space-between',
			margin: '20px 20px 20px 20px',
			paddingRight: '20px'
		},
		salesWeek: {
			width: '100%',
			height: '20vh',
		}
	}
}
