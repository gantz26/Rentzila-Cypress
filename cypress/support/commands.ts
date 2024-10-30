declare namespace Cypress {
    interface Chainable {
        getByTestId(testId: string): Chainable
    }
}

Cypress.Commands.add("getByTestId", (testId: string) => {
    return cy.get(`[data-testid="${testId}"]`)
})