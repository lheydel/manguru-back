import { prisma } from '../../../prisma/generated/prisma-client/index';
import { UserRepository } from '../../../src/user/user.repository';
import { userList, userLatest } from '../user.constants.unit';

const userRepository = new UserRepository();

describe('save', () => {
    const mockOK = jest.fn().mockResolvedValue(userLatest());
    const mockThrow = jest.fn().mockRejectedValue(new Error('blblbl'));

    it('should return the created user', async () => {
        prisma.createUser = mockOK;
        await expect(userRepository.save(userLatest())).resolves.toMatchObject(userLatest());
    });

    it('should throw an error when prisma throws', async () => {
        prisma.createUser = mockThrow;
        await expect(userRepository.save(userLatest())).rejects.toThrow('blblbl');
    });
});

describe('update', () => {
    const mockOK = jest.fn().mockResolvedValue(userLatest());
    const mockThrow = jest.fn().mockRejectedValue(new Error('blblbl'));

    it('should return the updated user', async () => {
        prisma.updateUser = mockOK;
        await expect(userRepository.update(userLatest())).resolves.toMatchObject(userLatest());
    });

    it('should throw an error when prisma throws', async () => {
        prisma.updateUser = mockThrow;
        await expect(userRepository.update(userLatest())).rejects.toThrow('blblbl');
    });
});

describe('all', () => {
    const mockOK = jest.fn().mockResolvedValue(userList());
    const mockThrow = jest.fn().mockRejectedValue(new Error('blblbl'));

    it('should fetch users', async () => {
        prisma.users = mockOK;
        await expect(userRepository.all()).resolves.toMatchObject(userList());
    });

    it('should throw an error when prisma throws', async () => {
        prisma.users = mockThrow;
        await expect(userRepository.all()).rejects.toThrow('blblbl');
    });
});

describe('getByEmail', () => {

    it('should return user fetched by prisma', async () => {
        prisma.user = jest.fn().mockResolvedValue(userLatest());
        await expect(userRepository.findByEmail('')).resolves.toMatchObject(userLatest());
    });

    it('should return null when no user found by prisma', async () => {
        prisma.user = jest.fn().mockResolvedValue(null);
        await expect(userRepository.findByEmail('')).resolves.toBeNull();
    });
});
