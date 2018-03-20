// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
  Button,
} from 'semantic-ui-react'


class DescriptionBox extends Component {

  constructor() {
    super()
    this.state = {
      expanded: false,
    }
  }

  createMarkup(string) {
		return {
			__html: string,
		}
	}

	render() {
		return (
			<div id='DescriptionBox' style={comStyles().container}>
        <div className='pretty_scrollbar' style={comStyles(this.state.expanded).desc}>
          <div
            dangerouslySetInnerHTML={this.createMarkup(this.props.description)}
            style={comStyles().textMarkup}
          />
        </div>
        {
          this.props.description.length > 500
          ?
          <Button
            primary
            basic
            onClick={() => this.setState({ expanded: !this.state.expanded })}
            style={comStyles().expand}
            content={this.state.expanded ? 'Minimize' : 'See More'}
          />
          :
          null
        }
			</div>
		)
	}
}

// defines the types of variables in this.props
DescriptionBox.propTypes = {
	history: PropTypes.object.isRequired,
  description: PropTypes.string.isRequired,     // passed in
}

// for all optional props, define a default value
DescriptionBox.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(DescriptionBox)

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
const comStyles = (expanded) => {
  let attrs = {
    maxHeight: '200px',
    overflow: 'hidden'
  }
  if (expanded) {
    attrs = {
      height: 'auto',
    }
  }
	return {
		container: {
      display: 'flex',
      flexDirection: 'column',
      margin: '5px auto',
		},
    desc: {
      ...attrs,
      margin: '10px auto',
    },
		textMarkup: {
			fontSize: '1rem',
			lineHeight: '2rem',
		},
    expand: {
      width: '100%',
      // height: '30px',
      // padding: '10px 0px 0px 0px',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.05)',
      cursor: 'pointer',
      fontWeight: 'bold',
    }
	}
}
