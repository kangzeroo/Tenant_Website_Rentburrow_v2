// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
	xMidBlue,
} from '../../../styles/base_colors'
import {

} from 'semantic-ui-react'
import {
	changeCardStyle,
} from '../../../actions/search/search_actions'
import BuildingCard from '../cards/BuildingCard'
import BuildingRow from '../cards/BuildingRow'


class HousingPanel extends Component {

	generateCard(building) {
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

	render() {
		return (
			<div style={comStyles().container}>

				<div style={comStyles().control_bar}>
					{
						generateIconStyles().map((option) => {
							return (
								<img key={option.id} onClick={() => this.props.changeCardStyle(option.id)} width='50' height='50' style={comStyles().icon} src={option.icon} />
							)
						})
					}
				</div>

				<div style={comStyles().scroll}>
					{
						this.props.buildings.map((building) => {
							return this.generateCard(building)
						})
					}
				</div>
			</div>
		)
	}
}

// defines the types of variables in this.props
HousingPanel.propTypes = {
	history: PropTypes.object.isRequired,
	buildings: PropTypes.array,
	changeCardStyle: PropTypes.func.isRequired,
	card_style: PropTypes.string.isRequired,
}

// for all optional props, define a default value
HousingPanel.defaultProps = {
	buildings: []
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(HousingPanel)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
		buildings: redux.search.search_results,
		card_style: redux.search.card_style,
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
		changeCardStyle,
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
			backgroundImage: `url('https://www.xmple.com/wallpaper/gradient-blue-white-linear-1920x1080-c2-ffffff-87ceeb-a-0-f-14.svg')`,
			backgroundSize: 'cover',
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
		}
	}
}


