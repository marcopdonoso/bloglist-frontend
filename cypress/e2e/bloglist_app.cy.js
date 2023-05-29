describe('Blog app', () => {
	beforeEach(() => {
		cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
		const user = {
			username: 'testinguser',
			name: 'Testing User',
			password: '123',
		}
		cy.createUser(user)
	})
	it('Login form is shown', () => {
		cy.contains('log in to application')
		cy.get('#username')
		cy.get('#password')
	})
	describe('Login', () => {
		it('succeeds with correct credentials', () => {
			cy.get('#username').type('testinguser')
			cy.get('#password').type('123')
			cy.get('#login-button').click()
			cy.contains('Testing User logged in')
		})
		it('fails with wrong credentials', () => {
			cy.get('#username').type('testinguser')
			cy.get('#password').type('wrong')
			cy.get('#login-button').click()
			cy.get('#message-board')
				.should('contain', 'wrong username or password')
				.and('have.css', 'border', '3px solid rgb(255, 0, 0)')
		})
	})
	describe('When logged in', () => {
		beforeEach(() => {
			cy.login({ username: 'testinguser', password: '123' })
		})
		it('a blog can be created', () => {
			cy.contains('create new blog').click()
			cy.get('#title').type('This is a test blog Title for a Blog')
			cy.get('#author').type('Testing Author')
			cy.get('#url').type('http://test.url')
			cy.get('#create-button').click()
			cy.get('#message-board')
				.should(
					'contain',
					'a new blog This is a test blog Title for a Blog by Testing Author added'
				)
				.and('have.css', 'border', '3px solid rgb(0, 128, 0)')
			cy.get('.blog').contains('This is a test blog Title for a Blog')
		})
		describe('a blog exists', () => {
			beforeEach(() => {
				cy.createBlog({
					title: 'Test Title',
					author: 'Test Author',
					url: 'http://test.url',
				})
			})
			it('a user can like a blog', () => {
				cy.get('.blog').contains('view').click()
				cy.get('button').contains('like').click()
				cy.get('.togglableContent').contains('likes 1')
			})
			it('a user that creates a blog can remove it', () => {
				cy.get('.blog').contains('view').click()
				cy.get('#remove-button').click()
				cy.on('window:confirm', () => true)
				cy.get('.blog').should('not.exist')
			})
			it('other users can not remove the blog', () => {
				cy.createUser({
					username: 'anotheruser',
					name: 'Another User',
					password: '123',
				})
				cy.login({ username: 'anotheruser', password: '123' })
				cy.get('.blog').contains('view').click()
				cy.get('#remove-button').should('not.be.visible')
			})
			it('blogs are ordered according to likes', () => {
				cy.createBlog({
					title: 'Test Title',
					author: 'Test Author',
					url: 'http://test.url',
				})
			})
		})
		describe('several blogs exists', () => {
			beforeEach(() => {
				cy.createBlog({
					title: 'The title with the second most likes',
					author: 'Test Author',
					url: 'http://test.url',
				})
				cy.createBlog({
					title: 'The title with the most likes',
					author: 'Test Author',
					url: 'http://test.url',
				})
				cy.createBlog({
					title: 'The title with the third most likes',
					author: 'Test Author',
					url: 'http://test.url',
				})
			})
			it.only('blogs are ordered according to likes', () => {
				cy.likeBlog({ blogPosition: 0, likes: 3 })
				cy.likeBlog({ blogPosition: 1, likes: 5 })
				cy.likeBlog({ blogPosition: 2, likes: 2 })
				cy.get('.blog').eq(0).contains('The title with the most likes')
				cy.get('.blog').eq(1).contains('The title with the second most likes')
				cy.get('.blog').eq(2).contains('The title with the third most likes')
			})
		})
	})
})
