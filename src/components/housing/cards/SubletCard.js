// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
  Card,
  Image,
  Button,
} from 'semantic-ui-react'
import {
  renderProcessedThumbnail,
  aliasToURL,
} from '../../../api/general/general_api'
import SingularImageGallery from '../../image/SingularImageGallery'
import { selectPinToRedux } from '../../../actions/search/search_actions'
import {
  shortenAddress,
} from '../../../api/general/general_api'


class SubletCard extends Component {

  selectThisPost() {
    window.open(`${window.location.origin}/sublet/${this.props.fb_post.post_id}`, '_blank')
  }

  goToOriginalPost() {
    window.open(`${this.props.fb_post.post_url}`)
  }

	render() {
		return (
      <Card onClick={() => this.selectThisPost()} style={comStyles().hardCard}>
        <div style={comStyles().imageGallery}>
          <SingularImageGallery
            list_of_images={JSON.parse(this.props.fb_post.images)}
          />
        </div>
        <Card.Content style={comStyles().info}>
          <Card.Header style={comStyles().headerPrint}>
            <div style={comStyles().address}>{ shortenAddress(this.props.fb_post.address) }</div>
          </Card.Header>
          <Card.Meta>
            {this.props.fb_post.fb_username}
          </Card.Meta>
          <Card.Description style={comStyles().more_info}>
            <div style={comStyles().price}>${ this.props.fb_post.price }/Month</div>
            <div style={comStyles().user_container} >
              <Image
                shape='circular'
                src={this.props.fb_post.fb_user_pic}
                size='tiny'
                bordered
                onClick={() => this.goToOriginalPost()}
              />
            </div>
            <div> Posted by {this.props.fb_post.fb_user_name} </div>
          </Card.Description>
        </Card.Content>
      </Card>
		)
	}
}

// defines the types of variables in this.props
SubletCard.propTypes = {
	history: PropTypes.object.isRequired,
  fb_post: PropTypes.object.isRequired,    // passed in
  selectPinToRedux: PropTypes.func.isRequired,
}

// for all optional props, define a default value
SubletCard.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(SubletCard)

// Get access to state from the Redux store
function mapStateToProps(state) {
	return {
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapStateToProps, {
    selectPinToRedux,
	})(RadiumHOC)
)

// ===============================

// the JS function that returns Radium JS styling
const comStyles = () => {
	return {
    hardCard: {
      minWidth: '360px',
      maxWidth: '360px',
      minHeight: '300px',
      maxHeight: '300px',
      margin: '5px auto',
    },
    info: {
      backgroundColor: 'rgba(0,0,0,0)',
      display: 'flex',
      flexDirection: 'column',
      // padding: '30px 10px 10px 10px',
    },
    imageGallery: {
      height: '200px',
    },
    address: {
      width: '60%',
      display: 'flex',
      flexWrap: 'wrap',
    },
    price: {
      width: '40%',
    },
    more_info: {
      display: 'flex',
      flexDirection: 'row',
    },
    user_container: {
      display: 'flex',
      flexDirection: 'row',
      right: '5px',
      top: '5px',
      position: 'absolute',
      maxHeight: '45px',
      maxWidth: '45px',
      cursor: 'pointer',
    },
	}
}
