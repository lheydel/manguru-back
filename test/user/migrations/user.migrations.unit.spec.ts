import { UserMigrator } from '../../../src/user/user.migrations';
import { VersionStruct } from '../../../src/common/properties';
import { userLatest, userV1 } from '../user.constants.unit';
import { User } from '../../../src/user/user.model';
import { UserService } from '../../../src/user/user.service';

const userMigrator = new UserMigrator();

const expectedUser = {
    ...userLatest(),
    _id: expect.anything(),
    createdAt: expect.anything(),
    updatedAt: expect.anything(),
};

describe('needMigrations', () => {
    test.each`
        vs                          | expected
        ${VersionStruct.USER - 1}   | ${true}
        ${VersionStruct.USER}       | ${false}
        ${VersionStruct.USER + 1}   | ${false}
        ${undefined}                | ${false}

    `('[latest vs: ' + VersionStruct.USER + '] vs $vs needs migration: $expected', ({ vs, expected }) => {
        const user = new User();
        user.vs = vs;
        const result = userMigrator.needMigration(user);
        expect(result).toEqual(expected);
    });
});

describe('updateVersionStruct', () => {
    test.each`
        vs   | user
        ${1} | ${userV1()}
    `('upgrade from vs $vs to latest', ({ user }) => {
        userMigrator.upgradeVersionStruct(user);
        expect(user).toMatchObject(expectedUser);
    });
});

test('doMigrations: migrate all versions to latest', async () => {
    const userList: User[] = [userV1(), userLatest()];
    UserService.prototype.getAllUsers = jest.fn().mockResolvedValue(userList);
    UserService.prototype.updateUserList = jest.fn();

    // do migrations
    await userMigrator.doMigrations();

    // check if migration was done for all the old versions
    userList.forEach(user => {
        expect(user).toMatchObject(expectedUser);
    });

    // check if migration was done only if necessary
    userList.pop();
    expect(UserService.prototype.updateUserList).toHaveBeenCalledWith(userList);
});
