import '../Containers/NotFound'
import '../Containers/Container'

import '../Containers/UsersLayout'
import '../Containers/Users'
import '../Containers/User'

import '../Containers/PetsLayout'
import '../Containers/Pets'
import '../Containers/Pet'

import './Middleware/PetsMiddleware'

export function Routes(routes) {
	routes.add('/').component(Container).as('home.show')

	routes.layout('users', routes => {
		routes.group({ prefix: 'test' }, routes => {
			routes.add('/', Users).as('users.index')
			routes.add(':user', User).as('users.show')
		})
	}).component(UsersLayout)

	routes.layout('pets', routes => {
		routes.add('/', Pets).as('pets.index')
		routes.add(':pet', Pet).as('pets.show')
	}).component(PetsLayout).use(PetsMiddleware)

	routes.add('*').action(NotFound)
}
