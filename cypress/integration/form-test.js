//New Form test

beforeEach(function () {
    cy.visit('http://localhost:3002/');
})
describe('Test our form inputs', function () {
    it('adds text to name input', function () {
        cy.get('[data-cy="name"]')
            .type('have.value', "Andre")
        cy.get('[data-cy="email"]')
            .type('email@email.com')
            .should('have.value', 'email@email.com')
        cy.get('[data-cy="password"]')
            .type('123456789')
            .should('have.value', '12345678')
        cy.get("#positions")
            .select("Yard Work")
            .should("have.value", "Yard Work")
        cy.get('[type="checkbox"]')
            .check()
            .should("be.checked")
        cy.contains("Submit")
            .click();

    });
    // it("second IT test", function () {
    //     //test here
    // })
});


