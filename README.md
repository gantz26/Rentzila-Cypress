# Summary

This repository contains automated tests designed for the Rentzila website to ensure that its core features function as expected.

## Requirements

The next requirements must be completed to run tests:
1. Install [Visual Studio code](https://code.visualstudio.com/)
2. Install [Node.js](https://nodejs.org/en) (version 20.x or higher)

## Steps to install, launch and creating a report

1. Make a copy of this repository:
```
git clone https://github.com/gantz26/Rentzila-Cypress.git
```

2. Open this folder in Visual Studio Code and install all dependencies:
```
npm ci
```

3. Create .env file and add necessary information to it:
```
ADMIN_EMAIL=<admin_email>
ADMIN_PASSWORD=<admin_password>

USER_EMAIL=<your_email>
USER_PASSWORD=<your_password>

BASE_URL=<base_url>
```

4. To run all the tests, use one of the next commands:
```
npm run cy:run:headless
npm run cy:run:headed
```

5. To run individual test files, use the following commands:
```
npm run cy:run:headed:create_unit_api
npm run cy:run:headless:create_unit_api
```

6. To generate and open a report:
```
npm run allure:generate
npm run allure:open
```