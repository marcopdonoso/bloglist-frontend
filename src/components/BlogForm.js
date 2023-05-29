import { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ createBlog }) => {
	const [title, setTitle] = useState('')
	const [author, setAuthor] = useState('')
	const [url, setUrl] = useState('')

	const addBlog = event => {
		event.preventDefault()
		const blogObject = {
			title: title,
			author: author,
			url: url,
		}
		createBlog(blogObject)
		setTitle('')
		setAuthor('')
		setUrl('')
	}

	return (
		<form onSubmit={addBlog}>
			<div>
				title:
				<input
					id="title"
					type="text"
					name="Title"
					value={title}
					onChange={({ target }) => setTitle(target.value)}
				/>
			</div>
			<div>
				author:
				<input
					id="author"
					type="text"
					name="Author"
					value={author}
					onChange={({ target }) => setAuthor(target.value)}
				/>
			</div>
			<div>
				url:
				<input
					id="url"
					type="url"
					name="Url"
					value={url}
					onChange={({ target }) => setUrl(target.value)}
				/>
			</div>
			<button id="create-button" type="submit">
				create
			</button>
		</form>
	)
}

BlogForm.propTypes = {
	createBlog: PropTypes.func.isRequired,
}

export default BlogForm
