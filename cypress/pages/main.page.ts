class MainPage {
    open() {
        cy.visit("/");
    }

    get loginButton() {
        return cy.contains("Вхід");
    }

    get avatarBlock() {
        return cy.getByTestId("avatarBlock");
    }

    get addAnnouncementButton() {
        return cy.get("[href=\"/create-unit/\"]");
    }

    get telegramPopup() {
        return cy.getByTestId("completeTenderRectangle");
    }

    get telegramPopupCloseButton() {
        return this.telegramPopup.find("[data-testid=\"crossIcon\"]");
    }

    get profileContainer() {
        return cy.get("[class*=\"ProfileDropdownMenu_container\"]");
    }

    get profileUnitsItem() {
        return this.profileContainer.find("[data-testid=\"units\"]");
    }

    clickLoginButton() {
        this.loginButton.click();
    }

    clickAvatarBlock() {
        this.avatarBlock.click();
    }

    clikcProfileUnitsItem() {
        this.profileUnitsItem.click();
    }

    clickAddAnnouncementButton() {
        this.addAnnouncementButton.click();
    }

    closeTelegramPopup() {
        this.telegramPopup.then((element: JQuery<HTMLElement>) => {
            if (element.length > 0) {
                this.telegramPopupCloseButton.click();
            }
        });
    }
}

export default new MainPage();