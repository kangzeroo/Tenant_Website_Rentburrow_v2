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
  Search,
  Button,
} from 'semantic-ui-react'
import { getFileFromS3 } from '../../../api/aws/aws-S3'


class PrizesPage extends Component {

  constructor() {
    super()
    this.state = {
      search_string: '',
      prizes: [],

      toggle_modal: false,
      modal_name: '',
      context: null,
    }
  }

  componentWillMount() {
    getFileFromS3('https://s3.amazonaws.com/rentburrow-static-assets/app_references/student_info/prizes.json')
      .then((data) => {
        this.setState({
          prizes: data.prizes
        })
        /*
          data = {
            "prizes": [
              {
                "image": "https://img.grouponcdn.com/deal/mJyn1PCrztjcL9q7ao99/Xn-2048x1229/v1/c700x420.jpg",
                "header": "All You Can Eat Sushi",
                "quick_desc": "Eat all the sushi you want at one of Waterloo's finest japanese buffets. Bring your new roommates to celebrate a job well done finding a new place!",
                "full_desc": "Something something something. Restrictions apply"
              }
            ]
          }
        */
      })
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
    } else if (modal_name === 'how') {
      return this.explainHowThisWorks()
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
          subheader={context.full_desc}
        />
      </Modal.Content>
    )
  }

  explainHowThisWorks() {
    return (
      <Modal.Content>
        <Header
          as='h2'
          content='Apply for Rent Online'
          subheader='All you have to do is...'
        />
      </Modal.Content>
    )
  }

	render() {
		return (
			<div style={comStyles().container}>
        <Button onClick={() => this.toggleModal(true, 'how')} primary content='How Does This Work?' style={comStyles().explain_button} />
        <div style={comStyles().header_search}>
          <Header
            as='h1'
            icon='gift'
            content='Prizes'
            subheader='Sign online and get a prize!'
          />
					&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
					<Search
							onSearchChange={(e) => this.setState({ search_string: e.target.value })}
							value={this.state.search_string}
							fluid
							showNoResults={false}
					/>
				</div>
        <div style={comStyles().prizesContainer} >
          {
            this.state.prizes.filter((prize) => {
              return prize.header.toLowerCase().indexOf(this.state.search_string.toLowerCase()) > -1 || prize.quick_desc.toLowerCase().indexOf(this.state.search_string.toLowerCase()) > -1 || prize.full_desc.toLowerCase().indexOf(this.state.search_string.toLowerCase()) > -1
            }).map((prize, index) => {
              return (
                <Card
                  key={index}
                  onClick={() => this.toggleModal(true, 'prizemodal', prize)}
                  raised
                  style={comStyles().prize_card}
                >
                  <div style={comStyles().image_container}>
                    <Image src={prize.image} width='400px' height='auto' />
                  </div>
                  <Card.Content>
                    <Card.Header>
                      {prize.header}
                    </Card.Header>
                    <Card.Description>
                      {prize.quick_desc}
                    </Card.Description>
                  </Card.Content>
                </Card>
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
      minWidth: '100vw',
      maxWidth: '100vw',
      margin: '30px',
		},
		header_search: {
      display: 'flex',
      flexDirection: 'row',
			justifyContent: 'center',
			width: '100%',
		},
    prizesContainer: {
      display: 'flex',
			flexDirection: 'row',
			flexWrap: 'wrap',
			width: '90%',
			padding: '30px',
			justifyContent: 'space-around',
    },
    prize_card: {
      minHeight: '350px',
      maxHeight: '350px',
      minWidth: '300px',
      maxWidth: '300px',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    },
    image_container: {
      width: '300px',
      height: '200px',
      overflow: 'hidden',
    },
    explain_button: {
      width: '200px',
      left: '0px',
    }
	}
}
