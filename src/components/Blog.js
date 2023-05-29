import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, addLike, user, removeBlog }) => {
	const [visible, setVisble] = useState(false)

	const blogStyle = {
		paddingTop: 10,
		paddingLeft: 2,
		border: 'solid',
		borderWidth: 1,
		marginBottom: 5,
	}

	const toggleVisibility = () => {
		setVisble(!visible)
	}

	const likeHandler = () => {
		blog.likes = blog.likes + 1
		addLike(blog)
	}

	const removeHandler = () => {
		removeBlog(blog)
	}

	return (
		<div className="blog" style={blogStyle}>
			<div>
				{blog.title} {blog.author}{' '}
				<button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
			</div>
			<div
				className="togglableContent"
				style={{ display: visible ? '' : 'none' }}
			>
				{blog.url} <br />
				likes {blog.likes}{' '}
				<button id="like-button" onClick={likeHandler}>
					like
				</button>{' '}
				<br />
				{blog.user.username} <br />
				<button
					id="remove-button"
					style={{
						display: user.username === blog.user.username ? '' : 'none',
					}}
					onClick={removeHandler}
				>
					remove
				</button>
			</div>
		</div>
	)
}

Blog.propTypes = {
	blog: PropTypes.object.isRequired,
	addLike: PropTypes.func.isRequired,
	user: PropTypes.object.isRequired,
	removeBlog: PropTypes.func.isRequired,
}

export default Blog
