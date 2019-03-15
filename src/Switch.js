import { RouterContext } from './RouterContext'
import { MiddlewareHandler } from './Switch/MiddlewareHandler'

export class Switch extends React.Component {

	render() {
		let { routes, location: propLocation, errorHandler, loading, ...additionalProps } = this.props

		if(routes.isNil) {
			return null
		}

		return (
			<RouterContext.Consumer>
				{context => {
					const location = propLocation || context.location
					errorHandler = errorHandler || context.errorHandler
					loading = loading || context.loading

					const match = context.router.match(location, routes)
					const props = {
						location,
						route: (match || { }).route,
						routes: ((match || { }).route || { }).routes,
						params: ((match || { }).params || { }),
						...additionalProps,
					}

					return this.process(match || { }, { errorHandler, loading, ...props }, context)
				}}
			</RouterContext.Consumer>
		)
	}

	process({ route }, { errorHandler, loading, ...props }, context) {
		if(route.isNil || (!route.isComponent && !route.isAction)) {
			return null
		}

		if(route.middleware.exists) {
			return React.createElement(MiddlewareHandler, {
				route,
				props,
				context,
				errorHandler,
				loading,
				render: this.renderRoute({ route }, props, context),
			})
		}

		return this.renderRoute({ route }, props)
	}

	renderRoute({ route }, props) {
		if(route.isComponent) {
			return React.createElement(route.component, props)
		} else if(route.isAction) {
			return route.action(props)
		}
	}

}
