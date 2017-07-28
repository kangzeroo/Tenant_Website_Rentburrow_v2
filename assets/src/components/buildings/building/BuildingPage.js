// Compt for copying as a template
// This compt is used for...
import _ from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
  Card,
  Image,
  Button,
  Table,
  Icon,
} from 'semantic-ui-react'
import { shortenAddress } from '../../../api/general/general_api'
import { getSuitesForBuilding } from '../../../api/suite/suite_api'
import { selectBuilding, selectSuite } from '../../../actions/selection/selection_actions'

class BuildingPage extends Component {

  constructor() {
    super()
    this.state = {
      building: {},
      suites: [],
      search_string: '',
      column: null,
      direction: null,
    }
  }

  componentWillMount() {
    // instead of grabbing the building from the redux store, we grab it from the url
    // then compare it against all the buildings in the redux store to get the appropriate one
    const building_id_loc = this.props.location.pathname.indexOf('buildings/')
    const building_id = this.props.location.pathname.slice(building_id_loc+10)
    // compare building_id from url to all buildings in the redux store
    let building = {}
    this.props.buildings.forEach((b) => {
      if (b.building_id === building_id) {
        building = b
      }
    })
    // get suites for building based off url
    this.setState({
      building: building
    }, () => {
      getSuitesForBuilding(
        {
          corporation_id: this.props.corporation.corp_id,
          building_id: this.state.building.building_id
        }
      ).then((suites) => {
        this.setState({
          suites: suites.map(s => JSON.parse(s))
        })
        this.props.selectBuilding(building)
      })
    })
  }

  updateAttr(attr, event) {
		this.setState({
			[attr]: event.target.value
		})
	}

  handleSort(clickedColumn) {
    //const { column, data, direction } = this.state

    if (this.state.column !== clickedColumn) {
      this.setState({
        column: clickedColumn,
        suites: _.sortBy(this.state.suites, [clickedColumn]),
        direction: 'ascending',
      })

      return
    }

    this.setState({
      suites: this.state.suites.reverse(),
      direction: this.state.direction === 'ascending' ? 'descending' : 'ascending',
    })
  }

  goToSuite(suite) {
    this.props.selectSuite(suite)
    this.props.history.push(`/buildings/${this.state.building.building_id}/suite/${suite.suite_id}`)
  }

	render() {
		return (
      <div style={comStyles().container}>
        <div style={comStyles().banner}>
          <Image src={this.state.building.thumbnail} fluid />
          <div style={coverStyles().title_sticker}>
            <div onClick={() => this.props.history.push(`/buildings`)} style={coverStyles().leftSide}>
              <Icon name='arrow left' style={coverStyles().backBtn} />
            </div>
            <div style={coverStyles().rightSide}>
              <div style={coverStyles().suite_num}>{ this.state.building.building_name }</div>
              <div style={coverStyles().suite_alias}>{ shortenAddress(this.state.building.building_address) }</div>
            </div>
          </div>
        </div>

        <div style={comStyles().content} >
          <div style={comStyles().leftContent} >
            <div style={comStyles().contentBar} >
              <input
                style={comStyles().searchBar}
                type='text'
                placeholder='Search Suite #...'
                value={this.state.search_string}
                onChange={(e) => this.updateAttr('search_string', e)}
              />

              <Button
                onClick={() => this.props.history.push(`/buildings/${this.state.building.building_id}/suite/create`)}
              >
                Create Suite
              </Button>
            </div>

            <div style={comStyles().table}>

                  <Table sortable fixed>
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell
                          sorted={this.state.column === 'suite_code' ? this.state.direction : null}
                          onClick={() => { this.handleSort('suite_code') }}
                        >
                          Suite Num
                        </Table.HeaderCell>
                        <Table.HeaderCell
                          sorted={this.state.column === 'price_low' ? this.state.direction : null}
                          onClick={() => { this.handleSort('price_low') }}
                        >
                          Room Prices
                        </Table.HeaderCell>
                        <Table.HeaderCell
                          sorted={this.state.column === 'occupied' ? this.state.direction : null}
                          onClick={() => { this.handleSort('occupied') }}
                        >
                          Suite Occupancy
                        </Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                    {
                      this.state.suites.filter((suite) => {
                        return suite.suite_code.toLowerCase().indexOf(this.state.search_string) > -1
                      }).map((suite) => {
                        return (
                          <Table.Row

                            key={suite.suite_id}

                            onClick={() => this.props.history.push(`/buildings/${this.state.building.building_id}/suite/${suite.suite_id}`)}
                            style={comStyles().tableRow}
                          >
                            <Table.Cell>{suite.suite_code}</Table.Cell>
                            <Table.Cell>${suite.price_low && suite.price_high ? suite.price_low : 0} - {suite.price_high}</Table.Cell>
                            <Table.Cell>{suite.occupied ? suite.occupied : 0} / {suite.total ? suite.total : 0} </Table.Cell>
                          </Table.Row>
                      )})
                    }
                  </Table.Body>
                  </Table>
            </div>
          </div>

          <div style={comStyles().rightContent} >
          </div>

        </div>
      </div>
		)
	}
}

