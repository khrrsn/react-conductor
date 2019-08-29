import React from 'react'

export class ErrorHandler extends React.Component {

	componentDidMount() {
		const { error } = this.props

		console.error(error)
	}

	render() {
		return <h2>Error</h2>
	}

}
