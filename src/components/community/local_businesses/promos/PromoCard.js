// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import { selectLocal } from '../../../../actions/community/community_actions'
import {
	Card,
	Image,
	Icon,
} from 'semantic-ui-react'


class PromoCard extends Component {


	render() {
		const { promo } = this.props
		return (
			<Card id='PromoCard' onClick={() => this.props.selectLocal(promo)} raised key={promo.promo_id} style={comStyles().container}>
				<Image fluid src={promo.img} style={comStyles().image}/>
				<Card.Content>
					<Card.Header>
						{ promo.title }
					</Card.Header>
					<Card.Meta>
						<span className='date'>
							{ promo.vendor }
						</span>
					</Card.Meta>
					<Card.Description>
						{ promo.desc }
					</Card.Description>
				</Card.Content>
				<Card.Content extra>
					<a>
						<Icon name='dollar' />
						{ promo.price }
					</a> <br />
					<a>
						<Icon name='location arrow' />
						{ promo.location }
					</a>
				</Card.Content>
			</Card>
		)
	}
}

// defines the types of variables in this.props
PromoCard.propTypes = {
	history: PropTypes.object.isRequired,
	promo: PropTypes.object.isRequired,			// passed in
	selectLocal: PropTypes.func.isRequired,
}

// for all optional props, define a default value
PromoCard.defaultProps = {
	selected_local: null,
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(PromoCard)

// Get access to state from the Redux store
const mapReduxToProps = (state) => {
	return {

	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
		selectLocal,
	})(RadiumHOC)
)

// ===============================

// the JS function that returns Radium JS styling
const comStyles = () => {
	return {
		container: {
      display: 'flex',
      flexDirection: 'column',
			cursor: 'pointer',
			maxHeight: '300px',
			minHeight: '300px',
			margin: '5px auto',
		},
		image: {
			width: 'auto',
			maxHeight: '150px',
			minHeight: '150px',
		}
	}
}
