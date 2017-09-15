// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
  Image,
  Icon,
  Header,
} from 'semantic-ui-react'
import {
  shortenAddress,
  renderProcessedImage,
  renderProcessedThumbnail,
} from '../../api/general/general_api'

class ImageGallery extends Component {

  constructor() {
    super()
    this.state = {
      current_image_position: 0,
      all_images: [],
    }
  }

  componentWillMount() {
    this.setState({
      all_images: this.props.list_of_images,
    })
  }

  /*
  organizePhotos() {
    const all_photos = [this.props.initial_image].concat(this.props.list_of_images)
    return all_photos.map((imgUrl, index) => {
      return {
        position: index,
        url: imgUrl
      }
    })
  }*/

  cycleImage(event, itr) {
    if (event) {
      event.stopPropagation()
    }
    if (this.state.current_image_position + itr < 0) {
    // if we are at first image and trying to go into negatives
      // do nothing
    } else if (this.state.current_image_position + itr >= this.state.all_images.length) {
    // if we are at the last image and trying to go into more
      // do nothing
    } else {
    // if we can iterate we shall
      this.setState({
        current_image_position: this.state.current_image_position + itr
      })
    }
  }

  getCurrentImage(current_image_position, all_images) {
    /* return all_images.filter((imgObj) => {
      return imgObj.position === current_image_position
    })[0].image_url || this.state.all_photos[0].image_url */
    return renderProcessedImage(all_images[current_image_position].image_url)
  }

  getCurrentCaption(current_image_position, all_images) {
    return all_images[current_image_position].caption
  }

	render() {
		return (
			<div style={comStyles().container}>
        <Image
          src={this.getCurrentImage(this.state.current_image_position, this.state.all_images)}
          width='100%'
          height='auto'
          style={comStyles().image}
        />
        {
          this.state.current_image_position === 0
          ?
          null
          :
          <div onClick={(e) => this.cycleImage(e, -1)} style={comStyles().left}>
            <Icon name='angle left' size='huge' inverted />
          </div>
        }
        {
          this.state.current_image_position === this.state.all_images.length - 1
          ?
          null
          :
          <div onClick={(e) => this.cycleImage(e, 1)} style={comStyles().right}>
            <Icon name='angle right' size='huge' inverted />
          </div>
        }
        <div style={comStyles().caption} >
          <Header
            content={this.getCurrentCaption(this.state.current_image_position, this.state.all_images)}
            inverted
            size='medium'
            textAlign='center'
          />
        </div>
			</div>
		)
	}
}

// defines the types of variables in this.props
ImageGallery.propTypes = {
	history: PropTypes.object.isRequired,
  // initial_image: PropTypes.string.isRequired,
  list_of_images: PropTypes.array.isRequired,
}

// for all optional props, define a default value
ImageGallery.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(ImageGallery)

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
      overflow: 'hidden',
      position: 'relative',
      WebkitTapHighlightColor: 'rgba(0,0,0,0)'
		},
    image: {
      minWidth: '100%',
      maxWidth: '100%',
    },
    left: {
      width: '15%',
      height: '100%',
      left: '0px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
    },
    right: {
      width: '15%',
      height: '100%',
      right: '0px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
    },
    caption: {
      width: '100%',
      height: '50px',
      bottom: '0',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      backgroundColor: 'rgba(0,0,0,0.3)'
    }
	}
}
