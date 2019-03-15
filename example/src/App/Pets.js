export const Pets = {
	pets: [
		{ id: 1, user_id: 1, name: 'Tobi', species: 'Ferret' },
		{ id: 2, user_id: 1, name: 'Loki', species: 'Ferret' },
		{ id: 3, user_id: 1, name: 'Jane', species: 'Ferret' },
		{ id: 4, user_id: 2, name: 'Manny', species: 'Cat' },
		{ id: 5, user_id: 2, name: 'Luna', species: 'Cat' }
	],

	all() {
		return this.pets
	},

	find(id) {
		return this.pets.find(pet => String(pet.id) === String(id))
	},

	byUser(id) {
		return this.pets.filter(pet => pet.user_id === id)
	}

}
