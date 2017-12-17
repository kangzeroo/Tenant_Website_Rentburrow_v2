// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import moment from 'moment'
import {
  Card,
  Image,
  Button,
} from 'semantic-ui-react'
import {
  renderProcessedThumbnail,
  aliasToURL,
  shortenAddress,
} from '../../../api/general/general_api'
import SingularImageGallery from '../../image/SingularImageGallery'
import { selectPinToRedux } from '../../../actions/search/search_actions'
import { xGreyText, xBootstrapRed } from '../../../styles/base_colors'
import { sortAmenitiesSublet } from '../../../api/amenities/sublet_amenities'


class SubletCard extends Component {

  selectThisPost(sublet) {
    window.open(`${window.location.origin}/sublet/${sublet.place_id}`, '_blank')
  }

  goToOriginalPost(e, post_id) {
    if (e) {
      e.stopPropagation()
    }
    window.open(`https://www.facebook.com/${post_id}`, '_blank')
  }

  goToFacebookUser(e, fb_user_id) {
    if (e) {
      e.stopPropagation()
    }
    window.open(`https://www.facebook.com/${fb_user_id}`, '_blank')
  }

	render() {
		return (
      <Card id='SubletCard' key={this.props.sublet.post_id} onClick={() => this.selectThisPost(this.props.sublet)} onMouseEnter={() => this.props.selectPinToRedux(this.props.sublet.post_id)} raised style={comStyles().hardCard}>

				<div id='infobar' style={comStyles().infobar}>
					{/* Profile Picture */}
          <Image
            shape='circular'
            src={this.props.sublet.fb_user_pic}
            size='tiny'
            bordered
            onClick={(e) => this.goToFacebookUser(e, this.props.sublet.fb_user_id)}
          />

					<div id='infobadge' style={comStyles().infobadge}>
						{/* Address */}
						<div onClick={(e) => this.goToOriginalPost(e, this.props.sublet.post_id)} style={comStyles().address}>
							{shortenAddress(this.props.sublet.address)}
						</div>
						{/* User Name */}
						<div style={comStyles().userinfo}>
							<div onClick={(e) => this.goToFacebookUser(e, this.props.sublet.fb_user_id)}>{this.props.sublet.fb_user_name.split(' ')[0]}</div> &nbsp;
							on &nbsp;
							<b>{moment(this.props.sublet.posted_date).format('MMM Do')}</b>
						</div>
					</div>
				</div>

				{/* Price */}
				<div style={comStyles().pricediv}>
					<div style={comStyles().price}>{this.props.sublet.price ? `$${this.props.sublet.price}` : <h3>Inquire Price</h3>}</div>
				</div>

				{/* Icons */}
				<div id='iconbar' style={comStyles().iconbar}>
					{
            sortAmenitiesSublet(this.props.sublet).map((amenity, index) => {
              return (
                <div key={`${this.props.sublet}_${index}`} style={comStyles().amenity_icon}>
                  <img
                    className='icon icons8-Temperature'
                    width='20'
                    height='20'
                    src={amenity.icon}
                  />
                  <div style={comStyles().amenity_caption}>{amenity.text}</div>
                </div>
              )
            })
          }
				</div>

				{/* Buttons Bar */}
				<div id='buttonsBar' style={comStyles().buttonsBar}>

				</div>

			</Card>
		)
	}
}

