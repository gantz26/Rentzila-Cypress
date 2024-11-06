class EditUnit {
    get editUnitTitle() {
        return cy.get('[class*="CreateEditFlowLayout_title"]');
    }

    get cancelChangesButton() {
        return cy.getByTestId("prevButton");
    }

    get saveButton() {
        return cy.getByTestId("nextButton");
    }

    get announcementWrapper() {
        return cy.getByTestId("customInputWrapper").first();
    }

    get modelWrapper() {
        return cy.getByTestId("customInputWrapper").last();
    }

    get techDescriptionWrapper() {
        return cy.getByTestId("wrapper-customTextAriaDescription").first();
    }

    get detailedDescriptionWrapper() {
        return cy.getByTestId("wrapper-customTextAriaDescription").last();
    }

    get techDescriptionInput() {
        return this.techDescriptionWrapper.find('textarea');
    }

    get detailedDescriptionInput() {
        return this.detailedDescriptionWrapper.find('textarea');
    }

    get announcementInput() {
        return this.announcementWrapper.find("input");
    }

    get announcementError() {
        return this.announcementWrapper.find('[data-testid="descriptionError"]');
    }

    get modelInput() {
        return this.modelWrapper.find("input");
    }

    get modelError() {
        return this.modelWrapper.find('[data-testid="descriptionError"]');
    }

    get manufacturerWrapper() {
        return cy.getByTestId("div-wrapper-selectManufacturer");
    }

    get manufacturerSearchDiv() {
        return this.manufacturerWrapper.find('[class*="CustomSelectWithSearch_searchResult"]');
    }

    get manufacturerInput() {
        return this.manufacturerWrapper.find('input');
    }

    get selectedManufacturerSearch() {
        return this.manufacturerWrapper.find('[data-testid="div-service-customSelectWithSearch"]');
    }

    get manufacturerCloseButton() {
        return this.manufacturerWrapper.find('[data-testid="closeButton"]');
    }

    get manufacturerError() {
        return this.manufacturerWrapper.find('[class*="CustomSelectWithSearch_errorTextVisible"]');;
    }

    get manufacturerDropDownList() {
        return cy.get('[class*="CustomSelectWithSearch_searchedServicesCat_wrapper"]');
    }

    get manufacturerDropDownListItems() {
        return cy.getByTestId("item-customSelectWithSearch");
    }

    get addNewManufacturerWrapper() {
        return cy.get('[class*="AddNewItem_wrapper"]');
    }

    get addressLabel() {
        return cy.getByTestId("mapLabel");
    }

    get addAddressButton() {
        return cy.get('[class*="AddressSelectionBlock_locationBtn"]');
    }

    get addressPopup() {
        return cy.getByTestId("div-mapPopup");
    }

    get addressPopupLabel() {
        return this.addressPopup.find('[data-testid="address"]');
    }

    get addressPopupMap() {
        return cy.get('#map');
    }

    get addressPopupZoomInButton() {
        return this.addressPopup.find('[title="Zoom in"]');
    }

    get approveAddressButton() {
        return this.addressPopup.contains("Підтвердити вибір");
    }

    get addressPopupZoomOutButton() {
        return this.addressPopup.find('[title="Zoom out"]');
    }

    get mapScaleDiv() {
        return this.addressPopup.find('.leaflet-proxy.leaflet-zoom-animated');
    }

    get successfulEditMessage() {
        return cy.get('[class*="SuccessfullyCreatedPage_finishTitle"]');
    }

    get viewAnnouncementsButton() {
        return cy.get('[class*="ItemButtons_darkBlueBtn"]');
    }

    announcementInputIsRed() {
        this.announcementInput.should("have.css", "border-color", "rgb(247, 56, 89)");
    }

    manufacturerInputIsRed() {
        this.manufacturerSearchDiv.should("have.css", "border-color", "rgb(247, 56, 89)");
    }

    clickCancelChangesButton() {
        this.cancelChangesButton.click();
    }

    clickSaveButton() {
        this.saveButton.scrollIntoView();
        this.saveButton.should("be.visible");
        this.saveButton.click("center");
    }

    clickViewAnnouncementsButton() {
        this.viewAnnouncementsButton.click();
    }

    clickManufacturerCloseButton() {
        this.manufacturerCloseButton.click();
    }

    clickZoomIn() {
        this.addressPopupZoomInButton.click();
    }

    clickZoomOut() {
        this.addressPopupZoomOutButton.click();
    }

    clickAddAddressButton() {
        this.addAddressButton.click();
    }

    clickApproveAddressButton() {
        this.approveAddressButton.click();
    }

    typeManufacturerSearchInput(text: string) {
        this.manufacturerInput.type(text);
    }

    typeAnnouncementInput(text: string) {
        this.announcementInput.type(text);
    }

    typeModelInput(text: string) {
        this.modelInput.type(text);
    }

    typeTechDescriptionInput(text: string) {
        this.techDescriptionInput.type(text);
    }

    typeDetailedDescriptionInput(text: string) {
        this.detailedDescriptionInput.type(text);
    }

    clearDetailedDescriptionInput() {
        this.detailedDescriptionInput.clear();
    }

    clearTechDescriptionInput() {
        this.techDescriptionInput.clear();
    }

    clearModelInput() {
        this.modelInput.clear();
    }

    clearAnnouncementInput() {
        this.announcementInput.clear();
    }

    clearManufacturerInput() {
        this.manufacturerInput.clear();
    }

    selectNewAddress() {
        this.addressPopupMap.then((map) => {
            const width = map.width() || -1;
            const height = map.height() || -1;
            const randomX = Math.floor(Math.random() * width);
            const randomY = Math.floor(Math.random() * height);
            this.addressPopupMap.click(randomX, randomY);
        });
    }

    isOpen() {
        this.editUnitTitle.should("be.visible");
        this.announcementInput.should("not.have.value", "");
        cy.window().its("document.readyState").should("eq", "complete");
    }
}

export default new EditUnit();