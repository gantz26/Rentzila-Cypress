import { getAuthCreateEndpoint } from "./api";

class AuthAPI {
    createAccessToken(userType: string = "user") {
        const accessTokenAlias = userType === "admin" ? "adminAccessToken" : "userAccessToken";
        const email = Cypress.env(userType === "admin" ? "ADMIN_EMAIL" : "USER_EMAIL");
        const password = Cypress.env(userType === "admin" ? "ADMIN_PASSWORD" : "USER_PASSWORD");

        cy.get(`@${accessTokenAlias}`).then((token) => {
            if (String(token) === "-1") {
                cy.request({
                    method: "POST",
                    url: getAuthCreateEndpoint(),
                    body: {
                        "email": email,
                        "password": password
                    }
                }).then((response) => {
                    expect(response).to.have.property("status", 201);
                    cy.wrap(response.body.access).as(`${accessTokenAlias}`);
                });
            }
        });
    }
}

export default new AuthAPI();