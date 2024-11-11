class AdminUnit {
    get title() {
        return cy.get('[class*="AdminLayout_title"]');
    }

    get manufacturerWrapper() {
        return cy.get('[class*="AdminCurrentUnit_info_item"]').filter((index, element) => {
            return element.innerText.includes("Виробник");
        });
    }

    get manufacturerLabel() {
        return this.manufacturerWrapper.find('[class*="AdminCurrentUnit_info_content"]');
    }

    get modelWrapper() {
        return cy.get('[class*="AdminCurrentUnit_info_item"]').filter((index, element) => {
            return element.innerText.includes("Модель");
        });
    }

    get modelLabel() {
        return this.modelWrapper.find('[class*="AdminCurrentUnit_info_content"]');
    }

    get techDescriptionWrapper() {
        return cy.get('[class*="AdminCurrentUnit_info_item"]').filter((index, element) => {
            return element.innerText.includes("Технічні характеристики");
        });
    }

    get techDescriptionLabel() {
        return this.techDescriptionWrapper.find('[class*="AdminCurrentUnit_info_content"]');
    }

    get detailedDescriptionWrapper() {
        return cy.get('[class*="AdminCurrentUnit_info_item"]').filter((index, element) => {
            return element.innerText.includes("Детальний опис");
        });
    }

    get detailedDescriptionLabel() {
        return this.detailedDescriptionWrapper.find('[class*="AdminCurrentUnit_info_content"]');
    }

    get addressWrapper() {
        return cy.get('[class*="AdminCurrentUnit_info_item"]').filter((index, element) => {
            return element.innerText.includes("Місце розташування технічного засобу");
        });
    }

    get addressLabel() {
        return this.addressWrapper.find('[class*="AdminCurrentUnit_info_content"]');
    }
}

export default new AdminUnit();