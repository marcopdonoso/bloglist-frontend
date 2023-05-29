import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import Blog from './Blog'
import { fireEvent, render } from '@testing-library/react'

describe('< Blog /> ', () => {
	let component
	let addlikeMock

	beforeEach(() => {
		const blog = {
			title: 'test title',
			author: 'test author',
			url: 'http://test.url',
			likes: 0,
			user: { username: 'test_username' },
		}

		const user = {
			username: 'test_username',
		}

		addlikeMock = jest.fn()
		const removeBlogMock = jest.fn()

		component = render(
			<Blog
				blog={blog}
				addLike={addlikeMock}
				user={user}
				removeBlog={removeBlogMock}
			/>
		)
	})

	test('only renders title and author by default', () => {
		const togglableContentDiv =
			component.container.querySelector('.togglableContent')
		expect(togglableContentDiv).toHaveStyle('display: none')
	})

	test('show URL and Likes by clicking once the view/hide button', () => {
		const button = component.getByText('view')
		fireEvent.click(button)

		const togglableContentDiv =
			component.container.querySelector('.togglableContent')
		expect(togglableContentDiv).not.toHaveStyle('display: none')
	})

	test('two clicks on like button calls twice to addLike handler function', () => {
		const button = component.getByText('like')
		fireEvent.click(button)
		fireEvent.click(button)

		expect(addlikeMock).toBeCalledTimes(2)
	})
})
