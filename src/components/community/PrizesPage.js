// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
  Header,
  Card,
  Image,
  Modal,
} from 'semantic-ui-react'


class PrizesPage extends Component {

  constructor() {
    super()
    this.state = {
      toggle_modal: false,
      modal_name: '',
      context: null,
    }
  }

  toggleModal(bool, attr, context) {
    this.setState({
      toggle_modal: bool,
      modal_name: attr,
      context: context
    })
  }

  renderAppropriateModal(modal_name, context) {
    if (modal_name === 'prizemodal') {
      return this.renderPrizeModal(context)
    }
    return null
  }

  renderPrizeModal(context) {
    return (
      <Modal.Content>
        <Image
          src={context.image}
          fluid
        />
        <Header
          as='h2'
          content={context.header}
          subheader={context.description}
        />
      </Modal.Content>
    )
  }

	render() {
    const prizes = [
      {
        image: 'https://img.grouponcdn.com/deal/mJyn1PCrztjcL9q7ao99/Xn-2048x1229/v1/c700x420.jpg',
        header: 'All You Can Eat Sushi',
        description: `Eat all the sushi you want at one of Waterloo's finest japanese buffets. Bring your new roommates to celebrate a job well done finding a new place!`

      },
      {
        image: 'https://media.timeout.com/images/102523828/image.jpg',
        header: 'All You Can Eat Korean BBQ',
        description: 'You like meat? You hungry? Sign a lease online, and get some fresh barbequed meat'
      },
      {
        image: 'https://h2savecom.files.wordpress.com/2017/02/sephora-gift-card.jpg?w=1024&h=538',
        header: 'Sephora Giftcard',
        description: `Stock up on your makeup for the next school year, you're going to need it`
      },
      {
        image: 'https://img.grouponcdn.com/deal/mJyn1PCrztjcL9q7ao99/Xn-2048x1229/v1/c700x420.jpg',
        header: 'All You Can Eat Sushi',
        description: `Eat all the sushi you want at one of Waterloo's finest japanese buffets. Bring your new roommates to celebrate a job well done finding a new place!`

      },
      {
        image: 'https://media.timeout.com/images/102523828/image.jpg',
        header: 'All You Can Eat Korean BBQ',
        description: 'You like meat? You hungry? Sign a lease online, and get some fresh barbequed meat'
      },
      {
        image: 'https://h2savecom.files.wordpress.com/2017/02/sephora-gift-card.jpg?w=1024&h=538',
        header: 'Sephora Giftcard',
        description: `Stock up on your makeup for the next school year, you're going to need it`
      }
    ]
		return (
			<div style={comStyles().container}>
				<Header
          as='h1'
          icon='gift'
          content='Prizes'
          subheader='Sign online, and choose one of these fantastic prizes!'
        />
        <div style={comStyles().prizesContainer} >
          {
            prizes.map((prize) => {
              return (
                <Card
                  onClick={() => this.toggleModal(true, 'prizemodal', prize)}
                  raised
                  image={prize.image}
                  header={prize.header}
                  description={prize.description}
                />
              )
            })
          }
        </div>
        <Modal dimmer='blurring' open={this.state.toggle_modal} onClose={() => this.toggleModal(false)}>
          {
            this.renderAppropriateModal(this.state.modal_name, this.state.context)
          }
        </Modal>
			</div>
		)
	}
}

// defines the types of variables in this.props
PrizesPage.propTypes = {
	history: PropTypes.object.isRequired,
}

// for all optional props, define a default value
PrizesPage.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(PrizesPage)

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
      height: '100%',
      width: '100vw',
      margin: '30px',
		},
    prizesContainer: {
      display: 'flex',
			flexDirection: 'row',
			flexWrap: 'wrap',
			maxHeight: '100%',
			width: '75%',
			padding: '30px',
			justifyContent: 'space-between',
      margin: '50px',
      overflowY: 'scroll'
    },
	}
}
