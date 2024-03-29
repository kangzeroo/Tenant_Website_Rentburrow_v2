// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
	Header,
	Button,
	Icon,
} from 'semantic-ui-react'
import ReceivedApplicationCard from '../cards/ReceivedApplicationCard'
import { getReceivedApplications, } from '../../../../api/application/application_api'
import { saveReceivedApplicationsToRedux, } from '../../../../actions/contract/contract_actions'
import { updateDocumentStatus, } from '../../../../api/pandadoc/pandadoc_api'

class PeopleWhoWantToSubletMine extends Component {

	constructor() {
		super()
		this.state = {
			applications: []
		}
	}

	componentWillMount() {
		updateDocumentStatus(this.props.tenant_profile.tenant_id)
		getReceivedApplications(this.props.tenant_profile.tenant_id)
		.then((data) => {
			// const existsAlready = (app, unique_apps) => {
      //   let exists = false
      //   unique_apps.forEach((uqa) => {
      //     if (uqa.subletee_fb_id === app.subletee_fb_id) {
      //       exists = true
      //     }
      //   })
      //   return exists
      // }
			// console.log(data)
      const applications = data
      // const unique_apps = []
      // applications.forEach((app) => {
      //   let unique = true
      //   if (existsAlready(app, unique_apps)) {
      //     unique = false
      //   }
      //   if (unique) {
      //     unique_apps.push(app)
      //   }
      // })
			this.props.saveReceivedApplicationsToRedux(applications)
			this.setState({
				applications,
			})
		})
	}

	goToFBGroup(e) {
		if (e) {
			e.stopPropagation()
		}
		window.open(`https://www.facebook.com//groups/WaterlooSublet/`, '_blank')
	}

	render() {
		return (
			<div id='PeopleWhoWantToSubletMine' style={comStyles().container}>
        <Header as='h3'>
          <Icon name='archive' />
          Received Applications
        </Header>
        {
          this.state.applications.length === 0
          ?
          <div style={comStyles().no_applications_container} >
            <Header
              as='h2'
              content='You currently have no received applications :('
              subheader='To upload a sublet, post it on Facebook and it will automatically appear on Rentburrow'
            />
            <div style={comStyles().button_text}>
              <Button
                content='Post a sublet on Facebook'
                primary
              	onClick={() => this.goToFBGroup()}
              />
            </div>
          </div>
          :
          <div style={comStyles().activeContainer} >
          {
            this.state.applications.map((card) => {
              return (
                <ReceivedApplicationCard
                  key={card.subletor_id}
                  details={card}
                />
              )
            })
          }
          </div>
        }
      </div>
		)
	}
}

// defines the types of variables in this.props
PeopleWhoWantToSubletMine.propTypes = {
	history: PropTypes.object.isRequired,
	tenant_profile: PropTypes.object.isRequired,
	saveReceivedApplicationsToRedux: PropTypes.func.isRequired,
}

// for all optional props, define a default value
PeopleWhoWantToSubletMine.defaultProps = {
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(PeopleWhoWantToSubletMine)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
		tenant_profile: redux.auth.tenant_profile,
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
		saveReceivedApplicationsToRedux,
	})(RadiumHOC)
)

// ===============================

// the JS function that returns Radium JS styling
const comStyles = () => {
	return {
		container: {
      display: 'flex',
      flexDirection: 'column',
			minHeight: '60vh',
      maxHeight: '60vh'
		},
    activeContainer: {
      display: 'flex',
			flexDirection: 'row',
			justifyContent: 'space-around',
			flexWrap: 'wrap',
    },
    no_applications_container: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    button_text: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      minWidth: '400px',
      maxWidth: '400px',
    }
	}
}
