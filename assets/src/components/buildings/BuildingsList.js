import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import BuildingsActions from './BuildingsActions'
import BuildingCard from './building/BuildingCard'
import {
  Search,
} from 'semantic-ui-react'

class BuildingsList extends Component {

	constructor() {
		super()
		this.state = {
			search_string: '',
		}
	}

	updateAttr(attr, event) {
		this.setState({
			[attr]: event.target.value
		})
	}


	render() {
		return (
			<div style={comStyles().mainview}>
				<div style={comStyles().actions}>
					{/*}<Search
	            onSearchChange={(e) => this.updateAttr('search_string', e)}
	            value={this.state.search_string}
							showNoResults={false}
              style={comStyles().search}
	        />*/}
          <div style={comStyles().buildingsHeader}>
            <input
              style={comStyles().searchBar}
              type='text'
              placeholder='Search Building...'
              value={this.state.search_string}
              onChange={(e) => this.updateAttr('search_string', e)}
            />
            <BuildingsActions style={comStyles().createButton} />
          </div>
				</div>
				<div style={comStyles().list}>
					{
						this.props.buildings.filter((building) => {
							return building.building_address.toLowerCase().indexOf(this.state.search_string) > -1
						}).map((building) => {
							return (
								<BuildingCard
                  key={building.building_id}
                  building={building}
                  style={comStyles().listItem}
                />
							)
						})
					}
				</div>
			</div>
		)
	}
}

BuildingsList.propTypes = {
	history: PropTypes.object.isRequired,
	buildings: PropTypes.array.isRequired,
}

BuildingsList.defaultProps = {

}

const RadiumHOC = Radium(BuildingsList)

function mapReduxToProps(state) {
	return {
		buildings: state.corporation.buildings,
	}
}

export default withRouter(
	connect(mapReduxToProps, {

	})(RadiumHOC)
)

// ===============================

const comStyles = () => {
	return {
		mainview: {
			display: 'flex',
			flexDirection: 'column',
			flexWrap: 'wrap',
			cursor: 'pointer',
		},
		actions: {
			display: 'flex',
			flexDirection: 'row',
		},
		list: {
      paddingTop: '20px',
			display: 'flex',
      flexFlow: 'row wrap',
      justifyContent: 'space-around',
      paddingBottom: '20px'
		},
    listItem: {
      width: '30%',
      padding: '5px',
    },
    searchBar: {
      borderRadius: '0.3em',
      width: '80%'
    },
    createButton: {
      height: '100%'
    },
    buildingsHeader: {
      width: '100%',
      height: '50px',
      paddingTop: '10px',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-around'
    }
	}
}
