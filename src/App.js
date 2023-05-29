import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notificacion from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'

const App = () => {
	const [blogs, setBlogs] = useState([])
	const [user, setUser] = useState(null)
	const [message, setMessage] = useState(null)
	const [messageType, setMessageType] = useState('')
	const blogFormRef = useRef()

	useEffect(() => {
		blogService.getAll().then(blogs => setBlogs(blogs))
	}, [])

	useEffect(() => {
		const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
		if (loggedUserJSON) {
			const user = JSON.parse(loggedUserJSON)
			setUser(user)
			blogService.setToken(user.token)
		}
	}, [])

	const handleLogin = async (username, password) => {
		try {
			const user = await loginService.login({ username, password })
			blogService.setToken(user.token)
			window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
			setUser(user)
		} catch (e) {
			setMessage('wrong username or password')
			setMessageType('error')
			setTimeout(() => {
				setMessage(null)
			}, 5000)
		}
	}

	const logoutHandler = () => {
		window.localStorage.clear()
		setUser(null)
	}

	const handleCreate = async blogObject => {
		try {
			blogFormRef.current.toggleVisibility()
			const returnedBlog = await blogService.create(blogObject)
			setBlogs(blogs.concat(returnedBlog))
			setMessage(
				`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`
			)
			setMessageType('')
			setTimeout(() => {
				setMessage(null)
			}, 5000)
		} catch (e) {
			setMessage(e.response.data.error)
			setMessageType('error')
			setTimeout(() => {
				setMessage(null)
			}, 5000)
		}
	}

	const addLike = async blog => {
		const updatedBlog = await blogService.update(blog, blog.id)
		setBlogs(
			blogs.map(blog => {
				if (blog.id === updatedBlog.id) {
					blog = updatedBlog
				}
				return blog
			})
		)
	}

	const removeBlog = async blog => {
		try {
			if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
				await blogService.remove(blog.id)
				setBlogs(blogs.filter(b => b.id !== blog.id))
			}
		} catch (exception) {
			setMessage(exception.response.data.error)
			setMessageType('error')
			setTimeout(() => {
				setMessage(null)
			}, 5000)
		}
	}

	if (user === null) {
		return (
			<div>
				<h2>log in to application</h2>
				<Notificacion message={message} messageType={messageType} />
				<LoginForm handleLogin={handleLogin} />
			</div>
		)
	}
	return (
		<div>
			<h2>blogs</h2>
			<Notificacion message={message} messageType={messageType} />
			<p>
				{user.name} logged in<button onClick={logoutHandler}>logout</button>
			</p>
			<h2>create new</h2>
			<Togglable buttonLabel="create new blog" ref={blogFormRef}>
				<BlogForm createBlog={handleCreate} />
			</Togglable>
			{blogs
				.sort((a, b) => {
					if (a.likes > b.likes) {
						return -1
					}
					if (a.likes < b.likes) {
						return 1
					}
					return 0
				})
				.map(blog => (
					<Blog
						key={blog.id}
						blog={blog}
						addLike={addLike}
						user={user}
						removeBlog={removeBlog}
					/>
				))}
		</div>
	)
}

export default App
