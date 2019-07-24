import bcrypt from 'bcrypt';
import { EntityRepository } from 'mikro-orm';
import mikro, { mikroInit } from '../../../src/config/mikro';
import { User } from '../../../src/user/user.model';
import { UserService } from '../../../src/user/user.service';
import { fakeId } from '../../test.utils';
import { userLatest, userList, userV1 } from '../user.constants.intg';

let userDb: EntityRepository<User>;
const userService = new UserService();

const expectedUser: User = {
    ...userLatest(),
    _id: expect.anything(),
    password: expect.anything(), // hashed in db
    createdAt: expect.anything(),
    updatedAt: expect.anything(),
};

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

describe('createUser', () => {

    it('should return the created user with a hashed password', async () => {
        const user = userLatest();
        await userService.createUser(user);
        expect(user).toMatchObject(expectedUser);
        expect(bcrypt.compareSync(userLatest().password, user.password)).toBe(true);
    });

    it('should throw an error when duplicating a user', async () => {
        const user = userLatest();
        await userDb.persistAndFlush(user);
        await expect(userService.createUser(user)).rejects.toThrow();
    });
});

describe('updateUser', () => {
    let originUser: User;

    beforeEach(async () => {
        originUser = userV1();
        await userDb.persistAndFlush(originUser);
    });

    it('should return the updated user', async () => {
        const test = await userService['userRepository'].findByIdWithCheck(originUser._id.toHexString());
        expect(test).toEqual(originUser);
        const user = await userService.updateUser(test._id.toHexString(), userLatest());
        expect(user).toMatchObject(expectedUser);
    });

    it('should throw an error when the id is empty', async () => {
        await expect(userService.updateUser('', userLatest())).rejects.toThrow();
    });

    it('should throw an error if the id does not exist', async () => {
        const fakedId = fakeId(originUser._id.toHexString());
        await expect(userService.updateUser(fakedId, userLatest())).rejects.toThrow();
    });
});

describe('updatePassword', () => {
    let originUser: User;
    const newPwd = 'LookAtThatNewPwd';

    beforeEach(async () => {
        originUser = userLatest();
        await userDb.persistAndFlush(originUser);
    });

    it('should return the updated user with a hashed password', async () => {
        const user = await userService.updatePassword(originUser._id.toHexString(), newPwd);
        expect(user).toMatchObject(expectedUser);
        expect(bcrypt.compareSync(newPwd, user.password)).toBe(true);
    });

    it('should throw an error when the id is empty', async () => {
        await expect(userService.updatePassword('', newPwd)).rejects.toThrow();
    });

    it('should throw an error if the id does not exist', async () => {
        const fakedId = fakeId(originUser._id.toHexString());
        await expect(userService.updatePassword(fakedId, newPwd)).rejects.toThrow();
    });
});

describe('updateRememberMe', () => {
    let originUser: User;

    beforeEach(async () => {
        originUser = userLatest();
        await userDb.persistAndFlush(originUser);
    });

    it('should return the updated user', async () => {
        const user = await userService.updateRememberMe(originUser._id.toHexString(), true);
        expect(user).toMatchObject(expectedUser);
    });

    it('should throw an error when the id is empty', async () => {
        await expect(userService.updateRememberMe('', true)).rejects.toThrow();
    });

    it('should throw an error if the id does not exist', async () => {
        const fakedId = fakeId(originUser._id.toHexString());
        await expect(userService.updateRememberMe(fakedId, true)).rejects.toThrow();
    });
});

describe('updateUserList', () => {
    let originList: User[];
    let updatedList: User[];
    let expectedList: User[];

    beforeEach(async () => {
        originList = userList();
        await Promise.all(originList.map(async user => {
            // user = await userDb.create(user);
            await userDb.persistAndFlush(user);
        }));
        updatedList = originList.map(user => {
            user.username += '1';
            return user;
        });
        expectedList = updatedList.map(user => ({
            ...user,
            password: expect.anything(), // hashed in db
            updatedAt: expect.anything(),
        }));
    });

    it('should return the updated users', async () => {
        await expect(userService.updateUserList(updatedList)).resolves.toMatchObject(expectedList);
    });

    it('should throw an error when an id is empty', async () => {
        const list: User[] = [...userList(), new User()];
        await expect(userService.updateUserList(list)).rejects.toThrow();
    });

    it('should throw an error when an id does not exists', async () => {
        updatedList[0].id = fakeId(updatedList[0]._id.toHexString());
        await expect(userService.updateUserList(updatedList)).rejects.toThrow();
    });
});

describe('getAllUsers', () => {
    let originList: User[];
    let expectedList: User[];

    beforeEach(async () => {
        originList = userList();
        await Promise.all(originList.map(async user => await userDb.persistAndFlush(user)));
        expectedList = originList.map(user => ({
            ...user,
            _id: expect.anything(),
            updatedAt: expect.anything(),
        }));
    });

    it('should fetch users', async () => {
        await expect(userService.getAllUsers()).resolves.toMatchObject(originList);
    });

    it('should fetch an empty list if no user found', async () => {
        await userDb.remove({}, true);
        await expect(userService.getAllUsers()).resolves.toEqual([]);
    });
});

describe('checkCredentials', () => {
    const rawPwd = 'blblbl';

    let user = userLatest();
    user.email = 'theo@ryble.com';
    user.password = bcrypt.hashSync(rawPwd, 2);

    const expectedResult: User = {
        ...user,
        _id: expect.anything(),
        updatedAt: expect.anything(),
    };

    beforeEach(async () => {
        user = userDb.create(user);
        await userDb.persistAndFlush(user);
    });

    test.each`
        email         | password   | result
        ${user.email} | ${rawPwd}  | ${expectedResult}
        ${user.email} | ${' '}     | ${null}
        ${' '}        | ${rawPwd}  | ${null}
    `(`[$email] and [$password] should be [$result]`, async ({email, password, result}) => {
        const checkedUser = await userService.checkCredentials(email, password);

        if (!result) {
            expect(checkedUser).toBeNull();
        } else {
            expect(checkedUser).toMatchObject(result);
        }
    });
});
