import { faker } from "@faker-js/faker";

class FakerHelper {
    getRandomName(minCount: number = 10, maxCount: number = 20) {
        return faker.word.noun({ length: { min: minCount, max: maxCount } });
    }

    getRandomNumber() {
        return faker.number.int({ min: 1000, max: 1000000 });
    }

    getRandomWord(count: number) {
        return faker.helpers.fromRegExp(`[a-z]{${count}}`);
    }

    getRandomWords(count: number) {
        return faker.word.words(count);
    }
}

export default new FakerHelper();