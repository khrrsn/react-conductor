import { RouterContext } from './RouterContext'
import { ErrorHandler } from './Router/ErrorHandler'

function getContext(props, state) {
	return {
		location: state.location,
		staticContext: props.staticContext,
		router: props.router,
		errorHandler: props.errorHandler || ErrorHandler
	}
}

export class RouteHandler extends React.Component {

	state = {
		location: null,
		_mounted: false
	}

	router = null

	constructor(props) {
		super(props)

		this._isMounted = false
		this._pending = null

		this.props.router.subscribe(({ pathname: location }) => {
			if(this._isMounted) {
				this.setState({ location })
			} else {
				this._pending = { location }
			}
		})
	}

	componentDidMount() {
		this._isMounted = true

		if(!this._pending.isNil) {
			this.setState(this._pending)
			this._pending = null
		}
	}

	render() {
		const context = getContext(this.props, this.state)

		return <RouterContext.Provider value={context}>
			{this.props.children || null}
		</RouterContext.Provider>
	}

}
