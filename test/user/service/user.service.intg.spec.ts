import { prisma } from '../../../prisma/generated/prisma-client/index';
import { User } from '../../../src/user/user.model';
import { UserService } from '../../../src/user/user.service';
import { userLatest, userV1, userList } from '../user.constants.intg';
import { fakeId } from '../../test.utils';

const userService = new UserService();

beforeEach(async () => {
    await prisma.deleteManyUsers();
});

describe('createUser', () => {
    it('should return the created user', async () => {
        await expect(userService.createUser(userLatest)).resolves.toMatchObject(userLatest);
    });

    it('should throw an error when duplicating a user', async () => {
        await prisma.createUser(userLatest);
        await expect(userService.createUser(userLatest)).rejects.toThrow();
    });
});

describe('updateUser', () => {
    let originUser: User;

    beforeEach(async () => {
        originUser = await prisma.createUser({...userV1});
    });

    it('should return the updated user', async () => {
        await expect(userService.updateUser(originUser.id || '', userLatest)).resolves.toMatchObject(userLatest);
    });

    it('should throw an error when the id is empty', async () => {
        await expect(userService.updateUser('', userLatest)).rejects.toThrow();
    });

    it('should throw an error if the id does not exist', async () => {
        const fakedId = fakeId(originUser.id || '');
        await expect(userService.updateUser(fakedId, userLatest)).rejects.toThrow();
    });
});

describe('updateUserList', () => {
    let originList: User[];
    let updatedList: User[];

    beforeEach(async () => {
        originList = await Promise.all(userList.map(async user => await prisma.createUser(user)));
        updatedList = originList.map(user => ({
            ...user,
            username: user.username + '1',
            updatedAt: expect.anything()
        }));
    });

    it('should return the updated users', async () => {
        await expect(userService.updateUserList(updatedList)).resolves.toMatchObject(updatedList);
    });

    it('should throw an error when an id is empty', async () => {
        const list: User[] = [...userList, new User()];
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
        originList = await Promise.all(userList.map(async user => await prisma.createUser(user)));
    });

    it('should fetch users', async () => {
        await expect(userService.getAllUsers()).resolves.toMatchObject(originList);
    });

    it('should fetch an empty list if no user found', async () => {
        await prisma.deleteManyUsers();
        await expect(userService.getAllUsers()).resolves.toEqual([]);
    });
});

afterAll(() => {
    prisma.deleteManyUsers();
});
