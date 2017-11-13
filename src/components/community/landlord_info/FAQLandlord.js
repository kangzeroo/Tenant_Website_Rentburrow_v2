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
	Tab,
} from 'semantic-ui-react'
import ProTipsTopic from '../student_info/ProTipsTopic'
import { getFileFromS3 } from '../../../api/aws/aws-S3'


class FAQLandlord extends Component {

	constructor() {
		super()
		this.state = {
			search_string: '',

			faq: [
		  ],
			benefits: [
			],
			howto: [
			]
		}
	}

	componentWillMount() {
		getFileFromS3('https://s3.amazonaws.com/rentburrow-static-assets/app_references/landlord_info/landlord_faq.json')
      .then((data) => {
        this.setState({
          faq: data.topics
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
		getFileFromS3('https://s3.amazonaws.com/rentburrow-static-assets/app_references/landlord_info/landlord_benefits.json')
      .then((data) => {
        this.setState({
          benefits: data.topics
        })
      })
		getFileFromS3('https://s3.amazonaws.com/rentburrow-static-assets/app_references/landlord_info/landlord_how_to_use_rentburrow.json')
      .then((data) => {
        this.setState({
          howto: data.topics
        })
      })
	}

	renderAccordians(tabKey) {
		return (
			<div style={comStyles().tabpane}>
				{
					this.state[tabKey].map((topic) => {
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
		)
	}

	renderTabs() {
		return [
			{ index: 0, code: 'benefits', menuItem: 'Amazing Benefits', render: () => <Tab.Pane attached={false}>{ this.renderAccordians('benefits') }</Tab.Pane> },
			{ index: 1, code: 'howto', menuItem: 'Getting Started', render: () => <Tab.Pane attached={false}>{ this.renderAccordians('howto') }</Tab.Pane> },
			{ index: 2, code: 'faq', menuItem: 'Frequently Asked Questions', render: () => <Tab.Pane attached={false}>{ this.renderAccordians('faq') }</Tab.Pane> },
		]
	}

	render() {
		return (
			<div style={comStyles().container}>
				<div style={comStyles().header_search}>
					<Header
						as='h1'
						icon='question circle'
						content='Landlord FAQ'
						subheader='Learn more about Rentburrow.com'
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
					<Tab
						panes={this.renderTabs()}
						defaultActiveIndex={0}
						onTabChange={(e, d) => this.setState({ search_string: '' })}
						style={comStyles().tab}
					/>
				</div>
			</div>
		)
	}
}

// defines the types of variables in this.props
FAQLandlord.propTypes = {
	history: PropTypes.object.isRequired,
}

// for all optional props, define a default value
FAQLandlord.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(FAQLandlord)

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
			width: '100%',
		},
		tab: {
			width: '90%',
		}
	}
}
