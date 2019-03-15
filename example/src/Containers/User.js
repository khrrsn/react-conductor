import { Route } from '../../../lib/react-conductor'
import '../App/Pets'
import '../App/Users'

export function User({ params }) {
	const user = Users.find(params.user)
	const pets = Pets.byUser(user.id)

	return (

		<div>
			<p>{user.name} has {pets.length} pets</p>
			<ul>{pets.map(pet => (
				<li key={pet.id}>
					<Route name="pets.show" pet={pet.id}>{pet.name}</Route>
				</li>
			))}</ul>
		</div>
	)
}