// defines the types of variables in this.props
SubletCard.propTypes = {
	history: PropTypes.object.isRequired,
  sublet: PropTypes.object.isRequired,    // passed in
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
      minWidth: '310px',
      maxWidth: 'auto',
      minHeight: '220px',
      maxHeight: '220px',
      margin: '10px auto',
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
		infobar: {
			width: '100%',
			display: '-webkit-box', display: '-webkit-flex', display: 'flexbox', display: 'box', display: 'flex',
			justifyContent: 'flex-start',
			alignItems: 'flex-start',
			WebkitBoxOrient: 'horizontal', WebkitBoxDirection: 'normal', flexDirection: 'row',
			padding: '10px',
      backgroundColor: 'rgba(0,0,0,0.05)',
      maxHeight: '70px',
		},
		infobadge: {
			display: '-webkit-box', display: '-webkit-flex', display: 'flexbox', display: 'box', display: 'flex',
			WebkitBoxOrient: 'vertical', WebkitBoxDirection: 'normal', flexDirection: 'column',
			margin: '1% 1% 1% 5%',
			width: '70%',
		},
		address: {
			fontSize:'1.6rem',
			fontWeight:'bold',
			width: '100%',
			height:'60%',
			color: xGreyText,
		},
		userinfo: {
			width: '100%',
			height: '35%',
			color: xGreyText,
			fontSize: '1.1rem',
			margin: '5px 0px 0px 0px',
      display: 'flex',
      flexDirection: 'row',
		},
		pricediv: {
			textAlign:'center',
			padding: '50px',
			display: '-webkit-box', display: '-webkit-flex', display: 'flexbox', display: 'box', display: 'flex',
			WebkitBoxOrient: 'horizontal', WebkitBoxDirection: 'normal', flexDirection: 'row',
			WebkitBoxPack: 'justify', WebkitJustifyContent: 'center', justifyContent: 'center',
			position: 'relative',
		},
		price: {
			fontSize:'2.5rem',
			fontWeight:'bold',
			color: xGreyText,
			width: '100%',
		},
		imageTile: {
			position: 'absolute',
			right: '0px',
			margin: '0 auto',
		},
		imageTileIcon: {
			fontSize: '1.7rem',
			margin: '0 auto',
			cursor: 'pointer',
			':hover': {
				color: xBootstrapRed
			}
		},
		iconbar: {
			width: '100%',
			display: '-webkit-box', display: '-webkit-flex', display: 'flexbox', display: 'box', display: 'flex',
			WebkitBoxPack: 'justify', WebkitJustifyContent: 'center', justifyContent: 'center',
			fontSize: '1rem',
			color: xGreyText,
			flexWrap: 'wrap'
		},
		buttonsBar: {
			display: '-webkit-box', display: '-webkit-flex', display: 'flexbox', display: 'box', display: 'flex',
			WebkitBoxPack: 'justify', WebkitJustifyContent: 'center', justifyContent: 'center',
			width: '100%',
			margin: 'auto',
			fontSize: '1.1rem',
			fontWeight: 'bold'
		},
		seeOriginalAhref: {
			flexGrow: 3
		},
		seeOriginal: {
			borderRadius: '0px',
			width: '100%'
		},
		map: {
			borderRadius: '0px',
			flexGrow: 1
		},
		heartIcon: {
			fontSize: '2rem',
			fontWeight: 'bold',
			right: '0px',
			width: '10%',
			color: xBootstrapRed,
			cursor: 'pointer'
		},
		thumbnailBar: {
			display: '-webkit-box', display: '-webkit-flex', display: 'flexbox', display: 'box', display: 'flex',
			WebkitBoxOrient: 'horizontal', WebkitBoxDirection: 'normal', flexDirection: 'row',
			WebkitBoxPack: 'justify', WebkitJustifyContent: 'center', justifyContent: 'center',
			maxHeight: '30px',
			margin: '10px 0px 0px 0px',
			overflowX: 'scroll'
		},
		thumbnail: {
			height: '30px',
			width: 'auto',
			opacity: '0.3',
			':hover': {
				opacity: '1'
			},
		},
		blankPlaceholderImage: {
			height: '30px',
			width: '100%'
		},
    amenity_icon: {
      display: 'flex',
      flexDirection: 'column',
      margin: '10px',
      justifyContent: 'center',
      alignItems: 'center',
    },
    amenity_caption: {
      margin: '5px auto',
    }
	}
}

const profileStyle = (src) => {
	return {
		profilePic: {
			height: '70px',
			width: '70px',
		    borderRadius:'50%',
		    backgroundImage: 'url('+src+')',
		    backgroundPosition: 'center',
		    backgroundSize:'100% auto',
		    backgroundRepeat: 'no-repeat',
			display: 'inline-block',
		}
	}
}


{/*
  <Card onClick={() => this.selectThisPost()} style={comStyles().hardCard}>
    <div style={comStyles().imageGallery}>
      <SingularImageGallery
        list_of_images={JSON.parse(this.props.sublet.images)}
      />
    </div>
    <Card.Content style={comStyles().info}>
      <Card.Header style={comStyles().headerPrint}>
        <div style={comStyles().address}>{ shortenAddress(this.props.sublet.address) }</div>
      </Card.Header>
      <Card.Meta>
        {this.props.sublet.fb_username}
      </Card.Meta>
      <Card.Description style={comStyles().more_info}>
        <div style={comStyles().price}>${ this.props.sublet.price }/Month</div>
        <div style={comStyles().user_container} >
          <Image
            shape='circular'
            src={this.props.sublet.fb_user_pic}
            size='tiny'
            bordered
            onClick={(e) => this.goToOriginalPost(e)}
          />
        </div>
        <div> Posted by {this.props.sublet.fb_user_name} </div>
      </Card.Description>
    </Card.Content>
  </Card>
*/}
