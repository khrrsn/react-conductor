import { Route } from '../../../lib/react-conductor'

export class Users extends React.Component {

	render() {
		const { users } = this.props

		return (
			<div>
				<h2>Users</h2>
				<ul>
					{users.map(user =>
						<li key={user.id}>
							<Route name="users.show" user={user.id}>{user.name}</Route>
						</li>
					)}
				</ul>
			</div>
		)
	}

}
