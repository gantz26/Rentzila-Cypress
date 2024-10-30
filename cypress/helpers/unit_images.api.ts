class UnitImagesAPI {
    uploadUnitIamge(id: number, filePath: string, isMain: boolean) {
        return cy.get("@userAccessToken").then((token) => {
            cy.fixture(filePath, "base64").then((photo) => {
                const formData = new FormData();
                const blob = Cypress.Blob.base64StringToBlob(photo, "image/jpeg");
                formData.append("unit", id.toString());
                formData.append("image", blob, filePath.split('/').pop());
                formData.append("is_main", isMain ? "true" : "false");

                return new Promise((resolve, reject) => {
                    const xhr = new XMLHttpRequest();
                    xhr.open("POST", "https://dev.rentzila.com.ua/api/unit-images/");
                    xhr.setRequestHeader("Authorization", `Bearer ${token}`);

                    xhr.onload = () => {
                        if (xhr.status === 200 || xhr.status === 201) {
                            resolve({ status: xhr.status, response: JSON.parse(xhr.response) });
                        } else {
                            console.error("Request failed", {
                                status: xhr.status,
                                response: xhr.responseText
                            });
                            reject(`Request failed with status ${xhr.status}`);
                        }
                    };
                    xhr.onerror = () => reject("Network error");
                    xhr.send(formData);
                });
            });
        });
    }
}

export default new UnitImagesAPI();