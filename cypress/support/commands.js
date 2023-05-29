// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('login', ({ username, password }) => {
	cy.request({
		method: 'POST',
		url: `${Cypress.env('BACKEND')}/login`,
		body: { username, password },
	}).then(({ body }) => {
		localStorage.setItem('loggedBlogappUser', JSON.stringify(body))
		cy.visit('')
	})
})

Cypress.Commands.add('createBlog', ({ title, author, url }) => {
	cy.request({
		method: 'POST',
		url: `${Cypress.env('BACKEND')}/blogs`,
		body: { title, author, url },
		headers: {
			Authorization: `bearer ${
				JSON.parse(localStorage.getItem('loggedBlogappUser')).token
			}`,
		},
	})
	cy.visit('')
})

Cypress.Commands.add('createUser', ({ username, name, password }) => {
	cy.request('POST', `${Cypress.env('BACKEND')}/users`, {
		username,
		name,
		password,
	})
	cy.visit('')
})

Cypress.Commands.add('likeBlog', ({ blogPosition, likes }) => {
	cy.intercept('PUT', '*/blogs/*').as('likeBlog')
	cy.get('.blog').eq(blogPosition).contains('view').click()
	for (let index = 0; index < likes; index++) {
		cy.get('.blog').eq(blogPosition).find('#like-button').click()
	}
	for (let index = 0; index < likes; index++) {
		cy.wait('@likeBlog')
	}
})
