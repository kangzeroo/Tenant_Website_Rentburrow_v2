// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import {
  Image,
  Icon,
  Transition,
} from 'semantic-ui-react'
import {
  shortenAddress,
  renderProcessedImage,
  renderProcessedThumbnail,
} from '../../api/general/general_api'

class SingularImageGallery extends Component {

  constructor() {
    super()
    this.state = {
      current_image_position: 0,
      all_images: [],
      visible: true,
    }
  }

  componentWillMount() {
    this.setState({
      all_images: this.props.list_of_images,
    })
  }

  componentWillUpdate(prevProps, prevState) {
    if (prevProps.list_of_images !== this.props.list_of_images) {
      this.setState({
        all_images: prevProps.list_of_images,
        current_image_position: 0,
      })
    }
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
    if (this.props.image_size === 'hd') {
      this.setState({
        visible: false,
      })
    }
    if (this.state.current_image_position + itr < 0) {
    // if we are at first image and trying to go into negatives
      this.setState({
        current_image_position: this.state.all_images.length - 1
      })
    } else if (this.state.current_image_position + itr > this.state.all_images.length -1) {
    // if we are at the last image and trying to go into more
      this.setState({
        current_image_position: 0,
      }, () => this.transitionImageFade())
    } else {
    // if we can iterate we shall
      this.setState({
        current_image_position: this.state.current_image_position + itr,
      }, () => this.transitionImageFade())
    }
  }

  transitionImageFade() {
    if (this.props.image_size === 'hd') {
      setTimeout(() => {
        this.setState({
          visible: true
        })
      }, 0)
    }
  }

  getCurrentImage(current_image_position, all_images) {
    /* return all_images.filter((imgObj) => {
      return imgObj.position === current_image_position
    })[0].image_url || this.state.all_photos[0].image_url */
    if (this.props.image_size === 'thumbnail') {
      return renderProcessedThumbnail(all_images[current_image_position])
    } else if (this.props.image_size === 'hd') {
      return renderProcessedImage(all_images[current_image_position])
    } else if (this.props.image_size === 'none') {
      return all_images[current_image_position]
    } else {
      return all_images[current_image_position]
    }
  }

	render() {
		return (
			<div id='SingularImageGallery' style={comStyles().container}>
        <div style={comStyles().imageContainer}>
          {/*<Transition visible={this.state.visible} animation='scale' duration='300'>*/}
            <Image
              src={this.getCurrentImage(this.state.current_image_position, this.state.all_images)}
              width='100%'
              height='auto'
              style={comStyles().image}
            />
          {/*</Transition>*/}
          <Image
            src={this.getCurrentImage(this.state.current_image_position+1, this.state.all_images)}
            width='100%'
            height='auto'
            style={comStyles().nextHiddenImage}
          />
          {
            this.props.image_size === 'hd'
            ?
            <div style={comStyles().indicator}>
              {`${this.state.current_image_position+1}/${this.state.all_images.length}`}
            </div>
            :
            null
          }
        </div>
          {
            this.state.all_images.length > 1
            ?
            <div onClick={(e) => this.cycleImage(e, -1)} style={comStyles().left}>
              <Icon name='angle left' size='huge' inverted />
            </div>
            :
            null
          }
          {
            this.state.all_images.length > 1
            ?
            <div onClick={(e) => this.cycleImage(e, 1)} style={comStyles().right}>
              <Icon name='angle right' size='huge' inverted />
            </div>
            :
            null
          }
        </div>

		)
	}
}

// defines the types of variables in this.props
SingularImageGallery.propTypes = {
  list_of_images: PropTypes.array,
  image_size: PropTypes.string,       // passed in
}

// for all optional props, define a default value
SingularImageGallery.defaultProps = {
  list_of_images: [],
  image_size: 'thumbnail',            // 'thumbnail', 'hd', 'none'
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(SingularImageGallery)

// Connect together the Redux store with this React component
export default RadiumHOC

// ===============================

// the JS function that returns Radium JS styling
const comStyles = () => {
	return {
		container: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      // minHeight: '500px',
      // maxHeight: '500px',
      minHeight: '100%',
      maxHeight: '100%',
      overflow: 'hidden',
      position: 'relative',
      WebkitTapHighlightColor: 'rgba(0,0,0,0)'
		},
    image: {
      height: 'auto',
      zIndex: 5,
    },
    imageContainer: {
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.3)',
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
      backgroundColor: 'rgba(0,0,0,0)',
      cursor: 'pointer',
      zIndex: 6,
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
      backgroundColor: 'rgba(0,0,0,0)',
      cursor: 'pointer',
      zIndex: 6,
    },
    indicator: {
      left: '20px',
      bottom: '20px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: 'white',
      zIndex: 10,
    },
    nextHiddenImage: {
      display: 'none',
    }
	}
}
