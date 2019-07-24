import { EntityRepository } from 'mikro-orm';
import mikro, { mikroInit } from '../../../src/config/mikro';
import { User } from '../../../src/user/user.model';
import { UserRepository } from '../../../src/user/user.repository';
import { userLatest, userList } from '../user.constants.unit';

let userDb: EntityRepository<User>;
let userRepository: UserRepository;

beforeAll(async () => {
    await mikroInit();
    userRepository = new UserRepository();
    userDb = userRepository['db'];
});

describe('save', () => {
    const user = userLatest();
    const mockOK = jest.fn();
    const mockThrow = jest.fn().mockRejectedValue(new Error('blblbl'));

    it('should return the created user', async () => {
        userDb.persistAndFlush = mockOK;
        await expect(userRepository.save(user)).resolves.toMatchObject(user);
        expect(mockOK).lastCalledWith(user);
    });

    it('should throw an error when duplicating a user', async () => {
        userDb.persistAndFlush = mockThrow;
        await expect(userRepository.save(user)).rejects.toThrow();
    });

    it('should throw an error when orm throws', async () => {
        userDb.persistAndFlush = mockThrow;
        await expect(userRepository.save(user)).rejects.toThrow('blblbl');
    });
});

describe('update', () => {
    let user: User;
    const mockPFOk = jest.fn();
    const mockPFThrow = jest.fn().mockRejectedValue(new Error('blblbl'));
    let mockFindOk: jest.Mock;
    const mockFindNull = jest.fn().mockResolvedValue(null);

    beforeAll(() => {
        user = userDb.create(userLatest());
        mockFindOk = jest.fn().mockResolvedValue(user);
    });

    it('should return the updated user', async () => {
        userDb.findOne = mockFindOk;
        userDb.persistAndFlush = mockPFOk;
        await expect(userRepository.update(user.id, user)).resolves.toMatchObject(user);
        expect(mockPFOk).toBeCalledWith(user);
    });

    it('should throw an error when user does not exists', async () => {
        userDb.findOne = mockFindNull;
        userDb.persistAndFlush = mockPFThrow;
        await expect(userRepository.update(user.id, user)).rejects.toThrow();
    });

    it('should throw an error when orm throws', async () => {
        userDb.findOne = mockFindOk;
        userDb.persistAndFlush = mockPFThrow;
        await expect(userRepository.update(user.id, user)).rejects.toThrow('blblbl');
    });
});

describe('all', () => {
    const list = userList();
    const mockOK = jest.fn().mockResolvedValue(list);
    const mockThrow = jest.fn().mockRejectedValue(new Error('blblbl'));

    it('should fetch users', async () => {
        userDb.findAll = mockOK;
        await expect(userRepository.all()).resolves.toMatchObject(list);
    });

    it('should throw an error when orm throws', async () => {
        userDb.findAll = mockThrow;
        await expect(userRepository.all()).rejects.toThrow('blblbl');
    });
});

describe('getByEmail', () => {
    const user = userLatest();

    it('should return user fetched by orm', async () => {
        userDb.findOne = jest.fn().mockResolvedValue(user);
        await expect(userRepository.findByEmail('')).resolves.toMatchObject(user);
    });

    it('should return null when no user found by orm', async () => {
        userDb.findOne = jest.fn().mockResolvedValue(null);
        await expect(userRepository.findByEmail('')).resolves.toBeNull();
    });
});
