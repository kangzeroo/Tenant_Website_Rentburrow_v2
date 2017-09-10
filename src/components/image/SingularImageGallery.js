// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import {
  Image,
  Icon,
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
      this.setState({
        current_image_position: this.state.all_images.length
      })
    } else if (this.state.current_image_position + itr >= this.state.all_images.length) {
    // if we are at the last image and trying to go into more
      this.setState({
        current_image_position: 0
      })
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
    return renderProcessedThumbnail(all_images[current_image_position])
  }

	render() {
		return (
			<div style={comStyles().container}>
        <Image
          src={this.getCurrentImage(this.state.current_image_position, this.state.all_images)}
          width='100%'
          height='100%'
          style={comStyles().image}
        />
        <div style={comStyles().imageContainer}>

        </div>
        <div onClick={(e) => this.cycleImage(e, -1)} style={comStyles().left}>
          <Icon name='chevron left' size='big' inverted />
        </div>
        <div onClick={(e) => this.cycleImage(e, 1)} style={comStyles().right}>
          <Icon name='chevron right' size='big' inverted />
        </div>
			</div>
		)
	}
}

// defines the types of variables in this.props
SingularImageGallery.propTypes = {
  list_of_images: PropTypes.array,
  // initial_image: PropTypes.string.isRequired,
}

// for all optional props, define a default value
SingularImageGallery.defaultProps = {
  list_of_images: [],
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
      minHeight: '100%',
    },
    imageContainer: {
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.05)',
      position: 'absolute'
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
    }
	}
}
