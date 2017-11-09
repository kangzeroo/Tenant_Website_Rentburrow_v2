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
  Label,
  Button,
  Statistic,
  Icon,
} from 'semantic-ui-react'
import {
  renderProcessedThumbnail,
  aliasToURL,
  shortenAddress,
} from '../../../api/general/general_api'
import SingularImageGallery from '../../image/SingularImageGallery'
import { selectPinToRedux } from '../../../actions/search/search_actions'
import { getAllImagesSizeForSpecificBuilding, getNumVirtualTours, getAllSummaryImages, } from '../../../api/search/search_api'
import RibbonLabel from '../../instructions/RibbonLabel'

class BuildingPreview extends Component {

  constructor() {
    super()
    this.state = {
      image_count: 0,
      vr_tour_count: 0,

      summary_images: [],
    }
  }

  componentWillMount() {
    getAllSummaryImages(this.props.building.building_id)
    .then((data) => {
      this.setState({
        summary_images: data,
      })
    })

    getAllImagesSizeForSpecificBuilding(this.props.building.building_id)
    .then((data) => {
      this.setState({
        image_count: data.image_count,
      })
    })

    getNumVirtualTours(this.props.building.building_id)
    .then((data) => {
      this.setState({
        vr_tour_count: parseInt(data.vr_tour_count, 10),
      })
    })
  }

  selectThisBuilding(building) {
    // console.log(`${window.location.origin}/${aliasToURL(building.building_alias)}`)
    if (building.label && building.label.toLowerCase().indexOf('sold out') > -1) {
      // do nothing
    } else {
      window.open(`${window.location.origin}/${aliasToURL(building.building_alias)}`, '_blank')
    }
  }

	render() {
		return (
      <div style={comStyles(this.props.building.label).container} >
        <Card
          onClick={() => this.selectThisBuilding(this.props.building)}
          onMouseEnter={() => this.props.selectPinToRedux(this.props.building.building_id)}
          fluid
          style={comStyles().hardCard}
        >
          <div style={comStyles().imageGallery}>
            {
              this.state.summary_images.length === 0
              ?
              <SingularImageGallery
                list_of_images={[this.props.building.thumbnail].concat(this.props.building.imgs)}
                image_size='hd'
              />
              :
              <SingularImageGallery
                list_of_images={this.state.summary_images.map(s => s.image_url)}
                image_size='hd'
              />
            }
          </div>
         <Card.Content style={comStyles().info} >
          <div style={comStyles().details}>
            <Card.Header style={comStyles().headerPrint}>
              <div style={comStyles().address}>{ this.props.building.building_alias ? this.props.building.building_alias : shortenAddress(this.props.building.building_address) }</div>
            </Card.Header>
            <Card.Meta>
              {this.props.building.building_address}
            </Card.Meta>
            <Card.Description style={comStyles().more_info}>
              <div style={comStyles().price}>Rooms From ${ this.props.building.min_price }</div>
            </Card.Description>
          </div>
          {
            this.props.building.label
            ?
            <div style={comStyles().ribbon}>
              <RibbonLabel label={this.props.building.label} />
            </div>
            :
            null
          }
        </Card.Content>
        {
          this.props.building.label && this.props.building.label.toLowerCase().indexOf('sold out') > -1
          ?
          <Card.Content style={comStyles().explore_button}>
            <Button fluid color='red' content='SOLD OUT' size='large' />
          </Card.Content>
          :
          <Card.Content style={comStyles().explore_button}>
            <Button fluid color='blue' content='Explore' size='large' />
          </Card.Content>
        }
      </Card>
        <div style={comStyles().analyticsContainer} >
          <Statistic>
            <Statistic.Value>
              <Icon name='image' color='blue' />
              &nbsp;
              {this.state.image_count}
            </Statistic.Value>
            <Statistic.Label>
              Property Images
            </Statistic.Label>
          </Statistic>
          <Statistic>
            <Statistic.Value>
              <Icon name='simplybuilt' color='blue' />
              &nbsp;
              {this.state.vr_tour_count}
            </Statistic.Value>
            <Statistic.Label>
              Virtual Tours
            </Statistic.Label>
          </Statistic>
        </div>
      </div>
		)
	}
}

// defines the types of variables in this.props
BuildingPreview.propTypes = {
	history: PropTypes.object.isRequired,
  building: PropTypes.object.isRequired,    // passed in
  selectPinToRedux: PropTypes.func.isRequired,
}

// for all optional props, define a default value
BuildingPreview.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(BuildingPreview)

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
const comStyles = (label) => {
  let opacityStyles = {}
  if (label && label.toLowerCase().indexOf('sold out') > -1) {
    opacityStyles.opacity = 0.5
  }
	return {
    container: {
      ...opacityStyles,
    },
    analyticsContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-around',
      margin: '30px'
    },
    info: {
      backgroundColor: 'rgba(0,0,0,0)',
      display: 'flex',
      flexDirection: 'row',
      // padding: '30px 10px 10px 10px',
    },
    explore_button: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
    },
    details: {
      color: 'black',
      display: 'flex',
      flexDirection: 'column',
      width: '90%',
    },
    ribbon: {
      width: '10%',
    },
    imageGallery: {
      background: "transparent url('https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif') center no-repeat",
    }
	}
}
