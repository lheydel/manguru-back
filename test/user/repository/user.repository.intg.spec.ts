import { EntityRepository } from 'mikro-orm';
import mikro, { mikroInit } from '../../../src/config/mikro';
import { User } from '../../../src/user/user.model';
import { UserRepository } from '../../../src/user/user.repository';
import { fakeId } from '../../test.utils';
import { userLatest, userList, userV1 } from '../user.constants.intg';
import { ObjectID } from 'bson';

let userDb: EntityRepository<User>;
let userRepository: UserRepository;

beforeAll(async () => {
    await mikroInit();
    userRepository = new UserRepository();
    userDb = mikro.getRepository(User);
});

beforeEach(async () => {
    await userDb.remove({}, true);
});

afterAll(async () => {
    await userDb.remove({}, true);
});

describe('save', () => {
    let user = userLatest();

    it('should return the created user with a generated id', async () => {
        const expectedUser = {...user, _id: expect.anything(), updatedAt: expect.anything()};
        await expect(userRepository.save(user)).resolves.toMatchObject(expectedUser);
        await expect(userDb.findOne({ id: user._id })).resolves.toMatchObject(expectedUser);
    });

    it('should throw an error when duplicating a user', async () => {
        user = userDb.create(userLatest());
        await userDb.persistAndFlush(user);
        await expect(userRepository.save(user)).rejects.toThrow();
    });
});

describe('update', () => {
    let originUser: User;
    let expectedUser: User;

    beforeEach(async () => {
        originUser = userV1();
        await userDb.persistAndFlush(originUser);
        expectedUser = {
            ...originUser,
            ...userLatest(),
            _id: expect.anything(),
            createdAt: expect.anything(),
            updatedAt: expect.anything(),
        };
    });

    it('should return the updated user', async () => {
        await expect(userRepository.update(originUser.id, userLatest())).resolves.toMatchObject(expectedUser);
        await expect(userDb.findOne({ id: originUser._id })).resolves.toMatchObject(expectedUser);
    });

    it('should throw an error when the id does not exist', async () => {
        const fakedId = fakeId(originUser.id);
        await expect(userRepository.update(fakedId, userLatest())).rejects.toThrow();
    });
});

describe('all', () => {
    const originList = userList();

    beforeEach(async () => {
        await Promise.all(originList.map(async user => await userDb.persistAndFlush(user)));
    });

    it('should fetch users', async () => {
        await expect(userRepository.all()).resolves.toMatchObject(originList);
    });

    it('should fetch an empty list when no user found', async () => {
        await userDb.remove({}, true);
        await expect(userRepository.all()).resolves.toEqual([]);
    });
});

describe('getByEmail', () => {
    const user = userLatest();

    beforeEach(async () => {
        await userDb.persistAndFlush(user);
    });

    it('should fetch user', async () => {
        await expect(userRepository.findByEmail(user.email)).resolves.toMatchObject(user);
    });

    it('should return null when no user found', async () => {
        await expect(userRepository.findByEmail('')).resolves.toBeNull();
    });
});
