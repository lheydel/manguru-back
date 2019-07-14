import { prisma } from '../../../prisma/generated/prisma-client';
import { userV1, userLatest } from '../user.constants.intg';
import { UserMigrator } from '../../../src/user/user.migrations';

const userMigrator = new UserMigrator();

beforeEach(async () => {
    await prisma.deleteManyUsers();
});

test('doMigrations: migrate all versions to latest', async () => {
    // insert an instance of all versions in db
    const userList = [userV1];
    userList.forEach(async user => await prisma.createUser(user));
    const expectedUser = await prisma.createUser(userLatest);

    await prisma.users();

    // do migrations
    await userMigrator.doMigrations();

    // check results
    const result = await prisma.users();
    expect(result).toHaveLength(userList.length + 1);
    result.forEach(user => {
        user.email = expectedUser.email;    // unique field
        expect(user).toMatchObject(userLatest);
    });
});
