import { Route } from '../../../lib/react-conductor'

export class Pets extends React.Component {

	render() {
		const { pets } = this.props

		return (
			<div>
				<h2>Pets</h2>
				<ul>{pets.map(pet => (
					<li key={pet.id}>
						<Route name="pets.show" pet={pet.id}>{pet.name}</Route>
					</li>
				))}</ul>
			</div>
		)
	}

}
