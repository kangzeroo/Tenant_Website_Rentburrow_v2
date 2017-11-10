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
	Search,
	Accordion,
} from 'semantic-ui-react'
import ProTipsTopic from './ProTipsTopic'
import { getFileFromS3 } from '../../../api/aws/aws-S3'


class ProTipsPage extends Component {

	constructor() {
		super()
		this.state = {
			search_string: '',

			topics: [],
		}
	}

	componentWillMount() {
		getFileFromS3('https://s3.amazonaws.com/rentburrow-static-assets/app_references/student_info/student_faq.json')
      .then((data) => {
        this.setState({
          topics: data.topics
        })
        /*
					data.topics = [
						{ key: 'general', title: 'General Tips', tips: [
							{ index: 0, icon: 'mail', title: 'Example title', explanation: 'Cool Dawg' },
							{ index: 1, icon: 'alarm', title: 'Yum', explanation: 'MHMM YES' }
						] },
						{ key: 'protips', title: 'The Pro Tips', tips: [
							{ index: 0, icon: 'mail', title: 'When to do this', explanation: 'YEA BOI' },
							{ index: 1, icon: 'calendar outline', title: 'Why to do this', explanation: 'OH LAWDY' },
						] },
					],
        */
      })
	}

	render() {
		return (
			<div style={comStyles().container}>
				<div style={comStyles().header_search}>
					<Header
						as='h1'
						icon='question circle'
						content='FAQ & Pro-Tips'
						subheader='Everything you need to know about renting'
					/>
					&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
					<Search
							onSearchChange={(e) => this.setState({ search_string: e.target.value })}
							value={this.state.search_string}
							fluid
							showNoResults={false}
					/>
				</div>

				<div style={comStyles().tips_section}>
					{
						this.state.topics.map((topic) => {
							let relevant = false
							topic.tips.forEach((t) => {
								if (t.title.toLowerCase().indexOf(this.state.search_string.toLowerCase()) > -1 || t.explanation.toLowerCase().indexOf(this.state.search_string.toLowerCase()) > -1) {
									relevant = true
								}
							})
							if (topic.title.toLowerCase().indexOf(this.state.search_string.toLowerCase()) > -1) {
								relevant = true
							}

							if (relevant) {
								return (
									<ProTipsTopic
										topic={topic}
										tips={topic.tips.filter((t) => {
											return t.title.toLowerCase().indexOf(this.state.search_string.toLowerCase()) > -1 || t.explanation.toLowerCase().indexOf(this.state.search_string.toLowerCase()) > -1
										})}
									/>
								)
							} else {
								return null
							}
						})
					}
				</div>
			</div>
		)
	}
}

// defines the types of variables in this.props
ProTipsPage.propTypes = {
	history: PropTypes.object.isRequired,
}

// for all optional props, define a default value
ProTipsPage.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(ProTipsPage)

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
			padding: '30px',
			width: '100%',
		},
		header_search: {
      display: 'flex',
      flexDirection: 'row',
			justifyContent: 'center',
			width: '100%',
		},
		tips_section: {
      display: 'flex',
      flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			margin: '50px',
		}
	}
}
