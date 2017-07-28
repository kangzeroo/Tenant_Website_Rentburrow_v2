// The public facing homepage for users who have not signed in


import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'


class PublicBoard extends Component {

	render() {
		return (
			<div style={comStyles().container}>
				PublicBoard
			</div>
		)
	}
}

PublicBoard.propTypes = {

}

PublicBoard.defaultProps = {

}

const RadiumHOC = Radium(PublicBoard)

function mapStateToProps(state) {
	return {

	}
}

export default connect(mapStateToProps, {})(RadiumHOC)

// ===============================

const comStyles = () => {
	return {
		container: {

		}
	}
}
