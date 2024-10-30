import mainPage from "../pages/main.page";
import loginPage from "../pages/login.page";
import profilePage from "../pages/profile.page";
import unitApi from "../helpers/unit.api";
import unitImagesApi from "../helpers/unit_images.api";
import authApi from "../helpers/auth.api";
import { faker } from '@faker-js/faker';

describe("API tests", () => {
    it("Create API request for \"Create Unit\"", () => {
        cy.wrap("-1").as("adminAccessToken");
        cy.wrap("-1").as("userAccessToken");
        authApi.createUserAccessToken();
        
        mainPage.open();
        mainPage.closeTelegramPopup();
        mainPage.telegramPopup.should("not.exist");

        cy.wrap(faker.word.noun({ length: { min: 10, max: 20} })).as("unitName").then(unitName => {
            unitApi.createUnit(unitName, faker.number.int({ min: 1000, max: 1000000 })).then((response) => {
                expect(response).to.have.property("status", 201);
                cy.wrap(response.body.id).as("unitId");
            });
        });

        cy.get("@unitId").then((id) => {
            for (let i = 1; i <= 3; ++i) {
                let isMain = false;
                if (i === 1) isMain = true;
                unitImagesApi.uploadUnitIamge(Number(id), `photos/photo_${i}.jpg`, isMain).then((response) => {
                    expect(response).to.have.property("status", 201);
                });
            }
        });

        mainPage.clickLoginButton();
        loginPage.loginContainer.should("be.visible");
        loginPage.typeEmailInput(Cypress.env("USER_EMAIL"));
        loginPage.typePasswordInput(Cypress.env("USER_PASSWORD"));
        loginPage.clickLoginButton();
        loginPage.loginContainer.should("not.exist");
        cy.window().scrollTo("top");
        mainPage.avatarBlock.should("be.visible");

        mainPage.clickAvatarBlock();
        mainPage.profileContainer.should("be.visible");
        mainPage.profileUnitsItem.should("be.visible");
        mainPage.clikcProfileUnitsItem();

        profilePage.isOpen();
        profilePage.categoriesWrapper.should("be.visible");
        profilePage.categoryVariants.should("be.visible");
        profilePage.myAnnouncementsVariant.should("be.visible");
        profilePage.myAnnouncementsTitle.should("be.visible");
        profilePage.myAnnouncementsTitle.should("have.text", "Мої оголошення");
        profilePage.checkTabs(0);
        profilePage.clickTab(2);
        profilePage.checkTabs(2);
        profilePage.unitListWrapper.should("be.visible");
        
        cy.get("@unitName").then(unitName => {
            profilePage.getUnitCard(String(unitName)).then((element) => {
                cy.wrap(element).should("be.visible");
                cy.get("@unitId").then((id) => {
                    unitApi.deleteUnit(Number(id)).then((response) => {
                        expect(response).to.have.property("status", 204);
                    });
                });
                cy.reload();
                profilePage.emptyBlocktitle.should("be.visible");
                profilePage.emptyBlocktitle.should("have.text", "На жаль, у Вас поки немає поданих оголошень");
            });
        });
    });
});