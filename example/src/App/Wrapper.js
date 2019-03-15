import './style.css'

import { RouteHandler, Switch, Router } from '../../../lib/react-conductor'
import './Routes'

export class Wrapper extends React.Component {

	constructor(...args) {
		super(...args)

		this.router = new Router()
		Routes(this.router)
	}

	render() {
		return (
			<RouteHandler router={this.router}>
				<div className="wrapper">
					<Switch routes={this.router.routes} />
				</div>
			</RouteHandler>
		)
	}

}
