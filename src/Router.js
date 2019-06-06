import { Middleware } from './Router/Middleware'
import pathToRegexp from 'path-to-regexp'

export class Router {

	routes = [ ]
	patterns = { }
	namedRoutes = { }
	middleware = { }
	pathToRegexp = pathToRegexp
	listeners = [ ]

	isNode = false
	isBrowser = true

	isComponent = false
	isAction = false

	_scope = [
		{
			prefix: '/',
			middleware: new Middleware
		}
	]

	constructor() {
		this.isNode = (typeof process !== 'undefined') && (process.release.name === 'node')
		this.isBrowser = !this.isNode

		if(this.isBrowser) {
			window.addEventListener('popstate', this._stateChange, false)
		}
	}

	get _activeScope() {
		return this._scope[this._scope.length - 1]
	}

	get _scopedAction() {
		return this._activeScope.action
	}

	get _scopedPrefix() {
		return this._activeScope.prefix
	}

	get _scopedRoutes() {
		const scope = this._activeScope

		return scope.routes || this.routes
	}

	build(name, params = void 0) {
		const route = this.namedRoutes[name]

		if(route.isNil) {
			throw new Error('Route not found.')
		}

		let path = route.path

		if(!params.isNil) {
			for(const [ name, value ] of Object.entries(params)) {
				path = path.replace(new RegExp(`:${name}`), value)
			}
		}

		return path.toLowerCase()
	}

	_stateChange = e => {
		e.preventDefault()

		return this.navigate()
	}

	handle = (url, event = null) => {
		if(!event.isNil) {
			event.preventDefault()
		}

		return this.update(url)
	}

	handleRoute(route, ...args) {
		return this.update(this.build(route, ...args))
	}

	update(path) {
		window.history.pushState({ }, '', path)

		return this.navigate()
	}

	group(options = { }, callback) {
		if(typeof options === 'function') {
			callback = options
			options = { }
		}

		let prefix = this._joinPath(this._scopedPrefix, this._normalizePathComponent(options.prefix || '/'))

		const scope = {
			...options,
			prefix,
			middleware: this._compileMiddleware()
		}

		this._scope.push(scope)
		callback(this)
		this._scope.pop()

		return this
	}

	layout(path, callback) {
		const route = this.add(`${path}/*`)
		const routes = [ ]

		this.group({ prefix: path, routes }, callback)

		route.routes = routes
		route.type = 'layout'

		return route
	}

	add(pathname, component) {
		pathname = this._compilePath(pathname)
		const params = [ ]

		const route = {
			path: pathname,
			regex: pathToRegexp(pathname, params),
			params: params,
			middleware: this._compileMiddleware()
		}

		route.as = this._as.bind(this, route)
		route.component = this._component.bind(this, route)
		route.action = this._action.bind(this, route)
		route.use = this._use.bind(this, route)

		if(component) {
			this._component(route, component)
		}

		this._scopedRoutes.push(route)

		return route
	}

	use(...args) {
		for(const middleware of args) {
			this._scopedAction.middleware.use(this.resolveMiddleware(middleware))
		}

		return this
	}

	subscribe(callback) {
		this.listeners.push(callback)

		callback({ ...window.location })
	}

	match(path, routes = this.routes) {
		for(const route of routes) {
			const match = route.regex.exec(path)

			if(match.isNil) {
				continue
			} else if(route.type === 'layout') {
				const nestedMatch = this.match(path, route.routes)

				if(nestedMatch.isNil) {
					continue
				}
			}

			const [ url, ...values ] = match

			return {
				path,
				route,
				params: route.params.reduce((memo, key, index) => {
					memo[key.name] = values[index]
					return memo
				}, { })
			}
		}

		return undefined
	}

	_as(route, name) {
		this.namedRoutes[name] = route
		route.name = route

		return route
	}

	_component(route, component) {
		route.component = component
		route.isComponent = true
		route.isAction = false

		return route
	}

	_action(route, action) {
		route.action = action
		route.isAction = true
		route.isComponent = false

		return route
	}

	_use(route, ...args) {
		for(const middleware of args) {
			route.middleware.use(this.resolveMiddleware(middleware))
		}
	}

	_joinPath(...args) {
		const paths = args.filter(path => !path.isNil)

		return paths.join('/').replace(/\/+/g, '/')
	}

	_normalizePathComponent(component) {
		component = component.trim().replace(/^\//, '')

		if(component.length === 0) {
			return '/'
		}

		return component
	}

	_compilePath(pathname) {
		pathname = this._normalizePathComponent(pathname)
		const fullPath = this._joinPath('/', this._scopedPrefix, pathname)

		return fullPath.replace('*', '(.*)').replace(/:([a-z0-0_\-.]+)/g, (param, name) => {
			const pattern = this.patterns[name]

			if(pattern.isNil) {
				return param
			} else {
				return `${param}(${pattern})`
			}
		})
	}

	_compileMiddleware() {
		const middleware = new Middleware
		const scope = this._activeScope

		if(scope.middleware) {
			middleware.use(...scope.middleware.callbacks)
		}

		return middleware
	}

	navigate() {
		const page = { ...window.location }

		for(const callback of this.listeners) {
			callback(page)
		}
	}

	registerMiddleware(name, middleware) {
		this.middleware[name] = middleware
	}

	resolveMiddleware(middleware) {
		if(typeof middleware === 'function') {
			return middleware
		}

		if(this.middleware[middleware].isNil) {
			throw new Error(`Unknown middleware alias: ${middleware}`)
		}

		return this.middleware[middleware]
	}

}
