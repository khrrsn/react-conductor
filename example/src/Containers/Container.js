import { Route } from '../../../lib/react-conductor'

export class Container extends React.Component {

	render() {
		return (
			<div>
				<h1>Pet List</h1>
				<p>At least it is not a to-do list. Check out <Route name="users.index">users</Route> or <Route name="pets.index">pets</Route>.</p>
			</div>
		)
	}

}
