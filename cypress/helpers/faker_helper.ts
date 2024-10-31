import { faker } from "@faker-js/faker";

class FakerHelper {
    getRandomUnitName() {
        return faker.word.noun({ length: { min: 10, max: 20 } });
    }

    getRandomUnitPrice() {
        return faker.number.int({ min: 1000, max: 1000000 });
    }
}

export default new FakerHelper();