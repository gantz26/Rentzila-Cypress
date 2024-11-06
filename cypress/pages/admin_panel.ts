class AdminPanel {
    get adminTitle() {
        return cy.get('[class*="AdminLayout_title"]');
    }

    get inputWrapper() {
        return cy.getByTestId("inputWrapper");
    }

    get unitsStatusWrapper() {
        return cy.get('[class*="AdminUnits_status_wrapper"]');
    }

    get statusButtons() {
        return this.unitsStatusWrapper.find('[data-testid="statusBtns"]');
    }

    get searchInput() {
        return this.inputWrapper.find("input");
    }

    get adminRowContainer() {
        return cy.getByTestId("adminRowContainer");
    }

    get mainRows() {
        return cy.getByTestId("mainRow");
    }

    getRow(name: string) {
        return this.mainRows.filter((index, element) => {
            return element.innerText.includes(name);
        });
    }

    getModeratebutton(unit: Cypress.Chainable) {
        return unit.find('[data-testid="adminShowButton"]');
    }

    get navigatorContainer() {
        return cy.getByTestId("navigationContainer");
    }

    get announcementButton() {
        return this.navigatorContainer.find('[href="/admin/units/"]');
    }

    isOpen() {
        cy.window().its("document.readyState").should("eq", "complete");
        cy.url().should("include", "/admin/");
    }

    typeSearchInput(text: string) {
        this.searchInput.should("be.visible");
        this.searchInput.type(text);
    }

    clickAnnouncementButton() {
        this.announcementButton.should("be.visible");
        this.announcementButton.click();
    }

    clickStatusbutton(index: number) {
        this.statusButtons.then((buttons) => {
            cy.wrap(buttons[index]).click();
        });
    }

    clickModeratebutton(unit: Cypress.Chainable) {
        this.getModeratebutton(unit).click();
    }

    checkstatusButtons(buttonIndex: number) {
        this.statusButtons.each((element, index) => {
            cy.wrap(element).should("be.visible");
            cy.fixture("adminStatusButtons.json").then((data) => {
                cy.wrap(element).should("have.text", data.tabTitles[index]);
                if (index === buttonIndex) {
                    expect(element.attr("class")).to.contain("AdminUnits_active");
                }
                else {
                    expect(element.attr("class")).not.to.contain("AdminUnits_active");
                }
            });
        });
    }
}

export default new AdminPanel();