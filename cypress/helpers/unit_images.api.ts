import { getUnitImageEndpoint } from "./api";

class UnitImagesAPI {
    uploadUnitIamge(id: number, filePath: string, isMain: boolean) {
        return cy.get("@userAccessToken").then((token) => {
            cy.fixture(filePath, "base64").then((photo) => {
                const formData = new FormData();
                const blob = Cypress.Blob.base64StringToBlob(photo, "image/jpg");
                formData.append("unit", id.toString());
                formData.append("image", blob, filePath.split('/').pop());
                formData.append("is_main", isMain ? "true" : "false");

                return cy.request({
                    method: "POST",
                    url: getUnitImageEndpoint(),
                    headers: {
                        "Authorization": `Bearer ${token}`
                    },
                    body: formData
                });
            });
        });
    }
}

export default new UnitImagesAPI();