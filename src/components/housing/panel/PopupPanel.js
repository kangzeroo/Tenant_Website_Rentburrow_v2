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

  generateSubletCard(sublet) {
    return (
      <SubletCard
				key={sublet.post_id}
				fb_post={sublet}
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
          this.generateSubletCard(this.props.building)
          :
          this.generateBuildingCard(this.props.building)
        }
			</div>
		)
	}
}

// defines the types of variables in this.props
PopupPanel.propTypes = {
	history: PropTypes.object.isRequired,
  building: PropTypes.object.isRequired,            // passed in
	selectPopupBuilding: PropTypes.func.isRequired,
	card_style: PropTypes.string.isRequired,
  rent_type: PropTypes.string.isRequired,
}

// for all optional props, define a default value
PopupPanel.defaultProps = {
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
      height: '100%',
			//backgroundImage: `url('https://www.xmple.com/wallpaper/gradient-blue-white-linear-1920x1080-c2-ffffff-87ceeb-a-0-f-14.svg')`,
      backgroundColor: 'white',
			backgroundSize: 'cover',
			position: 'absolute',
			zIndex: 100,
			left: 0,
		},
		scroll: {
			display: 'flex',
			flexDirection: 'row',
			flexWrap: 'wrap',
			maxHeight: '100%',
			width: '100%',
			overflowY: 'scroll',
			padding: '20px',
			justifyContent: 'flex-start',
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
    }
	}
}
