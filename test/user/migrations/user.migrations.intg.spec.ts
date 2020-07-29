import { EntityRepository } from 'mikro-orm';
import mikro, { mikroInit } from '../../../src/config/mikro';
import { UserMigrator } from '../../../src/user/user.migrations';
import { User } from '../../../src/user/user.model';
import { userLatest, userV1 } from '../user.constants.intg';

let userDb: EntityRepository<User>;
const userMigrator = new UserMigrator();

beforeAll(async () => {
    await mikroInit();
    userDb = mikro.getRepository(User);
});

beforeEach(async () => {
    await userDb.remove({}, true);
});

afterAll(async () => {
    await userDb.remove({}, true);
});

test('doMigrations: migrate all versions to latest', async () => {
    // insert an instance of all versions in db
    const userList = [userV1(), userLatest()];
    await Promise.all(userList.map(async user => await userDb.persistLater(user)));
    await userDb.flush();

    const expectedUser = {
        ...userLatest(),
        _id: expect.anything(),
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
    };

    // do migrations
    await userMigrator.doMigrations();

    // check results
    const result = await userDb.findAll();
    expect(result).toHaveLength(userList.length);
    result.forEach(user => {
        user.email = expectedUser.email;        // unique field
        user.password = expectedUser.password;  // hashed in db
        expect(user).toMatchObject(expectedUser);
    });
});
