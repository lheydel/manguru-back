import { prisma } from '../../../prisma/generated/prisma-client/index';
import { userLatest, userV1, userList } from '../user.constants.intg';
import { UserRepository } from '../../../src/user/user.repository';
import { User } from '../../../src/user/user.model';
import { fakeId } from '../../test.utils';

const userRepository = new UserRepository();

beforeEach(async () => {
    await prisma.deleteManyUsers();
});

describe('save', () => {
    it('should return the created user with a generated id', async () => {
        const expectedUser = {...userLatest, id: expect.anything()};
        await expect(userRepository.save(userLatest)).resolves.toMatchObject(expectedUser);
    });

    it('should throw an error when duplicating a user', async () => {
        await prisma.createUser(userLatest);
        await expect(userRepository.save(userLatest)).rejects.toThrow();
    });
});

describe('update', () => {
    let originUser: User;
    let updatedUser: User;

    beforeEach(async () => {
        originUser = await prisma.createUser({...userV1});
        updatedUser = {...userLatest, id: originUser.id};
    });

    it('should return the updated user', async () => {
        await expect(userRepository.update(updatedUser)).resolves.toMatchObject(updatedUser);
    });

    it('should throw an error when the id does not exist', async () => {
        const fakeUser = {...updatedUser, id: fakeId(updatedUser.id || '')};
        await expect(userRepository.update(fakeUser)).rejects.toThrow();
    });
});

describe('all', () => {
    let originList: User[];

    beforeEach(async () => {
        originList = await Promise.all(userList.map(async user => await prisma.createUser(user)));
    });

    it('should fetch users', async () => {
        await expect(userRepository.all()).resolves.toMatchObject(originList);
    });

    it('should fetch an empty list when no user found', async () => {
        await prisma.deleteManyUsers();
        await expect(userRepository.all()).resolves.toEqual([]);
    });
});

afterAll(() => {
    prisma.deleteManyUsers();
});
