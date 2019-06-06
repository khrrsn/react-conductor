import { RouterContext } from './RouterContext'

export class Link extends React.Component {

	isModifiedEvent(event) {
		return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
	}

	handleClick(event, context, props) {
		if (
			!event.defaultPrevented
			&& event.button === 0
			&& (!this.props.target || this.props.target === "_self")
			&& !this.isModifiedEvent(event)
		) {
			event.preventDefault()

			context.router.update(this.props.to)
		}
	}

	render() {
		const { to: url, children, ...props } = this.props

		return (
			<RouterContext.Consumer>
				{context => {
					return <a href={url} onClick={event => this.handleClick(event, context)} {...props}>
						{children}
					</a>
				}}
			</RouterContext.Consumer>
		)
	}

}
