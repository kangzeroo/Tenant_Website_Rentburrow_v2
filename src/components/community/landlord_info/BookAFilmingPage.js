// Compt for copying as a BookAFilmingPage
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
	Step,
	Icon,
	Button,
} from 'semantic-ui-react'
import BookPhotoshootForm from './forms/BookPhotoshootForm'

class BookAFilmingPage extends Component {

	render() {
		return (
			<div id='BookAFilmingPage' style={comStyles().container}>
				<BookPhotoshootForm />
			</div>
		)
	}
}

// defines the types of variables in this.props
BookAFilmingPage.propTypes = {
	history: PropTypes.object.isRequired,
}

// for all optional props, define a default value
BookAFilmingPage.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(BookAFilmingPage)

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
			padding: '50px',
		},
		content: {
			minHeight: '500px',
			width: '100%',
			padding: '20px',
		},
		next: {
			height: '20%',
			width: '100%',
		}
	}
}
