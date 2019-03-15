import { Switch } from '../../../lib/react-conductor'
import '../App/Users'
export class UsersLayout extends React.Component {

	state = {
		users: Users.all()
	}

	render() {
		const { users } = this.state

		return (
			<div>
				<h2>Users Test</h2>

				<Switch routes={this.props.route.routes} users={users || [ ]} />
			</div>
		)
	}

}
