import { prisma } from '../../../prisma/generated/prisma-client/index';
import { User } from '../../../src/user/user.model';
import { UserService } from '../../../src/user/user.service';
import { userLatest, userV1, userList } from '../user.constants.intg';
import { fakeId } from '../../test.utils';
import bcrypt from 'bcrypt';

const userService = new UserService();

afterAll(() => {
    prisma.deleteManyUsers();
});

beforeEach(async () => {
    await prisma.deleteManyUsers();
});

describe('createUser', () => {
    const expectedUser = {
        ...userLatest(),
        password: expect.anything(), // hashed in db
    };

    it('should return the created user with a hashed password', async () => {
        const user = await userService.createUser(userLatest());
        expect(user).toMatchObject(expectedUser);
        expect(bcrypt.compareSync(userLatest().password, user.password)).toBe(true);
    });

    it('should throw an error when duplicating a user', async () => {
        await prisma.createUser(userLatest());
        await expect(userService.createUser(userLatest())).rejects.toThrow();
    });
});

describe('updateUser', () => {
    let originUser: User;
    const expectedUser = {
        ...userLatest(),
        password: expect.anything(), // hashed in db
    };

    beforeEach(async () => {
        originUser = await prisma.createUser(userV1());
    });

    it('should return the updated user', async () => {
        const user = await userService.updateUser(originUser.id || '', userLatest());
        expect(user).toMatchObject(expectedUser);
    });

    it('should throw an error when the id is empty', async () => {
        await expect(userService.updateUser('', userLatest())).rejects.toThrow();
    });

    it('should throw an error if the id does not exist', async () => {
        const fakedId = fakeId(originUser.id || '');
        await expect(userService.updateUser(fakedId, userLatest())).rejects.toThrow();
    });
});

describe('updatePassword', () => {
    let originUser: User;
    const expectedUser = {
        ...userLatest(),
        password: expect.anything(), // hashed in db
    };
    const newPwd = 'LookAtThatNewPwd';

    beforeEach(async () => {
        originUser = await prisma.createUser(userLatest());
    });

    it('should return the updated user with a hashed password', async () => {
        const user = await userService.updatePassword(originUser.id || '', newPwd);
        expect(user).toMatchObject(expectedUser);
        expect(bcrypt.compareSync(newPwd, user.password)).toBe(true);
    });

    it('should throw an error when the id is empty', async () => {
        await expect(userService.updatePassword('', newPwd)).rejects.toThrow();
    });

    it('should throw an error if the id does not exist', async () => {
        const fakedId = fakeId(originUser.id || '');
        await expect(userService.updatePassword(fakedId, newPwd)).rejects.toThrow();
    });
});

describe('updateRememberMe', () => {
    let originUser: User;
    const expectedUser = {
        ...userLatest(),
        password: expect.anything(), // hashed in db
        rememberMe: true,
    };

    beforeEach(async () => {
        originUser = await prisma.createUser(userLatest());
    });

    it('should return the updated user', async () => {
        const user = await userService.updateRememberMe(originUser.id || '', true);
        expect(user).toMatchObject(expectedUser);
    });

    it('should throw an error when the id is empty', async () => {
        await expect(userService.updateRememberMe('', true)).rejects.toThrow();
    });

    it('should throw an error if the id does not exist', async () => {
        const fakedId = fakeId(originUser.id || '');
        await expect(userService.updateRememberMe(fakedId, true)).rejects.toThrow();
    });
});

describe('updateUserList', () => {
    let originList: User[];
    let updatedList: User[];
    let expectedList: User[];

    beforeEach(async () => {
        originList = await Promise.all(userList().map(async user => await prisma.createUser(user)));
        updatedList = originList.map(user => ({
            ...user,
            username: user.username + '1',
            updatedAt: expect.anything()
        }));
        expectedList = updatedList.map(user => ({
            ...user,
            password: expect.anything(), // hashed in db
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
        updatedList[0].id = fakeId(updatedList[0].id || '');
        await expect(userService.updateUserList(updatedList)).rejects.toThrow();
    });
});

describe('getAllUsers', () => {
    let originList: User[];

    beforeEach(async () => {
        originList = await Promise.all(userList().map(async user => await prisma.createUser(user)));
    });

    it('should fetch users', async () => {
        await expect(userService.getAllUsers()).resolves.toMatchObject(originList);
    });

    it('should fetch an empty list if no user found', async () => {
        await prisma.deleteManyUsers();
        await expect(userService.getAllUsers()).resolves.toEqual([]);
    });
});

describe('checkCredentials', () => {
    const rawPwd = 'blblbl';

    const user = new User();
    user.email = 'theo@ryble.com';
    user.password = bcrypt.hashSync(rawPwd, 2);

    beforeEach(async () => {
        await prisma.createUser(user);
    });

    test.each`
        email         | password   | result
        ${user.email} | ${rawPwd}  | ${{...user, id: expect.anything()}}
        ${user.email} | ${' '}     | ${null}
        ${' '}        | ${rawPwd}  | ${null}
    `(`[$email] and [$password] should be [$result]`, async ({email, password, result}) => {
        const checkedUser = await userService.checkCredentials(email, password);
        // if expected result is null
        if (result == null) {
            expect(checkedUser).toBeNull();
        } else {
            expect(checkedUser).toMatchObject(result);
        }
    });
});
