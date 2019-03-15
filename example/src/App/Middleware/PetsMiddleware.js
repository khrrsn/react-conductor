import '../Pets'

export function PetsMiddleware(route, props, next) {
	props.pets = Pets.all()
	next()
}