const generateIconStyles = () => {
	return [
		{
			id: 'row',
			icon: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAABcElEQVR4Xu3aQQ0AMQzEwIQ/6JTGSPUhsOzbT9SdPsrAUjTBTEGwn6AgBcEMYDgtpCCYAQynhRQEM4DhtJCCYAYwnBZSEMwAhtNCCoIZwHD27g5j+hqnIFj+ghQEM4DhtJCCYAYwnBZSEMwAhtNCCoIZwHC6ZRUEM4DhtJCCYAYwnBZSEMwAhtNCCoIZwHBaSEEwAxhOCykIZgDDaSEFwQxgOC2kIJgBDKeFFAQzgOG0kIJgBjCcXp0UBDOA4bSQgmAGMJwWUhDMAIbTQgqCGcBwWkhBMAMYTresgmAGMJwWUhDMAIbTQgqCGcBwWkhBMAMYTgspCGYAw2khBcEMYDgtpCCYAQynhRQEM4DhtJCCYAYwnBZSEMwAhtOrk4JgBjCcFlIQzACG00IKghnAcFpIQTADGE4LKQhmAMPpllUQzACG00IKghnAcFpIQTADGE4LKQhmAMNpIQXBDGA4LaQgmAEMp4UUBDOA4bQQLMgD25937ZB41zQAAAAASUVORK5CYII=`,
		},
		{
			id: 'grid',
			icon: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGgAAABoCAYAAAAdHLWhAAADqklEQVR4Xu2d/ZHUMAzF5U6gAqADOgIq4eiIDrirADoxk5vszK5J/LH75LPx7/6No1Xes55ylrQbjL+hEQhDe4dzBkGDbwIImp2gGOM7M/tiZp/N7GPl8zyb2U8z+xFC+FN5T9Wy1fzJRlCM8buZfa1C7nzRUwjh24M2Xm9f0Z9TgmKMvxoipoT/cwjhU2lR7vqq/hwSFGN82mXtEUzTeze5uysaV/bnH4J2jf+tZObK1vvWnLS6P0cEeUTPhaPmKHKKnmn8OSJImXvSQGzOReLcM50/RwRFJ3l7NRtCaPrfK8a4tD8QNPiGgSAIuhVMJC6fQFJ8iCAiiAhqeekighK0RpdcJA6JQ+KQuBYE/gOJ24ptHx545tytLyGE2qLfpQa0tD8cljaWQHof3lJuaCzJ9y5/ULC7Q8udouiwFJMreSu1vzn3pLjFGJf0p9Q0oijeNRfpzja1aOdO5U+xNrNr7tZLsLVd1b7dvextV1tHj0fb1TL+FAm6Q6K5RYgABAnB9DAFQR6oCm1CkBBMD1MQ5IGq0CYECcH0MAVBHqgKbUKQEEwPUxDkgarQJgQJwfQwBUEeqAptQpAQTA9TRYJWmwltBdkbn1K5gRnVDGM9ZmaZUW0NmX29eG7pdG6KkvcdBIkKh+kn15W8ezdFlPBZ3R/ariZsu2JGNf9i0BUfmudpnr/djqOPe1TkxK5DzUQQEUQElaLy+joTdglao0suEofEIXFIXAsCSFwerdE1v8R17+8OIgdNmIOUczjphmyeExLPBU3nD4elEx6Wbl/DzFdiniSj3uUPCnalt4KD629asLv4I9b+5tyT4rKqP6WmEWZU87Uhd3xq266WmQltVTzvGd4iQa0Os16LAARp8ZRbgyA5pFqDEKTFU24NguSQag1CkBZPuTUIkkOqNQhBWjzl1iBIDqnWIARp8ZRbgyA5pFqDEKTFU26tSJD3DGbrE63mT6ncwIxqvtzgjg8zqq0hvK9nRvUKuJ4l5hq+evpz1NVD00he1rriQ9vVhG1XXWcwS5Ii1vr044b/XVdafyds/e06g1kRQUv7QwQRQbcxwvhJXjOYUU3wGX3DIHFIHBJXehG6vo7EIXFtSbC0u3rPhI7mDzlowhzEjGr+sLQrPhyWTnhY2vU4vULzl/aHGdXSDjm4/qYFu4s/q86E1vLVC59S04j7DGYtINs60c7ld1TNjN9Rze+8anyKfXEtO5y1egQgSI+p1CIESeHUG4MgPaZSi38BI48CpdYtQBoAAAAASUVORK5CYII=`,
		},
		{
			id: 'cover',
			icon: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAADtUlEQVR4Xu2d4W0TQRCFZyqADqAD6ACogHQAJVBKSiAdQAVAB6QCkg5IBRO90620Phv5Hr6nbOy3knUJzL7sfZ9vvb88GR5DEcihVuPFhIUM9iawEAsZjMBgy/ETYiGDERhsOX5CLGQwAoMtx0+IhQxGYLDl+AkZTUhVvY2IH/O6riPiJjPvBlvnWS6nql5HxKeI+DLf4Iesqj8Rgf/ox7eIwOt7Zv49SxpPdFNV9TIiPkbE1fzqV3IHIXVkbZZzorwjEnbS1wjpJ/yMiOmVmb9OXOdZT6+qdxHxvnutul9WSB+Krex3ExQRt5e6vc1PwJsOPj6XsTXR4xQhh/4YBOFA0ESdnaQFfIDH5y+um4ythewtKjN3jtZVhVMFpD1kJsQNN+aT5wvAzsybfoErPnNPup+nELI8RLStDzcCUe3I3f97u8l79kg+Hy1fLSj1Wwre4e2UubfVHHhDHTsEPXshJ92AerKFqAmT+RZCAlOXW4iaMJlvISQwdbmFqAmT+RZCAlOXW4iaMJlvISQwdbmFqAmT+RZCAlOXW4iaMJlvISQwdbmFqAmT+RZCAlOXW4iaMJlvISQwdbmFqAmT+RZCAlOXW4iaMJlvISQwdbmFqAmT+RZCAlOXW4iaMJlvISQwdbmFqAmT+RZCAlOXW4iaMJlvISQwdbmFqAmT+RZCAlOXW4iaMJlvISQwdbmFqAmT+RZCAlOXW4iaMJlvISQwdbmFqAmT+RZCAlOXW4iaMJlvISQwdbmFqAmT+RZCAlOXW4iaMJlvISQwdbmFqAmT+RZCAlOXW4iaMJlvISQwdbmFqAmT+RZCAlOXW4iaMJlvISQwdbmFqAmT+RZCAlOXW4iaMJlvISQwdbmFqAmT+RZCAlOXW4iaMJl/yULuuy/iR9OYNvqfIzN3fj/Gt6rQVKUf/e/tZ3wZ//IL+6c5lyDka9djZOqAMEojmLk3SOuQMPUGyczPvc3n2q4C7ZCmxi6Zic5vZzOqCh3VWiMXtDXadGzRPwRbDbaRqavOqE1aNqXWhc3NX7D1QRKuB7e+tX//f4Tcdn2nIMBt9XYFofdU3wwMvalWjzVCHmYBaJ8HAW46uRpvxNzhB4LQtxBXtFL654AQAF4+ZtiGmgBcPTYiUFVNDK573CEE1hp0XK8v7XNgI9Z0zPz5g0MC5GDrv3JzYhqjdoKFaPnS6RZCI9NOsBAtXzrdQmhk2gkWouVLp1sIjUw7wUK0fOl0C6GRaSdYiJYvnW4hNDLtBAvR8qXTHwFWrqyF/26oawAAAABJRU5ErkJggg==`,
		},
	]
}
