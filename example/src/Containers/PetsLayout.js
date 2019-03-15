import { Switch } from '../../../lib/react-conductor'
import '../App/Pets'

export class PetsLayout extends React.Component {

	state = {
		pets: Pets.all()
	}

	render() {
		const { pets } = this.state

		return (
			<div>
				<h2>Pets Test</h2>
				<Switch routes={this.props.routes} pets={pets || [ ]} />
			</div>
		)
	}

}
