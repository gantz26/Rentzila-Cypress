export const getUnitImageEndpoint = () => `${Cypress.env("API_BASE_URL")}/unit-images/`;
export const getUnitsEndpoint = () => `${Cypress.env("API_BASE_URL")}/units/`;
export const getModerateUnitEndpoint = (id: number) => `${Cypress.env("API_BASE_URL")}/crm/units/${id}/moderate/`;
export const getUnitIdEndpoint = (id: number) => `${Cypress.env("API_BASE_URL")}/units/${id}/`;
export const getAuthCreateEndpoint = () => `${Cypress.env("API_BASE_URL")}/auth/jwt/create/`;