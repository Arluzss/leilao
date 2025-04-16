import { de, faker } from '@faker-js/faker';

type User = {
    id: number;
    firstName: string;
    lastName: string;
    creditCard: string;
};

function generateUsers(quantity: number): User[] {
    let users: User[] = [];
    for (let i = 0; i < quantity; i++) {
        users.push({
            id: faker.number.int(1000),
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            creditCard: faker.finance.creditCardNumber()
        });
    }
    localStorage.setItem('users', JSON.stringify(users));
    return users;
}

export default generateUsers;
export type { User };