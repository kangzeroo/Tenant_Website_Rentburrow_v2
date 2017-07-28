// Higher Order Compt for checking if staff member is authenticated_staff
// Can also be written to check if corporation is authenticated_staff
// Or to check if staff member has permissions to view a passed in component

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

// this 'higher order component'(HOC) creator takes a component (called ComposedComponent)
// and returns a new component with added functionality
export default (ComposedComponent) => {
	class Authentication extends Component {

		// this.context gives access to upper components
		// but react-router prevents abuse of this.context by requiring explicit expression
		// so contextTypes{} is a React way of seeing these objects
		// `static` means contextTypes is a class defined property (the original blueprint)
		// static contextTypes = {
		// 	router: PropTypes.object
		// }


		// runs once on initilization when the component is initially rendered
		// componentWillMount() renders on server before sending out to client
		// whereas componentDidMount() renders on client
		componentWillMount() {
			if (!this.props.authenticated_staff) {
				this.props.history.push('/')
			}
		}

		// componentWillUpdate() is called each time the component gets a new set of props or re-rendered
		// the first arg `nextProps` defines the next set of properties a component will get rendered with
		componentWillUpdate(nextProps) {
			// console.log("componentWillUpdate")
			// console.log(this.props.authenticated_staff)
			// to clear the text on the `/resources` page after signing out, push url to the home route
			if (!nextProps.authenticated_staff) {
				this.props.history.push('/')
			}
		}

		render() {
			// the rendered composed component, with props passed through
			return <ComposedComponent {...this.props} />
		}
	}


	const mapStateToProps = (state) => {
		return {
			authenticated_staff: state.auth.authenticated_staff
		}
	}

	// we nest our custom HOC to connect(), which in itself is a HOC
	// we can actually nest HOC infinitely deep
	return withRouter(
		connect(mapStateToProps)(Authentication)
	)
}

// Pseudo-code demonstrating how to use the higher order component (HOC)
/*
	// In some other location (not in this file), we want to use this HOC...
	import Authentication	// The HOC
	import Resources		// The component to be wrapped
	const ComposedComponent = Authentication(Resources);

	// In some render method...
	<ComposedComponent />

	// <ComposedComponent> actually renders the Authentication class, which renders the composed component
	// This 2 layer method is powerful because when we pass in props to <ComposedComponent> like below:
	<ComposedComponent propA={propA} />
	// we can pass those props into the 2nd layer (composed component) using a correct 'this' reference to the 1st layer
*/
