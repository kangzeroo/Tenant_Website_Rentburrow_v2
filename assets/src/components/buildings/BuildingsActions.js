// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import {
  Link,
  withRouter,
} from 'react-router-dom'
import {
  Button,
} from 'semantic-ui-react'


class BuildingActions extends Component {

	render() {
		return (
			<div style={comStyles().container}>
        <Link to='/buildings/create'>
          <Button>
            CREATE BUILDING
          </Button>
        </Link>
			</div>
		)
	}
}

// defines the types of variables in this.props
BuildingActions.propTypes = {
	history: PropTypes.object.isRequired,
}

// for all optional props, define a default value
BuildingActions.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(BuildingActions)

// Get access to state from the Redux store
function mapStateToProps(state) {
	return {

	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapStateToProps, {

	})(RadiumHOC)
)

// ===============================

// the JS function that returns Radium JS styling
const comStyles = () => {
	return {
		container: {
      display: 'flex',
      flexDirection: 'row',
		}
	}
}
