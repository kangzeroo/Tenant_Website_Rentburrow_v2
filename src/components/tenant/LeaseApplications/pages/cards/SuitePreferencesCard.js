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
  Card,
  Image,
} from 'semantic-ui-react'
import {
  getSuiteRankings,
} from '../../../../../api/leasing/tenant_form_api'
import SingularImageGallery from '../../../../image/SingularImageGallery'

class SuitePreferencesCard extends Component {

  constructor() {
    super()
    this.state = {
      suites: [],
    }
  }

  componentWillMount() {
    getSuiteRankings(this.props.group_id)
    .then((data) => {
      this.setState({
        suites: data
      })
    })
  }

	render() {
		return (
			<div style={comStyles().container}>
				<Card.Group>
          <Header
            as='h2'
            content='Suite Preferences'
            subheader='From top to lowest choice'
          />
          <div style={comStyles().group_members_container}>
          {
            this.state.suites.slice(0, 3).map((suite) => {
              return (
                <Card key={suite.tenant_id} style={comStyles().suiteCard}>
                  <div style={comStyles().suiteText} >
                    <Header
                      as='h2'
                      content={suite.suite_alias}
                    />
                  </div>
                  <div style={comStyles().suiteImages} >
                    <SingularImageGallery
                      list_of_images={[suite.cover_photo].concat(suite.imgs)}
                      image_size='hd'
                    />
                  </div>
                </Card>
              )
            })
          }
          </div>
        </Card.Group>
			</div>
		)
	}
}

// defines the types of variables in this.props
SuitePreferencesCard.propTypes = {
	history: PropTypes.object.isRequired,
  group_id: PropTypes.string.isRequired,       // passed in
}

// for all optional props, define a default value
SuitePreferencesCard.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(SuitePreferencesCard)

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
      justifyContent: 'center'
		},
    suiteCard: {
      display: 'flex',
      flexDirection: 'row',
      width: '95%',
    },
    suiteText: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      flex: '1',
    },
    suiteImages: {
      display: 'flex',
      flex: '2',
    }
	}
}
