export const Users = {
	users: [
		{ id: 1, name: 'Bob' },
		{ id: 2, name: 'Joe' },
	],

	all() {
		return this.users
	},

	find(id) {
		return this.users.find(user => String(user.id) === String(id))
	}
}
