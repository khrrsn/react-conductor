export class Middleware {

	callbacks = [ ]

	get exists() {
		return this.callbacks.length > 0
	}

	use(...callbacks) {
		for(const callback of callbacks) {
			if(typeof callback !== 'function') {
				console.warn('callback is not a function, ignoring.')
				continue
			}

			this.callbacks.push(callback)
		}
	}

	apply(args, done) {
		return this.constructor.reduce([ ...this.callbacks ], done, ...args)
	}

	static reduce(stack, final, ...params) {
		if(stack.length === 0) {
			return final()
		}

		const current = stack.shift()

		function done(response = void 0) {
			if(response !== void 0) {
				return final(response)
			}

			return Middleware.reduce(stack, final, ...params)
		}

		return current(...([ ...params, done ]))
	}

}
