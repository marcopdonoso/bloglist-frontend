import PropTypes from 'prop-types'

const Notificacion = ({ message, messageType }) => {
	if (message === null) {
		return null
	}

	const color = messageType === 'error' ? 'red' : 'green'

	return (
		<div
			id="message-board"
			style={{
				fontSize: '22px',
				color: `${color}`,
				backgroundColor: 'lightgrey',
				border: `3px solid ${color}`,
				borderRadius: '5px',
				padding: '0.7em',
				margin: '10px 0',
			}}
		>
			{message}
		</div>
	)
}

Notificacion.propTypes = {
	messageType: PropTypes.string.isRequired,
}

export default Notificacion
