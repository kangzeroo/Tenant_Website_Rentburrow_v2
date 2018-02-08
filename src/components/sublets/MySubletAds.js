// Compt for copying as a MySubletAds
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import moment from 'moment'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
  Header,
  Icon,
  Button,
} from 'semantic-ui-react'
import SubletCard from '../housing/cards/SubletCard'
import { grabMySubletsFromDynamoDB, bumpMySublet, convertToDynamoDBSubletObj } from '../../api/search/sublet_api'
import { authenticateTenant } from '../../api/general/general_api'


class MySubletAds extends Component {

  constructor() {
    super()
    this.state = {
      my_ads: []
    }
  }

  componentWillMount() {
    if (authenticateTenant(this.props.tenant_profile)) {
      this.refreshMySublets()
    } else {
      this.props.history.push('/')
    }
  }

  refreshMySublets() {
    grabMySubletsFromDynamoDB(this.props.tenant_profile.fb_user_id).then((data) => {
      // console.log(data)
      this.setState({
        my_ads: data
      })
    }).catch((err) => {
      // console.log(err)
    })
  }

  bumpSublet(sublet) {
    bumpMySublet(convertToDynamoDBSubletObj(sublet)).then((data) => {
      // console.log(data)
      this.refreshMySublets()
    }).catch((err) => {
      // console.log(err)
    })
  }

  bumpableAd(posted_date) {
    return (posted_date + (1000 * 60 * 60 * 24)) < moment().valueOf()
  }

	render() {
		return (
			<div id='MySubletAds' style={comStyles().container}>
        <br />
        <Header as='h2' icon style={{ width: '100%' }}>
          <Icon name='home' />
          My 4 Month Sublet Ads
          <Header.Subheader>
            Click bump to bring your ad back to the top! Max once a day per sublet.<br/>
            Ads older than 30 days will automatically disappear.
          </Header.Subheader>
        </Header>
        <br />
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <Button primary onClick={() => this.props.history.push('/postsublet')}>
            {
              this.state.my_ads.length === 0
              ?
              'No Sublet Ads - Click here to post one'
              :
              'Post Another Sublet'
            }
          </Button>
        </div>
        <br />
        <div className='pretty_scrollbar' style={comStyles().my_ads}>
          {
            this.state.my_ads.map((sublet) => {
              return (
                <div key={sublet.post_id} style={comStyles().ad}>
                  <SubletCard key={`${sublet.post_id}_subletcard`} sublet={sublet} />
                  <Button primary disabled={!this.bumpableAd(sublet.posted_date)} onClick={() => this.bumpSublet(sublet)} style={{ width: '100%' }}>
                    {
                      !this.bumpableAd(sublet.posted_date)
                      ?
                      `Bumpable in ${moment.duration((sublet.posted_date + (1000 * 60 * 60 * 24)) - moment().valueOf()).asHours().toFixed()} hours`
                      :
                      'BUMP AD'
                    }
                  </Button>
                </div>
              )
            })
          }
        </div>
			</div>
		)
	}
}

// defines the types of variables in this.props
MySubletAds.propTypes = {
	history: PropTypes.object.isRequired,
  tenant_profile: PropTypes.object.isRequired,
}

// for all optional props, define a default value
MySubletAds.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(MySubletAds)

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
			width: '100%',
			height: 'auto',
      minHeight: '93vh',
		},
    my_ads: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      height: 'auto',
    },
    ad: {
      display: 'flex',
      flexDirection: 'column',
      width: '310px',
      margin: '10px auto',
    }
	}
}