// defines the types of variables in this.props
BuildingPage.propTypes = {
	history: PropTypes.object.isRequired,
  buildings: PropTypes.array.isRequired,
  location: PropTypes.object.isRequired,
  selectBuilding: PropTypes.func.isRequired,
  selectSuite: PropTypes.func.isRequired,
  corporation: PropTypes.object.isRequired,
}

// for all optional props, define a default value
BuildingPage.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(BuildingPage)

// Get access to state from the Redux store
function mapStateToProps(state) {
	return {
		buildings: state.corporation.buildings,
    corporation: state.auth.corporation_profile,
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapStateToProps, {
    selectBuilding,
    selectSuite,
	})(RadiumHOC)
)

// ===============================

// the JS function that returns Radium JS styling
const comStyles = () => {
	return {
		container: {
      display: 'flex',
      flexDirection: 'column',
		},
    suiteThumbnail: {
      width: '50px',
      height: '50px',
    },
    banner: {
      minHeight: '60vh',
      maxHeight: '60vh',
      overflow: 'hidden',
      position: 'relative'
    },
    content: {
      height: '100%',
      minWidth: '100%',
      maxWidth: '100%',
      display: 'flex',
      flexDirection: 'row'
    },
    leftContent: {
      flex: '2.5',
      borderRight: 'gray solid thin',
      display: 'flex',
      flexDirection: 'column'
    },
    rightContent: {
      flex: '1.5'
    },
    contentBar: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-around',
      height: '50px',
      width: '100%',
      paddingTop: '10px'
    },
    searchBar: {
      borderRadius: '0.3em',
      width: '70%'
    },
    table: {
      display: 'flex',
      padding: '15px 10px 20px 10px'
    },
    tableRow: {
      cursor: 'pointer'
    }
	}
}


const coverStyles = () => {
  return {
    outer_sleeve: {
      minHeight: '400px',
      maxHeight: '400px',
      maxWidth: '100%',
      minWidth: '100%',
      overflow: 'hidden',
      position: 'relative',
    },
    cover: {
      height: 'auto',
      width: '100%',
    },
    action_sticker: {
      position: 'absolute',
      bottom: '10px',
      right: '20px',
      height: '50px',
      width: '250px',
      color: 'white',
      fontSize: '1.5rem'
    },
    title_sticker: {
      minHeight: '100px',
      maxHeight: '100px',
      minWidth: '300px',
      maxWidth: '300px',
      position: 'absolute',
      backgroundColor: 'rgba(0,0,0,0.7)',
      top: '100px',
      color: 'white',
      borderRadius: '3px',
      display: 'flex',
      flexDirection: 'row',
    },
    leftSide: {
      width: '70px',
      maxHeight: '100%',
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      cursor: 'pointer'
    },
    rightSide: {
      width: '230px',
      maxHeight: '100%',
      display: 'flex',
      flexDirection: 'column',
    },
    backBtn: {
      fontSize: '2rem',
      color: 'white',
    },
    suite_num: {
      fontSize: '2rem',
      height: '60px',
      textAlign: 'center',
      alignItems: 'flex-end',
      justifyContent: 'center',
      padding: '20px 0px 0px 0px'
    },
    suite_alias: {
      fontSize: '1rem',
      height: '40px',
      textAlign: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      flexWrap: 'wrap'
    }
  }
}
