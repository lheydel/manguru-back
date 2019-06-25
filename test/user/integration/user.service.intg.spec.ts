import { prisma } from '../../../prisma/generated/prisma-client/index';
import { User } from '../../../src/user/user.model';

beforeEach(async () => {
    await prisma.deleteManyUsers();
});

// TODO better
test('create user', async () => {
    const user = new User('sandra@geffroi.com', 'Sandra Geffroi');
    await expect(prisma.createUser(user)).toBeDefined();
});

// TODO better
// test('duplicata', async () => {
//     const user = new User('larry@golade.com', 'Larry Golade');
//     await prisma.createUser(user);
//     await expect(prisma.createUser(user)).toThrow();
// });
