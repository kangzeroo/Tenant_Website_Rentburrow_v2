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
  TextArea,
  Modal,
  Icon,
} from 'semantic-ui-react'
import {
  renderProcessedThumbnail,
  aliasToURL,
  shortenAddress,
} from '../../api/general/general_api'
import LoginPopup from '../auth/LoginPopup'
import SingularImageGallery from '../image/SingularImageGallery'
import SubleteeIntroModal from '../instructions/SubleteeIntroModal'
import { selectPinToRedux } from '../../actions/search/search_actions'
import { xGreyText, xBootstrapRed, xMidBlue } from '../../styles/base_colors'
import { sortAmenitiesSublet } from '../../api/amenities/sublet_amenities'


class SubletDetailed extends Component {

  constructor() {
    super()
    this.state = {
      toggle_modal: false,
      modal_name: '',
      context: null,
    }
  }

  toggleModal(bool, attr, context) {
    this.setState({
      toggle_modal: bool,
      modal_name: attr,
      context: context
    })
  }

  renderAppropriateModal(modal_name, context) {
    if (modal_name === 'login') {
      return (
        <Modal dimmer='blurring' open={this.state.toggle_modal} onClose={() => this.toggleModal(false)}>
          <Modal.Content>
            <LoginPopup
              toggleModal={() => this.toggleModal()}
            />
          </Modal.Content>
        </Modal>
      )
    } else if (modal_name === 'primer') {
      return (
        <Modal dimmer='blurring' open={this.state.toggle_modal} onClose={() => this.toggleModal(false)}>
          <Modal.Content>
            <SubleteeIntroModal
              toggleModal={(a, b, c) => this.toggleModal(a, b, c)}
            />
          </Modal.Content>
        </Modal>
      )
    }
    return null
  }

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

  goToOnlineSubletSigning(e, post) {
    if (e) {
      e.stopPropagation()
    }
    window.open(`${window.location.origin}/signing/sublet/${post.post_id}/initiate/apply/${post.fb_user_id}`, '_blank')
  }

	render() {
		return (
      <Card id='SubletDetailed' key={this.props.sublet.post_id} raised style={this.props.onlyForShow ? comStyles().softCard : comStyles().hardCard}>

        <div style={comStyles().left}>
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
  							<a href={`http://www.facebook.com/${this.props.sublet.fb_user_id}`} target='_blank'>{this.props.sublet.fb_user_name.split(' ')[0]}</a> &nbsp;
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
        </div>

        {
          this.props.onlyForShow
          ?
          null
          :
          <div style={comStyles().center}>
            <TextArea style={comStyles().desc}>
              { this.props.sublet.description }
            </TextArea>
            {/*<div style={comStyles().imageGallery}>
              <SingularImageGallery
                list_of_images={JSON.parse(this.props.sublet.images).length > 0 ? JSON.parse(this.props.sublet.images) : ['https://s3.amazonaws.com/rentburrow-static-assets/Loading+Icons/no-image-available.jpg']}
              />
            </div>*/}
          </div>
        }

        <div style={this.props.onlyForShow ? comStyles().rest : comStyles().rest}>

          {
            this.props.iAmTheSubletee
            ?
            <div style={comStyles().buttons}>
      				<Button basic primary content='See Original Post' onClick={(e) => this.goToOriginalPost(e, this.props.sublet.post_id)} style={comStyles().originalButton} />
              <br />
              {
                this.props.onlyForShow
                ?
                <Button basic primary content='Message Student' onClick={(e) => this.goToFacebookUser(e, this.props.sublet.fb_user_id)} style={comStyles().originalButton} />
                :
        				null
              }
            </div>
            :
            <div style={comStyles().buttons}>
              <Button basic primary content='See Original Post' onClick={(e) => this.goToOriginalPost(e, this.props.sublet.post_id)} style={comStyles().originalButton} />
              {/*
                this.props.onlyForShow
                ?
                null
                :
                <div>
                  {
                    this.props.authenticated
                    ?
                    <div>
                      <Button primary fluid content='Apply Online' onClick={(e) => this.goToOnlineSubletSigning(e, this.props.sublet)} style={comStyles().originalButton} />
                      <Icon name='arrow up' size='large' style={comStyles().arrow_up} />
                      <div onClick={() => this.toggleModal(true, 'primer')} style={comStyles().what_is_this}>What is this?</div>
                    </div>
                    :
                    <div>
                      <Button primary fluid content='Apply Online' onClick={(e) => this.toggleModal(true, 'login')} style={comStyles().originalButton} />
                      <Icon name='arrow up' size='large' style={comStyles().arrow_up} />
                      <div onClick={() => this.toggleModal(true, 'primer')} style={comStyles().what_is_this}>What is this?</div>
                    </div>
                  }
                </div>
            */}
            </div>
          }
        </div>
        {
          this.renderAppropriateModal(this.state.modal_name, this.state.context)
        }
			</Card>
		)
	}
}

// Button Possibilities = ['Sign Online (Free)', 'Apply', 'Do the paperwork online']


// defines the types of variables in this.props
SubletDetailed.propTypes = {
	history: PropTypes.object.isRequired,
  sublet: PropTypes.object.isRequired,    // passed in
  selectPinToRedux: PropTypes.func.isRequired,
  tenant_profile: PropTypes.object.isRequired,
  onlyForShow: PropTypes.bool,            // passed in
  iAmTheSubletee: PropTypes.bool,         // passed in
  authenticated: PropTypes.bool,
}

// for all optional props, define a default value
SubletDetailed.defaultProps = {
  onlyForShow: false,
  iAmTheSubletee: false,
  authenticated: false,
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(SubletDetailed)

// Get access to state from the Redux store
function mapStateToProps(state) {
	return {
    tenant_profile: state.auth.tenant_profile,
    authenticated: state.auth.authenticated,
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
      minWidth: '600px',
      width: '100%',
      minHeight: '250px',
      maxHeight: '250px',
      margin: '10px auto',
      display: 'flex',
      flexDirection: 'row',
    },
    softCard: {
      width: '750px',
      minHeight: '250px',
      maxHeight: '250px',
      margin: '10px auto',
      display: 'flex',
      flexDirection: 'row',
    },
    info: {
      backgroundColor: 'rgba(0,0,0,0)',
      display: 'flex',
      flexDirection: 'column',
      // padding: '30px 10px 10px 10px',
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
			margin: '5px 0px 0px 0px'
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
    desc: {
      height: '100%',
      width: '100%',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0px 0px 10px 0px',
      padding: '10px',
      border: '0px solid black',
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
    },
    left: {
      width: '30%',
      height: '100%',
      minWidth: '360px',
    },
    center: {
      width: '70%',
      minWidth: '360px',
      minHeight: '100%',
    },
    imageGallery: {
      height: '100%',
      minHeight: '250px',
      maxHeight: '250px',
    },
    right: {
      width: '40%',
      color: xGreyText,
      minHeight: '100%',
      maxHeight: '100%',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      justifyContent: 'center',
      padding: '20px',
      minWidth: '360px',
    },
    rest: {
      width: '30%',
      color: xGreyText,
      minHeight: '100%',
      maxHeight: '100%',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      justifyContent: 'center',
      padding: '20px',
      minWidth: '360px',
    },
    buttons: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    you: {
      margin: '0px 0px 0px 30px',
      fontSize: '1.5rem',
      fontWeight: 'bold',
    },
    arrow_up: {
      margin: '10px auto',
    },
    what_is_this: {
      fontSize: 'fontSize',
      fontWeight: 'bold',
      color: xMidBlue,
      cursor: 'pointer',
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
