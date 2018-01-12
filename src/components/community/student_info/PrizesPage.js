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
    getFileFromS3('https://s3.amazonaws.com/rentburrow-static-assets/app_references/student_info/student_prizes.json')
      .then((data) => {
        this.setState({
          // prizes: data.prizes
          prizes: [
            {
              "image": "https://s3.amazonaws.com/rentburrow-static-assets/app_references/student_info/gift_images/Screen+Shot+2017-11-13+at+4.50.04+PM.png",
              "header": "All You Can Eat Sushi",
              "quick_desc": "Sakura Island on the intersection of King Street and University",
              "full_desc": "All You Can Eat Sushi at Sakura Island on any weekday (lunch or dinner). Tips included! Located at the intersection of King Street and University Street."
            },
            {
              "image": "https://s3.amazonaws.com/rentburrow-static-assets/app_references/student_info/gift_images/Screen+Shot+2017-11-13+at+4.53.15+PM.png",
              "header": "All You Can Eat Korean BBQ",
              "quick_desc": "Busan Korean BBQ on the intersection of King Street and Columbia",
              "full_desc": "All You Can Eat Korean BBQ at Busan Kbbq on any weekday (lunch or dinner). Tips included! Located at the intersection of King Street and Columbia St West."
            },
            {
              "image": "https://s3.amazonaws.com/rentburrow-static-assets/app_references/student_info/gift_images/Screen+Shot+2017-11-13+at+4.56.08+PM.png",
              "header": "Sephora Giftcard",
              "quick_desc": "The closest one is at Conestoga Mall (but you probably already knew)",
              "full_desc": "$50 Sephora Giftcard when your entire group rents an entire suite through Rentburrow.com (eg. 2 roommates in a 2 bed unit or 5 roommates in a 5 bed unit are both valid). $30 Giftcard if the suite is only partially signed through Rentburrow.com"
            },
            {
              "image": "https://s3.amazonaws.com/rentburrow-static-assets/app_references/student_info/gift_images/Screen+Shot+2017-11-13+at+4.55.52+PM.png",
              "header": "The Practical Gift Pack",
              "quick_desc": "Something to keep your new home clean and smelling great!",
              "full_desc": "A full package of goodies such as paper towels, disinfectant wipes, air fresheners and disposable gloves. Gift package may not look like the image."
            },
            {
              "image": "https://s3.amazonaws.com/rentburrow-static-assets/app_references/student_info/gift_images/Screen+Shot+2017-11-13+at+4.56.01+PM.png",
              "header": "Bubble Tea For All Roommates",
              "quick_desc": "Every gets a bubble tea! Or you get 5, we wont know.",
              "full_desc": "A giftcard to Noon Moment Bubble Tea for 5 bubble teas, located at the intersection of Regina St and University St."
            },
            {
              "image": "https://s3.amazonaws.com/rentburrow-static-assets/app_references/student_info/gift_images/Screen+Shot+2017-11-13+at+5.27.29+PM.png",
              "header": "Charitable Donation",
              "quick_desc": "Up to a $50 donation to your favorite charity",
              "full_desc": "$50 donation when your entire group rents an entire suite through Rentburrow.com (eg. 2 roommates in a 2 bed unit or 5 roommates in a 5 bed unit are both valid). $30 donation if the suite is only partially signed through Rentburrow.com. You must provide the necessary paperwork for donation (unfortunetely we do not have the resources to do this paperwork for you)."
            }
          ]
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
        <Header
          as='h2'
          content={context.header}
          subheader={context.full_desc}
        />
        <Image
          src={context.image}
          fluid
        />
      </Modal.Content>
    )
  }

  explainHowThisWorks() {
    return (
      <Modal.Content>
        <Header
          icon='gift'
          as='h1'
          content='Apply Online With Renthero.ca'
          subheader='And get a free housewarming gift'
        />
        <div style={comStyles().gift_explanation}>
          Simply click "Apply Now" on the building you want to rent and fill out the application form with your information. After you later sign the lease contract with the landlord, we will send you an email where you can tell us know which gift you want. Once the landlord has verified and paid us, your gift will be available for pickup at our booth at the SLC or Laurier Concourse. Each roommate chooses their own gift. Bring more roommates in your group to unlock bigger gifts.
        </div>
        <div style={comStyles().okButton}>
          <Button primary onClick={() => this.toggleModal(false)} content="That's awesome!" />
        </div>
      </Modal.Content>
    )
  }

	render() {
		return (
			<div id='PrizesPage' style={comStyles().container}>
        <Button onClick={() => this.toggleModal(true, 'how')} primary content='How Does This Work?' style={comStyles().explain_button} />
        <div style={comStyles().header_search}>
          <Header
            as='h1'
            icon='gift'
            content='Housewarming Gifts'
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
    },
    gift_explanation: {
      fontSize: '1.2rem',
      padding: '20px',
    },
    okButton: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-end',
      width: '100%',
    }
	}
}
