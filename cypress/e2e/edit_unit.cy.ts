import mainPage from "../pages/main.page";
import loginPage from "../pages/login.page";
import profilePage from "../pages/profile.page";
import editUnit from "../pages/edit_unit";
import adminPanel from "../pages/admin_panel";
import adminUnit from "../pages/admin_unit";
import unitApi from "../helpers/unit.api";
import unitImagesApi from "../helpers/unit_images.api";
import authApi from "../helpers/auth.api";
import fakerHelper from "../helpers/faker_helper";

describe("Edit unit", () => {
    let unitName: string;

    beforeEach(() => {
        cy.wrap("-1").as("adminAccessToken");
        cy.wrap("-1").as("userAccessToken");
        authApi.createAccessToken();
        authApi.createAccessToken("admin");

        mainPage.open();
        mainPage.closeTelegramPopup();
        mainPage.telegramPopup.should("not.exist");

        unitName = fakerHelper.getRandomName();
        const unitPrice = fakerHelper.getRandomNumber();
        unitApi.createUnit(unitName, unitPrice).then((response) => {
            expect(response).to.have.property("status", 201);
            for (let i = 1; i <= 3; ++i) {
                let isMain = false;
                if (i === 1) isMain = true;
                unitImagesApi.uploadUnitIamge(Number(response.body.id), `photos/photo_${i}.jpg`, isMain).then((imageResponse) => {
                    expect(imageResponse).to.have.property("status", 201);
                });
            }
            unitApi.approveUnit(response.body.id, true).then((approveResponse) => {
                expect(approveResponse).to.have.property("status", 200);
            });
            cy.wrap(response.body.id).as("unitId");
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
        mainPage.clickProfileUnitsItem();

        profilePage.isOpen();
        profilePage.categoriesWrapper.should("be.visible");
        profilePage.categoryVariants.should("be.visible");
        profilePage.myAnnouncementsVariant.should("be.visible");
        profilePage.myAnnouncementsTitle.should("be.visible");
        profilePage.myAnnouncementsTitle.should("have.text", "Мої оголошення");
        profilePage.checkTabs(0);
        profilePage.getUnitCard(unitName).should("be.visible");
    });

    afterEach(() => {
        cy.get("@unitId").then((id) => {
            unitApi.deleteUnit(Number(id)).then((response) => {
                expect(response).to.have.property("status", 204);
            });
        });
    });

    it("Unit without changes", () => {
        profilePage.getUnitCard(unitName).then(unit => {
            profilePage.clickEditButton(cy.wrap(unit));
            editUnit.isOpen();
            cy.window().scrollTo("bottom");
            editUnit.clickCancelChangesButton();
        });

        profilePage.getUnitCard(unitName).then(unit => {
            cy.wrap(unit).should("be.visible");
            profilePage.clickEditButton(cy.wrap(unit));
            editUnit.isOpen();
            editUnit.announcementInput.should("not.have.value", "");
            editUnit.addressLabel.should("not.have.text", "Виберіть на мапі");
            editUnit.clickSaveButton();
            cy.url().should("include", "/complete/edit-unit/");
            editUnit.successfulEditMessage.should("be.visible");
            editUnit.successfulEditMessage.should("have.text", "Вашe оголошення успішно відредаговане");
            editUnit.viewAnnouncementsButton.should("be.visible");
            editUnit.viewAnnouncementsButton.should("have.text", "Переглянути в моїх оголошеннях");
            editUnit.clickViewAnnouncementsButton();
        });

        profilePage.getUnitCard(unitName).then(unit => {
            cy.wrap(unit).should("be.visible");
        });

        mainPage.clickAvatarBlock();
        mainPage.clickLogoutButton();
        mainPage.isOpen();
        
        mainPage.loginButton.should("be.visible");
        mainPage.clickLoginButton();
        loginPage.loginContainer.should("be.visible");
        loginPage.typeEmailInput(Cypress.env("ADMIN_EMAIL"));
        loginPage.typePasswordInput(Cypress.env("ADMIN_PASSWORD"));
        loginPage.clickLoginButton();
        loginPage.loginContainer.should("not.exist");
        cy.window().scrollTo("top");
        mainPage.avatarBlock.should("be.visible");
        mainPage.clickGear();

        adminPanel.isOpen();
        adminPanel.clickAnnouncementButton();
        adminPanel.adminTitle.should("be.visible");
        adminPanel.adminTitle.should("have.text", "Оголошення");
        adminPanel.checkstatusButtons(0);
        adminPanel.adminRowContainer.should("be.visible");

        adminPanel.typeSearchInput(unitName);
        adminPanel.getRow(unitName).should("be.visible");
    });

    it("Check \"Назва оголошення\" input field", () => {
        profilePage.getUnitCard(unitName).then(unit => {
            profilePage.clickEditButton(cy.wrap(unit));
            editUnit.isOpen();
        });

        editUnit.clearAnnouncementInput();
        editUnit.clickSaveButton();
        editUnit.announcementInputIsRed();
        editUnit.announcementError.should("be.visible");
        editUnit.announcementError.should("have.text", "Це поле обов’язкове");

        const invalidSymbols = "<>{};^";
        editUnit.typeAnnouncementInput(invalidSymbols);
        editUnit.announcementInput.should("have.value", "");

        const smallWord = fakerHelper.getRandomWord(9);
        editUnit.typeAnnouncementInput(smallWord);
        editUnit.clickSaveButton();
        editUnit.announcementInputIsRed();
        editUnit.announcementError.should("be.visible");
        editUnit.announcementError.should("have.text", "У назві оголошення повинно бути не менше 10 символів");

        const bigWord = fakerHelper.getRandomWord(101);
        editUnit.typeAnnouncementInput(bigWord);
        editUnit.clickSaveButton();
        editUnit.announcementInputIsRed();
        editUnit.announcementError.should("be.visible");
        editUnit.announcementError.should("have.text", "У назві оголошення може бути не більше 100 символів");

        editUnit.clearAnnouncementInput();
        const newUnitName = unitName + " test12345";
        editUnit.typeAnnouncementInput(newUnitName);
        editUnit.announcementError.should("not.exist");
        editUnit.clickSaveButton();
        cy.url().should("include", "/complete/edit-unit/");
        editUnit.successfulEditMessage.should("be.visible");
        editUnit.successfulEditMessage.should("have.text", "Вашe оголошення успішно відредаговане");
        editUnit.viewAnnouncementsButton.should("be.visible");
        editUnit.viewAnnouncementsButton.should("have.text", "Переглянути в моїх оголошеннях");
        editUnit.clickViewAnnouncementsButton();

        profilePage.isOpen();
        mainPage.clickAvatarBlock();
        mainPage.clickLogoutButton();
        mainPage.isOpen();
        
        mainPage.loginButton.should("be.visible");
        mainPage.clickLoginButton();
        loginPage.loginContainer.should("be.visible");
        loginPage.typeEmailInput(Cypress.env("ADMIN_EMAIL"));
        loginPage.typePasswordInput(Cypress.env("ADMIN_PASSWORD"));
        loginPage.clickLoginButton();
        loginPage.loginContainer.should("not.exist");
        cy.window().scrollTo("top");
        mainPage.avatarBlock.should("be.visible");
        mainPage.clickGear();

        adminPanel.isOpen();
        adminPanel.clickAnnouncementButton();
        adminPanel.adminTitle.should("be.visible");
        adminPanel.adminTitle.should("have.text", "Оголошення");
        adminPanel.checkstatusButtons(0);
        adminPanel.adminRowContainer.should("be.visible");
        adminPanel.clickStatusbutton(1);
        adminPanel.checkstatusButtons(1);

        adminPanel.typeSearchInput(newUnitName);
        adminPanel.getRow(newUnitName).should("be.visible");
    });

    it("Check \"Виробник транспортного засобу\" input field", () => {
        profilePage.getUnitCard(unitName).then(unit => {
            profilePage.clickEditButton(cy.wrap(unit));
            editUnit.isOpen();
            editUnit.addressLabel.invoke("text");
            editUnit.addressLabel.should("not.have.text", "Виберіть на мапі");
        });

        editUnit.clickManufacturerCloseButton();
        editUnit.clickSaveButton();
        editUnit.manufacturerInputIsRed();
        editUnit.manufacturerError.should("be.visible");
        editUnit.manufacturerError.should("have.text", "Це поле обов’язкове");

        const invalidSymbols = "<>{};^";
        editUnit.typeManufacturerSearchInput(invalidSymbols);
        editUnit.manufacturerInput.should("have.value", "");

        const word = fakerHelper.getRandomWord(10);
        editUnit.typeManufacturerSearchInput(word);
        editUnit.addNewManufacturerWrapper.should("be.visible");
        editUnit.addNewManufacturerWrapper.invoke("text").then(actualText => {
            expect(actualText.toLowerCase()).to.contain(`на жаль, виробника “${word.toLowerCase()}“ не знайдено в нашій базі. щоб додати виробника - зв\`яжіться із службою підтримки`);
        });

        editUnit.clearManufacturerInput();
        editUnit.typeManufacturerSearchInput(fakerHelper.getRandomWord(1));
        editUnit.manufacturerDropDownList.should("be.visible");
        editUnit.manufacturerDropDownListItems.first().then(item => {
            cy.wrap(item).should("be.visible");
            cy.wrap(item).invoke("text").then(text => {
                cy.wrap(text).as("newManufacturer");
            })
            cy.wrap(item).click();
        });
        editUnit.manufacturerCloseButton.should("be.visible");
        editUnit.clickSaveButton();

        cy.url().should("include", "/complete/edit-unit/");
        editUnit.successfulEditMessage.should("be.visible");
        editUnit.successfulEditMessage.should("have.text", "Вашe оголошення успішно відредаговане");
        editUnit.viewAnnouncementsButton.should("be.visible");
        editUnit.viewAnnouncementsButton.should("have.text", "Переглянути в моїх оголошеннях");
        editUnit.clickViewAnnouncementsButton();

        profilePage.isOpen();
        mainPage.clickAvatarBlock();
        mainPage.clickLogoutButton();
        mainPage.isOpen();
        
        mainPage.loginButton.should("be.visible");
        mainPage.clickLoginButton();
        loginPage.loginContainer.should("be.visible");
        loginPage.typeEmailInput(Cypress.env("ADMIN_EMAIL"));
        loginPage.typePasswordInput(Cypress.env("ADMIN_PASSWORD"));
        loginPage.clickLoginButton();
        loginPage.loginContainer.should("not.exist");
        cy.window().scrollTo("top");
        mainPage.avatarBlock.should("be.visible");
        mainPage.clickGear();

        adminPanel.isOpen();
        adminPanel.clickAnnouncementButton();
        adminPanel.adminTitle.should("be.visible");
        adminPanel.adminTitle.should("have.text", "Оголошення");
        adminPanel.checkstatusButtons(0);
        adminPanel.adminRowContainer.should("be.visible");
        adminPanel.clickStatusbutton(1);
        adminPanel.checkstatusButtons(1);

        adminPanel.typeSearchInput(unitName);
        adminPanel.getRow(unitName).then(unit => {
            cy.wrap(unit).should("be.visible");
            adminPanel.getModeratebutton(cy.wrap(unit)).should("be.visible");
            adminPanel.clickModeratebutton(cy.wrap(unit));
        });
        adminUnit.title.should("be.visible");
        adminUnit.title.should("have.text", "Модерація оголошення");
        cy.get("@newManufacturer").then(manufacturer => {
            adminUnit.manufacturerLabel.should("have.text", String(manufacturer));
        });
    });

    it("Check \"Назва моделі\" input field", () => {
        profilePage.getUnitCard(unitName).then(unit => {
            profilePage.clickEditButton(cy.wrap(unit));
            editUnit.isOpen();
            editUnit.addressLabel.invoke("text");
            editUnit.addressLabel.should("not.have.text", "Виберіть на мапі");
        });

        editUnit.clearModelInput();
        editUnit.modelInput.should("have.value", "");

        const invalidSymbols = "<>{};^";
        editUnit.typeModelInput(invalidSymbols);
        editUnit.modelInput.should("have.value", "");

        const bigWord = fakerHelper.getRandomWord(16);
        editUnit.typeModelInput(bigWord);
        editUnit.modelError.should("be.visible");
        editUnit.modelError.should("have.text", "У назві моделі може бути не більше 15 символів");

        editUnit.clearModelInput();
        const modelName = fakerHelper.getRandomName(1, 15);
        editUnit.typeModelInput(modelName);
        editUnit.clickSaveButton();

        cy.url().should("include", "/complete/edit-unit/");
        editUnit.successfulEditMessage.should("be.visible");
        editUnit.successfulEditMessage.should("have.text", "Вашe оголошення успішно відредаговане");
        editUnit.viewAnnouncementsButton.should("be.visible");
        editUnit.viewAnnouncementsButton.should("have.text", "Переглянути в моїх оголошеннях");
        editUnit.clickViewAnnouncementsButton();

        profilePage.isOpen();
        mainPage.clickAvatarBlock();
        mainPage.clickLogoutButton();
        mainPage.isOpen();
        
        mainPage.loginButton.should("be.visible");
        mainPage.clickLoginButton();
        loginPage.loginContainer.should("be.visible");
        loginPage.typeEmailInput(Cypress.env("ADMIN_EMAIL"));
        loginPage.typePasswordInput(Cypress.env("ADMIN_PASSWORD"));
        loginPage.clickLoginButton();
        loginPage.loginContainer.should("not.exist");
        cy.window().scrollTo("top");
        mainPage.avatarBlock.should("be.visible");
        mainPage.clickGear();

        adminPanel.isOpen();
        adminPanel.clickAnnouncementButton();
        adminPanel.adminTitle.should("be.visible");
        adminPanel.adminTitle.should("have.text", "Оголошення");
        adminPanel.checkstatusButtons(0);
        adminPanel.adminRowContainer.should("be.visible");
        adminPanel.clickStatusbutton(1);
        adminPanel.checkstatusButtons(1);

        adminPanel.typeSearchInput(unitName);
        adminPanel.getRow(unitName).then(unit => {
            cy.wrap(unit).should("be.visible");
            adminPanel.getModeratebutton(cy.wrap(unit)).should("be.visible");
            adminPanel.clickModeratebutton(cy.wrap(unit));
        });
        adminUnit.title.should("be.visible");
        adminUnit.title.should("have.text", "Модерація оголошення");
        adminUnit.modelLabel.should("have.text", modelName);
    });

    it("Check \"Технічні характеристики\" input field", () => {
        profilePage.getUnitCard(unitName).then(unit => {
            profilePage.clickEditButton(cy.wrap(unit));
            editUnit.isOpen();
            editUnit.addressLabel.invoke("text");
            editUnit.addressLabel.should("not.have.text", "Виберіть на мапі");
        });

        editUnit.clearTechDescriptionInput();
        editUnit.techDescriptionInput.should("have.value", "");
        editUnit.clickSaveButton();
        cy.url().should("include", "/complete/edit-unit/");
        editUnit.successfulEditMessage.should("be.visible");
        editUnit.successfulEditMessage.should("have.text", "Вашe оголошення успішно відредаговане");
        editUnit.viewAnnouncementsButton.should("be.visible");
        editUnit.viewAnnouncementsButton.should("have.text", "Переглянути в моїх оголошеннях");
        editUnit.clickViewAnnouncementsButton();

        profilePage.getUnitCard(unitName).then(unit => {
            profilePage.clickEditButton(cy.wrap(unit));
            editUnit.isOpen();
            editUnit.addressLabel.invoke("text");
            editUnit.addressLabel.should("not.have.text", "Виберіть на мапі");
        });

        const invalidSymbols = "<>{};^";
        editUnit.techDescriptionInput.should("be.visible");
        editUnit.typeTechDescriptionInput(invalidSymbols);
        editUnit.techDescriptionInput.should("have.value", "");

        const someWords = fakerHelper.getRandomWords(10);
        editUnit.typeTechDescriptionInput(someWords);
        editUnit.clickSaveButton();

        cy.url().should("include", "/complete/edit-unit/");
        editUnit.successfulEditMessage.should("be.visible");
        editUnit.successfulEditMessage.should("have.text", "Вашe оголошення успішно відредаговане");
        editUnit.viewAnnouncementsButton.should("be.visible");
        editUnit.viewAnnouncementsButton.should("have.text", "Переглянути в моїх оголошеннях");
        editUnit.clickViewAnnouncementsButton();

        profilePage.isOpen();
        mainPage.clickAvatarBlock();
        mainPage.clickLogoutButton();
        mainPage.isOpen();
        
        mainPage.loginButton.should("be.visible");
        mainPage.clickLoginButton();
        loginPage.loginContainer.should("be.visible");
        loginPage.typeEmailInput(Cypress.env("ADMIN_EMAIL"));
        loginPage.typePasswordInput(Cypress.env("ADMIN_PASSWORD"));
        loginPage.clickLoginButton();
        loginPage.loginContainer.should("not.exist");
        cy.window().scrollTo("top");
        mainPage.avatarBlock.should("be.visible");
        mainPage.clickGear();

        adminPanel.isOpen();
        adminPanel.clickAnnouncementButton();
        adminPanel.adminTitle.should("be.visible");
        adminPanel.adminTitle.should("have.text", "Оголошення");
        adminPanel.checkstatusButtons(0);
        adminPanel.adminRowContainer.should("be.visible");
        adminPanel.clickStatusbutton(1);
        adminPanel.checkstatusButtons(1);

        adminPanel.typeSearchInput(unitName);
        adminPanel.getRow(unitName).then(unit => {
            cy.wrap(unit).should("be.visible");
            adminPanel.getModeratebutton(cy.wrap(unit)).should("be.visible");
            adminPanel.clickModeratebutton(cy.wrap(unit));
        });
        adminUnit.title.should("be.visible");
        adminUnit.title.should("have.text", "Модерація оголошення");
        adminUnit.techDescriptionLabel.should("have.text", someWords);
    });

    it("Check \"Опис\" input field", () => {
        profilePage.getUnitCard(unitName).then(unit => {
            profilePage.clickEditButton(cy.wrap(unit));
            editUnit.isOpen();
            editUnit.addressLabel.invoke("text");
            editUnit.addressLabel.should("not.have.text", "Виберіть на мапі");
        });

        editUnit.clearDetailedDescriptionInput();
        editUnit.detailedDescriptionInput.should("have.value", "");
        editUnit.clickSaveButton();
        cy.url().should("include", "/complete/edit-unit/");
        editUnit.successfulEditMessage.should("be.visible");
        editUnit.successfulEditMessage.should("have.text", "Вашe оголошення успішно відредаговане");
        editUnit.viewAnnouncementsButton.should("be.visible");
        editUnit.viewAnnouncementsButton.should("have.text", "Переглянути в моїх оголошеннях");
        editUnit.clickViewAnnouncementsButton();

        profilePage.getUnitCard(unitName).then(unit => {
            profilePage.clickEditButton(cy.wrap(unit));
            editUnit.isOpen();
            editUnit.addressLabel.invoke("text");
            editUnit.addressLabel.should("not.have.text", "Виберіть на мапі");
        });

        const invalidSymbols = "<>{};^";
        editUnit.detailedDescriptionInput.should("be.visible");
        editUnit.typeDetailedDescriptionInput(invalidSymbols);
        editUnit.detailedDescriptionInput.should("have.value", "");

        const someWords = fakerHelper.getRandomWords(10);
        editUnit.typeDetailedDescriptionInput(someWords);
        editUnit.clickSaveButton();

        cy.url().should("include", "/complete/edit-unit/");
        editUnit.successfulEditMessage.should("be.visible");
        editUnit.successfulEditMessage.should("have.text", "Вашe оголошення успішно відредаговане");
        editUnit.viewAnnouncementsButton.should("be.visible");
        editUnit.viewAnnouncementsButton.should("have.text", "Переглянути в моїх оголошеннях");
        editUnit.clickViewAnnouncementsButton();

        profilePage.isOpen();
        mainPage.clickAvatarBlock();
        mainPage.clickLogoutButton();
        mainPage.isOpen();
        
        mainPage.loginButton.should("be.visible");
        mainPage.clickLoginButton();
        loginPage.loginContainer.should("be.visible");
        loginPage.typeEmailInput(Cypress.env("ADMIN_EMAIL"));
        loginPage.typePasswordInput(Cypress.env("ADMIN_PASSWORD"));
        loginPage.clickLoginButton();
        loginPage.loginContainer.should("not.exist");
        cy.window().scrollTo("top");
        mainPage.avatarBlock.should("be.visible");
        mainPage.clickGear();

        adminPanel.isOpen();
        adminPanel.clickAnnouncementButton();
        adminPanel.adminTitle.should("be.visible");
        adminPanel.adminTitle.should("have.text", "Оголошення");
        adminPanel.checkstatusButtons(0);
        adminPanel.adminRowContainer.should("be.visible");
        adminPanel.clickStatusbutton(1);
        adminPanel.checkstatusButtons(1);

        adminPanel.typeSearchInput(unitName);
        adminPanel.getRow(unitName).then(unit => {
            cy.wrap(unit).should("be.visible");
            adminPanel.getModeratebutton(cy.wrap(unit)).should("be.visible");
            adminPanel.clickModeratebutton(cy.wrap(unit));
        });
        adminUnit.title.should("be.visible");
        adminUnit.title.should("have.text", "Модерація оголошення");
        adminUnit.detailedDescriptionLabel.should("have.text", someWords);
    });

    it("Check \"Місце розташування технічного засобу\" functionality", () => {
        profilePage.getUnitCard(unitName).then(unit => {
            profilePage.clickEditButton(cy.wrap(unit));
            editUnit.isOpen();
            editUnit.addressLabel.invoke("text");
            editUnit.addressLabel.should("not.have.text", "Виберіть на мапі");
        });

        editUnit.addressLabel.invoke("text").then(text => {
            cy.wrap(text).as("oldAddress");
        });
        editUnit.clickAddAddressButton();
        editUnit.addressPopup.should("be.visible");
        editUnit.addressPopupMap.should("be.visible");
        editUnit.addressPopupLabel.should("be.visible");
        cy.wait(2000);
        editUnit.mapScaleDiv.invoke('attr', 'style').then((initialTransform) => {
            const initialMatch = initialTransform?.match(/scale\(([\d.]+)\)/);
            const initialScale = initialMatch && initialMatch[1] ? parseFloat(initialMatch[1]) : 1;

            editUnit.clickZoomIn();
            editUnit.mapScaleDiv.invoke('attr', 'style').should((newTransform) => {
                const newMatch = newTransform?.match(/scale\(([\d.]+)\)/);
                const newScale = newMatch && newMatch[1] ? parseFloat(newMatch[1]) : 1;
                expect(newScale).to.equal(initialScale * 2);
            });
        });

        cy.wait(2000);
        editUnit.mapScaleDiv.invoke('attr', 'style').then((initialTransform) => {
            const initialMatch = initialTransform?.match(/scale\(([\d.]+)\)/);
            const initialScale = initialMatch && initialMatch[1] ? parseFloat(initialMatch[1]) : 1;

            editUnit.clickZoomOut();
            editUnit.mapScaleDiv.invoke('attr', 'style').should((reducedTransform) => {
                const reducedMatch = reducedTransform?.match(/scale\(([\d.]+)\)/);
                const reducedScale = reducedMatch && reducedMatch[1] ? parseFloat(reducedMatch[1]) : 1;
                expect(reducedScale).to.equal(initialScale / 2);
            });
        });
        
        editUnit.selectNewAddress();
        cy.get("@oldAddress").then(oldAddress => {
            editUnit.addressPopupLabel.should("not.have.text", String(oldAddress));
            editUnit.addressPopupLabel.invoke("text").then(text => {
                cy.wrap(text).as("newAddress");
            });
        });
        editUnit.clickApproveAddressButton();
        editUnit.addressPopup.should("not.exist");
        editUnit.clickSaveButton();

        cy.url().should("include", "/complete/edit-unit/");
        editUnit.successfulEditMessage.should("be.visible");
        editUnit.successfulEditMessage.should("have.text", "Вашe оголошення успішно відредаговане");
        editUnit.viewAnnouncementsButton.should("be.visible");
        editUnit.viewAnnouncementsButton.should("have.text", "Переглянути в моїх оголошеннях");
        editUnit.clickViewAnnouncementsButton();

        profilePage.isOpen();
        mainPage.clickAvatarBlock();
        mainPage.clickLogoutButton();
        mainPage.isOpen();
        
        mainPage.loginButton.should("be.visible");
        mainPage.clickLoginButton();
        loginPage.loginContainer.should("be.visible");
        loginPage.typeEmailInput(Cypress.env("ADMIN_EMAIL"));
        loginPage.typePasswordInput(Cypress.env("ADMIN_PASSWORD"));
        loginPage.clickLoginButton();
        loginPage.loginContainer.should("not.exist");
        cy.window().scrollTo("top");
        mainPage.avatarBlock.should("be.visible");
        mainPage.clickGear();

        adminPanel.isOpen();
        adminPanel.clickAnnouncementButton();
        adminPanel.adminTitle.should("be.visible");
        adminPanel.adminTitle.should("have.text", "Оголошення");
        adminPanel.checkstatusButtons(0);
        adminPanel.adminRowContainer.should("be.visible");
        adminPanel.clickStatusbutton(1);
        adminPanel.checkstatusButtons(1);

        adminPanel.typeSearchInput(unitName);
        adminPanel.getRow(unitName).then(unit => {
            cy.wrap(unit).should("be.visible");
            adminPanel.getModeratebutton(cy.wrap(unit)).should("be.visible");
            adminPanel.clickModeratebutton(cy.wrap(unit));
        });
        adminUnit.title.should("be.visible");
        adminUnit.title.should("have.text", "Модерація оголошення");
        adminUnit.addressLabel.should("contain.text", "Київ, Україна, Київська область");
    });
});