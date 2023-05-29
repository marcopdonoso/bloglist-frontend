import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'
import { fireEvent, render } from '@testing-library/react'

describe('< BlogForm />', () => {
	test('form calls to event handler with right details when a new blog is created', () => {
		const mockHandler = jest.fn()

		const component = render(<BlogForm createBlog={mockHandler} />)

		const form = component.container.querySelector('form')

		const title = component.container.querySelector('#title')
		const author = component.container.querySelector('#author')
		const url = component.container.querySelector('#url')

		fireEvent.change(title, {
			target: { value: 'test title' },
		})
		fireEvent.change(author, {
			target: { value: 'test author' },
		})
		fireEvent.change(url, {
			target: { value: 'http://url.test' },
		})

		fireEvent.submit(form)

		expect(mockHandler.mock.calls[0][0]).toStrictEqual({
			title: 'test title',
			author: 'test author',
			url: 'http://url.test',
		})
	})
})
