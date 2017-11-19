// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
  Icon,
  Image,
  Card,
} from 'semantic-ui-react'
import {
  xGreyText,
  xBootstrapRed,
} from '../../../styles/base_colors'
import SubletDetailed from '../../sublets/SubletDetailed'
import SubletCard from '../../housing/cards/SubletCard'


class SubleteeSubletorRelationship extends Component {

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
			<div id='SubleteeSubletorRelationship' style={comStyles().container}>
        {/*<SubletDetailed
          onlyForShow
          iAmTheSubletee={this.props.iAmTheSubletee}
          sublet={this.props.sublet_post}
        />*/}
        <div style={comStyles().subletor}>
          <SubletCard
    				key={this.props.sublet_post.post_id}
    				sublet={this.props.sublet_post}
          />
        </div>
        <div style={comStyles().subletting_to}>
          <Icon name='arrow right' size='huge' />
          <div style={comStyles().subletting_to_text}>Subletting to</div>
        </div>
        <div style={comStyles().subletee}>
          <Card raised style={comStyles().subletee_card}>
    				<div id='infobar' style={comStyles().infobar}>
    					{/* Profile Picture */}
              <Image
                shape='circular'
                src={this.props.subletee.fb_user_pic}
                size='tiny'
                bordered
                onClick={(e) => this.goToFacebookUser(e, this.props.subletee.fb_user_id)}
              />

    					<div id='infobadge' style={comStyles().infobadge}>
    						{/* User Name */}
    						<div style={comStyles().userinfo}>
    							<a href={`http://www.facebook.com/${this.props.subletee.fb_user_id}`} target='_blank'>{this.props.subletee.fb_user_name}</a>
    						</div>
    					</div>
    				</div>

            {
              this.props.iAmTheSubletee
              ?
              <div style={comStyles().pricediv}>
                <div style={comStyles().price}>You</div>
              </div>
              :
              <div style={comStyles().pricediv}>
                <div style={comStyles().price}>Student Card Verified</div>
              </div>
            }

    			</Card>
        </div>
			</div>
		)
	}
}

// defines the types of variables in this.props
SubleteeSubletorRelationship.propTypes = {
	history: PropTypes.object.isRequired,
  sublet_post: PropTypes.object.isRequired,   // passed in
  subletee: PropTypes.object.isRequired,      // passed in
  iAmTheSubletee: PropTypes.bool,             // passed in
}

// for all optional props, define a default value
SubleteeSubletorRelationship.defaultProps = {
  iAmTheSubletee: false,
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(SubleteeSubletorRelationship)

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
      flexDirection: 'row',
      margin: '50px auto',
      justifyContent: 'space-between',
		},
    subletting_to_text: {
      fontSize: '2rem',
      fontWeight: 'bold',
      padding: '20px',
    },
    subletor: {
      width: '40%',
    },
    subletting_to: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: '20%',
    },
    subletee: {
      width: '40%',
    },
    subletee_card: {
      minWidth: '360px',
      maxWidth: '360px',
      minHeight: '250px',
      maxHeight: '250px',
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
			fontSize: '1.5rem',
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
			fontSize: '2rem',
			fontWeight: 'bold',
			color: xGreyText,
			width: '100%',
      lineHeight: '30px',
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
