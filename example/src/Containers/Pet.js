import { Route } from '../../../lib/react-conductor'
import '../App/Pets'
import '../App/Users'

export function Pet({ params }) {
	const pet = Pets.find(params.pet)
	const user = Users.find(pet.user_id)

	return (
		<p>{pet.name} is a {pet.species} and is owned by <Route name="users.show" user={user.id}>{user.name}</Route>.</p>
	)

}
