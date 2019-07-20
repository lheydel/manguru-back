import { prisma } from '../../../prisma/generated/prisma-client/index';
import { userLatest, userV1, userList } from '../user.constants.intg';
import { UserRepository } from '../../../src/user/user.repository';
import { User } from '../../../src/user/user.model';
import { fakeId } from '../../test.utils';

const userRepository = new UserRepository();

afterAll(() => {
    prisma.deleteManyUsers();
});

beforeEach(async () => {
    await prisma.deleteManyUsers();
});

describe('save', () => {
    it('should return the created user with a generated id', async () => {
        const expectedUser = {...userLatest(), id: expect.anything()};
        await expect(userRepository.save(userLatest())).resolves.toMatchObject(expectedUser);
    });

    it('should throw an error when duplicating a user', async () => {
        await prisma.createUser(userLatest());
        await expect(userRepository.save(userLatest())).rejects.toThrow();
    });
});

describe('updatePassword', () => {
    const newPwd = 'newPwd';
    let originUser: User;
    let updatedUser: User;

    beforeEach(async () => {
        originUser = await prisma.createUser(userLatest());
        updatedUser = {...userLatest(), id: originUser.id, password: newPwd};
    });

    it('should return the updated user', async () => {
        await expect(userRepository.updatePassword(updatedUser.id || '', newPwd)).resolves.toMatchObject(updatedUser);
    });

    it('should throw an error when the id does not exist', async () => {
        const fakedId = fakeId(updatedUser.id || '');
        await expect(userRepository.updatePassword(fakedId, newPwd)).rejects.toThrow();
    });
});

describe('updateRememberMe', () => {
    let originUser: User;
    let updatedUser: User;

    beforeEach(async () => {
        originUser = await prisma.createUser(userLatest());
        updatedUser = {...userLatest(), id: originUser.id, rememberMe: true};
    });

    it('should return the updated user', async () => {
        await expect(userRepository.updateRememberMe(updatedUser.id || '', true)).resolves.toMatchObject(updatedUser);
    });

    it('should throw an error when the id does not exist', async () => {
        const fakedId = fakeId(updatedUser.id || '');
        await expect(userRepository.updateRememberMe(fakedId, true)).rejects.toThrow();
    });
});

describe('all', () => {
    let originList: User[];

    beforeEach(async () => {
        originList = await Promise.all(userList().map(async user => await prisma.createUser(user)));
    });

    it('should fetch users', async () => {
        await expect(userRepository.all()).resolves.toMatchObject(originList);
    });

    it('should fetch an empty list when no user found', async () => {
        await prisma.deleteManyUsers();
        await expect(userRepository.all()).resolves.toEqual([]);
    });
});

describe('getByEmail', () => {

    beforeEach(async () => {
        await prisma.createUser(userLatest());
    });

    it('should fetch user', async () => {
        await expect(userRepository.findByEmail(userLatest().email)).resolves.toMatchObject(userLatest());
    });

    it('should return null when no user found', async () => {
        await expect(userRepository.findByEmail('')).resolves.toBeNull();
    });
});
