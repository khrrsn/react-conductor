import React from 'react'

export class MiddlewareHandler extends React.PureComponent {

	state = {
		_initiated: false,
		loading: false,
		render: null
	}

	timeout = null

	handleError(err) {
		const { errorHandler, props } = this.props

		return React.createElement(errorHandler, {
			...props,
			error: err
		})
	}

	componentDidMount() {
		const { route, props, context } = this.props

		this.timeout = setTimeout(() => this.setState({ _initiated: true, loading: true }), context.timeout || 250)

		route.middleware.apply([ route, props ], response => {
			this.clearLoadingTimeout()

			if(response instanceof Error) {
				response = this.handleError(response)
			}

			this.setState({
				_initiated: true,
				loading: false,
				render: response || void 0
			})
		})
	}

	componentWillUnmount() {
		this.clearLoadingTimeout()
	}

	clearLoadingTimeout() {
		if(!this.timeout) {
			return
		}

		clearTimeout(this.timeout)
		this.timeout = null
	}

	render() {
		if(!this.state._initiated) {
			return null
		}

		if(this.state.loading) {
			return 'Loading...'
		}

		return this.state.render || this.props.render
	}

}
