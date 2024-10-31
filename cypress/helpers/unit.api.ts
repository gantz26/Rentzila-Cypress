import { getUnitsEndpoint, getModerateUnitEndpoint, getUnitIdEndpoint } from "./api";

class UnitAPI {
    createUnit(name: string, minimal_price: number) {
        return cy.get("@userAccessToken").then((token) => {
            return cy.request({
                method: "POST",
                url: getUnitsEndpoint(),
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: {
                    "name": name,
                    "first_name": "",
                    "last_name": "",
                    "model_name": "",
                    "description": "",
                    "features": "",
                    "views_count": 0,
                    "type_of_work": "HOUR",
                    "time_of_work": "",
                    "phone": "",
                    "minimal_price": minimal_price,
                    "money_value": "UAH",
                    "payment_method": "CASH_OR_CARD",
                    "lat": 50.453,
                    "lng": 30.516,
                    "count": 0,
                    "is_approved": true,
                    "is_archived": true,
                    "manufacturer": 340,
                    "owner": 1773,
                    "category": 308,
                    "services": [
                        263
                    ]
                }
            });
        });
    }

    approveUnit(id: number, isApproved: boolean) {
        return cy.get("@adminAccessToken").then((token) => {
            return cy.request({
                method: "PATCH",
                url: getModerateUnitEndpoint(id),
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: {
                    "id": id,
                    "is_approved": isApproved,
                    "declined_incomplete": false,
                    "declined_censored": false,
                    "declined_incorrect_price": false,
                    "declined_incorrect_data": false,
                    "declined_invalid_img": false
                }
            });
        });
    }

    deleteUnit(id: number) {
        return cy.get("@userAccessToken").then((token) => {
            return cy.request({
                method: "DELETE",
                url: getUnitIdEndpoint(id),
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
        });
    }
}

export default new UnitAPI();