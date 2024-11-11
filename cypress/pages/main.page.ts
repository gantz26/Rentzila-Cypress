class MainPage {
    open() {
        cy.visit("/");
    }

    isOpen() {
        cy.window().its("document.readyState").should("eq", "complete");
        this.mainSectionTitle.should("be.visible");
    }

    get gear() {
        return cy.getByTestId("superuserIcon_Navbar");
    }

    get mainSectionTitle() {
        return cy.get('[class*="HeroSection_title"]');
    }

    get loginButton() {
        return cy.contains("Вхід");
    }

    get avatarBlock() {
        return cy.getByTestId("avatarBlock");
    }

    get addAnnouncementButton() {
        return cy.get('[href="/create-unit/"]');
    }

    get telegramPopup() {
        return cy.getByTestId("completeTenderRectangle");
    }

    get telegramPopupCloseButton() {
        return this.telegramPopup.find('[data-testid="crossIcon"]');
    }

    get profileContainer() {
        return cy.get('[class*="ProfileDropdownMenu_container"]');
    }

    get profileUnitsItem() {
        return this.profileContainer.find('[data-testid="units"]');
    }

    get logoutButton() {
        return this.profileContainer.find('[data-testid="logout"]');
    }

    clickLoginButton() {
        this.loginButton.click();
    }

    clickAvatarBlock() {
        this.avatarBlock.should("be.visible");
        this.avatarBlock.click();
    }

    clickProfileUnitsItem() {
        this.profileUnitsItem.click();
    }

    clickLogoutButton() {
        this.logoutButton.should("be.visible");
        this.logoutButton.click();
    }

    clickAddAnnouncementButton() {
        this.addAnnouncementButton.click();
    }

    clickGear() {
        this.gear.should("be.visible");
        this.gear.click();
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