class LoginPage {
    get loginContainer() {
        return cy.getByTestId("authorizationContainer");
    }

    get emailInput() {
        return cy.get("#email");
    }

    get passwordInput() {
        return cy.get("#password");
    }

    get loginbutton() {
        return this.loginContainer.find("[type=\"submit\"]");
    }

    typeEmailInput(text: string) {
        this.emailInput.type(text, { log: false });
    }

    typePasswordInput(text: string) {
        this.passwordInput.type(text, { log: false });
    }

    clickLoginButton() {
        this.loginbutton.click();
    }
}

export default new LoginPage();