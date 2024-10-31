class ProfilePage {
    get emptyBlocktitle() {
        return cy.getByTestId("title");
    }

    get categoriesWrapper() {
        return cy.get('[class*="LeftSideOwnCabinet_categoriesWrapper"]');
    }

    get categoryVariants() {
        return cy.getByTestId("variants");
    }

    get myAnnouncementsVariant() {
        return this.categoryVariants.contains("Мої оголошення").parent('[data-testid="variant"]');
    }

    get myAnnouncementsTitle() {
        return cy.get('[class*="OwnerUnitsPage_title"]');
    }

    get tabs() {
        return cy.get('[role="tablist"]').find('[role="tab"]');
    }

    get unitListWrapper() {
        return cy.get('[class*="OwnerCabinetUnitsList_wrapper"]');
    }

    getUnitCard(name: string) {
        return cy.getByTestId("unitCard").filter((index, element) => {
            return element.innerText.includes(name);
        })
    }

    getUnitEditButton(unit: Cypress.Chainable) {
        return unit.contains("Редагувати");
    }

    isOpen() {
        cy.url().should("include", "/owner-units-page/");
    }

    clickTab(index: number) {
        this.tabs.then((tabs) => {
            cy.wrap(tabs[index]).click();
        });
    }

    clickEditButton(unit: Cypress.Chainable) {
        this.getUnitEditButton(unit).click();
    }

    checkTabs(tabIndex: number) {
        this.tabs.then((tabs) => {
            cy.wrap(tabs).each((tab, index) => {
                cy.wrap(tab).should("be.visible");
                cy.fixture("profileTabData.json").then((data) => {
                    cy.wrap(tab).should("have.text", data.tabTitles[index]);
                    if (index === tabIndex) {
                        expect(tab).to.have.attr("aria-selected", "true");
                    }
                    else {
                        expect(tab).to.have.attr("aria-selected", "false");
                    }
                });
            });
        });
    }
}

export default new ProfilePage();