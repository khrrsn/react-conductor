import { RouterContext } from './RouterContext'

export function Link({ to: url, children, ...props }) {
	return (
		<RouterContext.Consumer>
			{({ router }) => {
				return <a href={url} onClick={router.handle.bind(null, url)} {...props}>{children}</a>
			}}
		</RouterContext.Consumer>
	)
}
