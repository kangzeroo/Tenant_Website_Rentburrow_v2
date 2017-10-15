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

class PeopleWhoWantToSubletMine extends Component {

	constructor() {
		super()
		this.state = {
			applications: []
		}
	}

	componentWillMount() {
		getReceivedApplications(this.props.tenant_profile.student_id)
		.then((data) => {
			this.setState({
				applications: data.map(s => JSON.parse(s))
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
			<div style={comStyles().container}>
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
	tenant_profile: PropTypes.object,
}

// for all optional props, define a default value
PeopleWhoWantToSubletMine.defaultProps = {
	tenant_profile: {}
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

	})(RadiumHOC)
)

// ===============================

// the JS function that returns Radium JS styling
const comStyles = () => {
	return {
		container: {
      display: 'flex',
      flexDirection: 'column',
		},
    activeContainer: {
      display: 'flex',
    },
    no_applications_container: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '150px',
      maxHeight: '150px',
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
