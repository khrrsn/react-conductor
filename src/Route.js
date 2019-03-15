import { Link } from './Link'
import { RouterContext } from './RouterContext'

export function Route({ name, children, className, ...params }) {
	return (
		<RouterContext.Consumer>
			{({ router }) => {
				const to = router.build(name, params)

				return <Link to={to} className={className}>{children}</Link>
			}}
		</RouterContext.Consumer>
	)
}
