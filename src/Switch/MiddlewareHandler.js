export class MiddlewareHandler extends React.PureComponent {

	state = {
		_initiated: false,
		loading: false,
		render: null
	}

	handleError(err) {
		const { errorHandler, props } = this.props

		return React.createElement(errorHandler, {
			...props,
			error: err
		})
	}

	componentDidMount() {
		const { route, props, context, render } = this.props

		let timeout = setTimeout(() => this.setState({ _initiated: true, loading: true }), context.timeout || 250)

		route.middleware.apply([ route, props ], response => {
			if(timeout) {
				clearTimeout(timeout)
				timeout = null
			}

			if(response instanceof Error) {
				response = this.handleError(response)
			}

			this.setState({
				_initiated: true,
				loading: false,
				render: response || render
			})
		})
	}

	render() {
		if(!this.state._initiated) {
			return null
		}

		if(this.state.loading) {
			return 'Loading...'
		}

		return this.state.render
	}

}
