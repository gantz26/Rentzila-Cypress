class AuthAPI {
    createAdminAccessToken() {
        cy.get("@adminAccessToken").then((token) => {
            if (String(token) === "-1") {
                cy.request({
                    method: "POST",
                    url: "https://dev.rentzila.com.ua/api/auth/jwt/create/",
                    body: {
                        "email": Cypress.env("ADMIN_EMAIL"),
                        "password": Cypress.env("ADMIN_PASSWORD")
                    }
                }).then((response) => {
                    expect(response).to.have.property("status", 201);
                    cy.wrap(response.body.access).as("adminAccessToken");
                });
            }
        });
    }

    createUserAccessToken() {
        cy.get("@userAccessToken").then((token) => {
            if (String(token) === "-1") {
                cy.request({
                    method: "POST",
                    url: "https://dev.rentzila.com.ua/api/auth/jwt/create/",
                    body: {
                        "email": Cypress.env("USER_EMAIL"),
                        "password": Cypress.env("USER_PASSWORD")
                    }
                }).then((response) => {
                    expect(response).to.have.property("status", 201);
                    cy.wrap(response.body.access).as("userAccessToken");
                });
            }
        });
    }
}

export default new AuthAPI();