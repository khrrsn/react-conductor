require('@babel/polyfill')
import test from 'ava'
import { Router } from '../src/Router'

function NotFound() {
	return 'not-found'
}

function Layout({ path, route }) {
	return routeHandler(router.match(path, route.routes))
}

const router = new Router()
router.add('/pets').action(() => 'pets')
router.add('/pets/:id').action(({ params }) => `pets-${params.id}`)

router.layout('/users', routes => {
	routes.add('test').action(() => 'users-test')
}).component(Layout)

router.group({ prefix: 'foo' }, routes => {
	routes.add('bar', () => 'foo-bar')
	routes.add('baz', () => 'foo-baz')
})

router.add('*', NotFound)

function routeHandler(response) {
	if(!response) {
		return NotFound()
	}

	const { route, params, path } = response
	const props = { params, path, route }

	if(route.isComponent) {
		return route.component(props)
	}

	return route.action(props)
}

const tests = [
	[ '/pets', 'pets' ],
	[ '/pets/2', 'pets-2' ],
	[ '/pets/testing/test', 'not-found' ],
	[ '/users/test', 'users-test' ],
	[ '/users/test/', 'users-test' ],
	[ '/users/testing', 'not-found' ],
	[ '/foo', 'not-found' ],
	[ '/foo/bar', 'foo-bar' ],
	[ '/foo/baz', 'foo-baz' ],
	[ '/foo/not-found', 'not-found' ]
]

for(const [ path, response ] of tests) {
	test(`Route Test: ${path}`, t => {
		t.is(routeHandler(router.match(path)), response)
	})
}
