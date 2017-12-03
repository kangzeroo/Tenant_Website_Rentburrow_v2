// Compt for copying as a ToastLauncher
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import { xMidBlue } from '../../../styles/base_colors'
import {
  Message,
} from 'semantic-ui-react'
import { removeToastMessage } from '../../../actions/messaging/toast_actions'


class ToastLauncher extends Component {

  dismissToast(e, toastId) {
    e.stopPropagation()
    this.props.removeToastMessage(toastId)
  }

	render() {
		return (
			<div id='ToastLauncher' style={comStyles().container}>
				{
          this.props.toasts.map((toast) => {
            return (
              <Message
                key={toast.id}
                icon={toast.icon ? toast.icon : false}
                header={toast.title}
                content={toast.text}
                onClick={toast.link ? () => window.open(toast.link, '_blank') : () => {}}
                color={toast.color}
                onDismiss={(e) => this.dismissToast(e, toast.id)}
                style={comStyles(toast.link).toast}
              />
            )
          })
        }
			</div>
		)
	}
}

// defines the types of variables in this.props
ToastLauncher.propTypes = {
	history: PropTypes.object.isRequired,
  toasts: PropTypes.array.isRequired,
  removeToastMessage: PropTypes.func.isRequired,
}

// for all optional props, define a default value
ToastLauncher.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(ToastLauncher)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
    toasts: redux.toasts.toasts,
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
    removeToastMessage,
	})(RadiumHOC)
)

// ===============================

// the JS function that returns Radium JS styling
const comStyles = (link) => {
  let toastStyles = {}
  if (link) {
    toastStyles = {
      ...toastStyles,
      cursor: 'pointer'
    }
  }
	return {
    container: {
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			position: 'absolute',
			bottom: '20px',
			right: '55px',
      zIndex: 99999,
      height: 'auto',
      pointerEvents: 'none',
		},
    toast: {
      margin: '5px auto',
      pointerEvents: 'auto',
      ...toastStyles,
    }
	}
}
