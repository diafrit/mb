const mock = {
	email: 'teste@mb.com.br',
	name: 'João da Silva',
	cpf: '233.032.350-66',
	company: 'Mercado Bitcoin',
	cnpj: '15.606.219/0001-06',
	date: '1980-08-01',
	phone: '(11) 98765-4321',
	password: 'mercado123'
}

describe('User register', () => {
	const next = (s) => cy.get(`.register__step__${s} .btn__next`).click()
	const prev = (s) => cy.get(`.register__step__${s} .btn__previous`).click()

	it('Visits the app root url', () => {
		cy.visit('/')
	})

	it('Email and doc type', () => {
		cy.get('#register_0_email').type(mock.email)
		cy.get('#register_0_cpf').click()

		next(1)
	})

	it('CPF', () => {
		cy.get('#register_1_name').type(mock.name)
		cy.get('#register_1_document').type(mock.cpf)
		cy.get('#register_1_date').type(mock.date)
		cy.get('#register_1_phone').type(mock.phone)

		prev(2)
	})

	it('CNPJ', () => {
		cy.get('#register_0_cnpj').click()
		next(1)

		cy.get('#register_1_name').clear().type(mock.company)
		cy.get('#register_1_document').clear().type(mock.cnpj)
		cy.get('#register_1_date').type(mock.date)
		cy.get('#register_1_phone').type(mock.phone)

		next(2)
	})

	it('Password', () => {
		cy.get('#register_2_password').type(mock.password)

		next(3)
	})

	it('Check', () => {
		cy.get('#register_3_name').should('have.value', mock.company)
		cy.get('#register_3_document').should('have.value', mock.cnpj)
		cy.get('#register_3_date').should('have.value', mock.date)

		cy.get(`.register__step__4 .btn__register`).click()
	})
})
