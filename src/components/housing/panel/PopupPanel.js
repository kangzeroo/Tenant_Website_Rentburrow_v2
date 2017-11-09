// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
  Button,
} from 'semantic-ui-react'
import { selectPopupBuilding } from '../../../actions/selection/selection_actions'
import BuildingCard from '../cards/BuildingCard'
import BuildingPreview from '../cards/BuildingPreview'
import BuildingRow from '../cards/BuildingRow'
import SubletCard from '../cards/SubletCard'

class PopupPanel extends Component {

  generateBuildingCard(building) {
		if (this.props.card_style === 'row') {
			return (
				null
			)
		} else if (this.props.card_style === 'grid') {
			return (
				<BuildingCard
					key={building.building_id}
					building={building}
					style={comStyles().gridItem}
				/>
			)
		} else if (this.props.card_style === 'cover') {
			return (
				<BuildingRow
					key={building.building_id}
					building={building}
					style={comStyles().rowItem}
				/>
			)
		} else {
			return null
		}
	}

  generateBuildingPreview(building) {
    return (
      <BuildingPreview
        key={building.building_id}
        building={building}
      />
    )
  }

  generateSubletCard(sublet) {
    return (
      <SubletCard
				key={sublet.post_id}
				sublet={sublet}
			/>
    )
  }

	render() {
		return (
			<div style={comStyles().container}>
        <Button
          primary
          basic
          icon='caret left'
          content='Back'
          onClick={() => this.props.selectPopupBuilding(null)}
          style={comStyles().back_button}
        />
        {
          this.props.rent_type === 'sublet'
          ?
          <div style={comStyles().scroll} >
            {
              this.props.buildings.map((building) => {
                return this.generateSubletCard(building)
              })
            }
          </div>
          :
          <div style={comStyles().BuildingPreview} >
            {
              this.props.buildings.map((building) => {
                return this.generateBuildingPreview(building)
              })
            }
          </div>
        }
      </div>
		)
	}
}

// defines the types of variables in this.props
PopupPanel.propTypes = {
	history: PropTypes.object.isRequired,
  buildings: PropTypes.array,            // passed in
	selectPopupBuilding: PropTypes.func.isRequired,
	card_style: PropTypes.string.isRequired,
  rent_type: PropTypes.string.isRequired,
}

// for all optional props, define a default value
PopupPanel.defaultProps = {
  buildings: [],
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(PopupPanel)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
    card_style: redux.search.card_style,
    rent_type: redux.filter.rent_type,
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
    selectPopupBuilding,
	})(RadiumHOC)
)

// ===============================

// the JS function that returns Radium JS styling
const comStyles = () => {
	return {
    container: {
      display: 'flex',
      flexDirection: 'column',
      minWidth: '800px',
			width: '50vw',
      maxWidth: '50vw',
      maxHeight: '100%',
      minHeight: '100%',
			//backgroundImage: `url('https://www.xmple.com/wallpaper/gradient-blue-white-linear-1920x1080-c2-ffffff-87ceeb-a-0-f-14.svg')`,
      backgroundColor: 'white',
			backgroundSize: 'cover',
			position: 'absolute',
			zIndex: 100,
			left: 0,
		},
    buttons_container: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
		scroll: {
			display: 'flex',
			flexDirection: 'row',
			flexWrap: 'wrap',
			maxHeight: '100%',
      minHeight: '100%',
			width: '100%',
			overflowY: 'scroll',
			padding: '20px',
			justifyContent: 'flex-start',
		},
    BuildingPreview: {
      width: '100%',
      height: '100%'
    },
		icon: {
			width: '20px',
			height: 'auto',
			margin: '5px',
		},
    back_button: {
      width: '100px',
      padding: '10px',
      margin: '10px'
    },
    building_button: {
      margin: '10px',
    }
	}
}
