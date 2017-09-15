// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import { filterSublets } from '../../api/filter/filter_api'
import { saveSubletsToRedux, saveSubletFilterParams, } from '../../actions/search/search_actions'
import {
	Checkbox,
	Button,
} from 'semantic-ui-react'
import InputRange from 'react-input-range'
require('../../styles/react-input-range.css')


class SubletFilterCard extends Component {

	constructor() {
		super()
		this.state = {
			price: {
				min: 500,
				max: 900,
			},
			room_count: 0,
			ensuite_bath: false,
			female_only: false,
      utils_incl: false,
		}
	}

	componentWillMount() {
		this.setState({
			...this.props.sublet_filter_params,
		}, () => console.log(this.state))
	}

	updateAttr(attr, value) {
		console.log(value)
		this.setState({
			[attr]: value
		})
	}

	applyFilters() {
		this.props.saveSubletFilterParams(this.state)
		filterSublets(this.state).then((sublets) => {
			this.props.saveSubletsToRedux(sublets)
			this.props.closeFilterCard()
		})
	}

/*
	renderRoomFilter() {
		return (
			<InputRange
				step={1}
				maxValue={10}
				minValue={1}
				formatLabel={(value) => `${value} bed${value > 1 ? 's' : ''}`}
				value={this.state.bedrooms}
				onChange={(value) => this.updateAttr('bedrooms', value)}
				onChangeComplete={value => console.log(value)}
			/>
		)
	}*/

	render() {
		return (
			<div style={comStyles().container}>
				<Button
					color='black'
					basic
					circular
					style={comStyles().close_button}
					icon='close'
					size='tiny'
					onClick={() => this.props.closeFilterCard()}
				/>
				<div style={comStyles().sliderBox}>
					<div style={comStyles().label}>
						<h2>Price</h2>
					</div>
					<div style={comStyles().slider}>
						<InputRange
							step={5}
		          maxValue={1200}
		          minValue={300}
		          formatLabel={(value) => `$${value}`}
		          value={this.state.price}
		          onChange={(value) => this.updateAttr('price', value)}
		          onChangeComplete={value => console.log(value)}
						/>
					</div>
				</div>
				<div style={comStyles().roomCountBox}>
					<div style={comStyles().label}>
						<h2>Bedrooms</h2>
					</div>
					<div style={comStyles().room_count}>
						<Button
							circular
							primary
							basic
							icon='minus'
							onClick={() => this.updateAttr('room_count', this.state.room_count - 1)}
							disabled={this.state.room_count === 0}
						/>
						<div style={comStyles().room_text} >
							{this.state.room_count}+
						</div>
						<Button
							circular
							primary
							basic
							icon='plus'
							onClick={() => this.updateAttr('room_count', this.state.room_count + 1)}
							disabled={this.state.room_count === 10}
						/>
					</div>
				</div>
				{/*<div style={comStyles().sliderBox}>
					<div style={comStyles().label}>
						<h2>Lease Length</h2>
					</div>
					<div style={comStyles().slider}>
						<InputRange
							step={4}
		          maxValue={16}
		          minValue={0}
		          formatLabel={(value) => `${value} months`}
		          value={this.state.lease_length}
		          onChange={(value) => this.updateAttr('lease_length', value)}
		          onChangeComplete={value => console.log(value)}
						/>
					</div>
				</div>*/}
				<div style={comStyles().main_amenities}>
					<Checkbox
						label='Ensuite Bath'
						checked={this.state.ensuite_bath}
						onChange={(e, x) => this.updateAttr('ensuite_bath', x.checked)}
						toggle />
					<Checkbox
						label='Utilities Included'
						checked={this.state.utils_incl}
						onChange={(e, x) => this.updateAttr('utils_incl', x.checked)}
						toggle />
					<Checkbox
						label='Female Only'
						checked={this.state.female_only}
						onChange={(e, x) => this.updateAttr('female_only', x.checked)}
						toggle />
				</div>
				<div style={comStyles().buttons_container}>
					<Button
						primary
						basic
						content='Cancel'
						onClick={() => this.props.closeFilterCard()}
					/>
					<Button
						primary
						content='Search'
						onClick={() => this.applyFilters()}
					/>
					{/*<Button positive basic content='More options...' />*/}
				</div>
			</div>
		)
	}
}

// defines the types of variables in this.props
SubletFilterCard.propTypes = {
	history: PropTypes.object.isRequired,
	saveSubletsToRedux: PropTypes.func.isRequired,
	closeFilterCard: PropTypes.func.isRequired,
	saveSubletFilterParams: PropTypes.func.isRequired,
	sublet_filter_params: PropTypes.object.isRequired,
}

// for all optional props, define a default value
SubletFilterCard.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(SubletFilterCard)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
		sublet_filter_params: redux.filter.sublet_filter_params,
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
		saveSubletsToRedux,
		saveSubletFilterParams,
	})(RadiumHOC)
)

// ===============================

// the JS function that returns Radium JS styling
const comStyles = () => {
	return {
		container: {
      display: 'flex',
      flexDirection: 'column',
			minHeight: '300px',
			maxHeight: '300px',
			padding: '30px 30px 10px 30px',
			border: 'gray solid thin',
			zIndex: '1',
			backgroundColor: 'white',
			borderRadius: '3px'
		},
		close_button: {
			position: 'absolute',
			top: '15px',
			left: '15px',
		},
		sliderBox: {
			padding: '10px',
			width: '100%',
			height: '50px',
			display: 'flex',
			flexDirection: 'row',
		},
		label: {
			width: '30%',
		},
		slider: {
			width: '70%',
		},
		main_amenities: {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'space-around',
			padding: '30px',
			height: 'auto',
		},
		buttons_container: {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'space-between',
			height: '50px',
		},
		roomCountBox: {
			padding: '20px 10px 20px 10px',
			width: '100%',
			height: '75px',
			display: 'flex',
			flexDirection: 'row',
		},
		room_count: {
			display: 'flex',
			flexDirection: 'row',
			width: '100%',
			justifyContent: 'space-around',
			alignItems: 'center',
			margin: '0px 200px 0px 200px',
		},
		room_text: {
			fontSize: 'x-large'
		}
	}
}
