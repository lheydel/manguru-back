import { UserService } from '../../../src/user/user.service';
import { UserRepository } from '../../../src/user/user.repository';
import { userList, userLatest } from '../user.constants.unit';
import { User } from '../../../src/user/user.model';
import bcrypt from 'bcrypt';
import { mikroInit } from '../../../src/config/mikro';

const userService = new UserService();

beforeAll(async () => {
    await mikroInit();
});

describe('createUser', () => {
    const user = userLatest();
    const mockOK = jest.fn().mockResolvedValue(user);
    const mockThrow = jest.fn().mockRejectedValue(new Error('blblbl'));
    const mock = jest.fn();

    it('should return the created user', async () => {
        UserRepository.prototype.save = mockOK;
        await expect(userService.createUser(user)).resolves.toMatchObject(user);
    });

    it.each`
        field
        ${'email'}
        ${'username'}
        ${'password'}
    `('should throw an error when no $field is given', async ({ field }: {field: 'email' | 'username' | 'password'}) => {
        UserRepository.prototype.findByEmail = mockOK;
        const newUser = userLatest();
        newUser[field] = '';
        await expect(userService.createUser(newUser)).rejects.toThrow();
    });

    it('should throw an error when repository throws', async () => {
        UserRepository.prototype.findByEmail = mock;
        UserRepository.prototype.save = mockThrow;
        await expect(userService.createUser(userLatest())).rejects.toThrow('blblbl');
    });
});
describe('update', () => {
    const newPwd = 'CheckOutThisNewPwd';
    const newRmbMe = true;

    describe.each`
        name                    | updateFn                          | userData          | expectedUser
        ${'updateUser'}         | ${userService.updateUser}         | ${userLatest()}   | ${userLatest()}
        ${'updatePassword'}     | ${userService.updatePassword}     | ${newPwd}         | ${{...userLatest(), password: newPwd}}
        ${'updateRememberMe'}   | ${userService.updateRememberMe}   | ${newRmbMe}       | ${{...userLatest(), password: newPwd}}
    `('updateUser', ({ updateFn, userData, expectedUser }) => {
        const mockOK = jest.fn().mockResolvedValue(expectedUser);
        const mockThrow = jest.fn().mockRejectedValue(new Error('blblbl'));
        updateFn = updateFn.bind(userService);

        it('should return the updated user', async () => {
            UserRepository.prototype.update = mockOK;
            await expect(updateFn('id', userData)).resolves.toMatchObject(expectedUser);
        });

        it('should throw an error when the id is empty', async () => {
            UserRepository.prototype.update = mockOK;
            await expect(updateFn('', userData)).rejects.toThrow();
        });

        it('should throw an error when repository throws', async () => {
            UserRepository.prototype.update = mockThrow;
            await expect(updateFn('id', userData)).rejects.toThrow('blblbl');
        });
    });
});

describe('updateUserList', () => {
    const mockId = jest.fn().mockImplementation((id: string, user: User) => {
        if (id == null || id === '') {
            throw new Error('Empty id');
        } // else
        return user;
    });
    const mockThrow = jest.fn().mockRejectedValue(new Error('blblbl'));

    it('should return the updated users', async () => {
        userService.updateUser = mockId;
        const list = userList();
        list.forEach(user => user.id = 'id');
        await expect(userService.updateUserList(list)).resolves.toMatchObject(list);
    });

    it('should throw an error when an id is empty', async () => {
        userService.updateUser = mockId;
        const list: User[] = [...userList(), new User()];
        list[list.length - 1].id = '';
        await expect(userService.updateUserList(list)).rejects.toThrow('Empty id');
    });

    it('should throw an error when updateUser throws', async () => {
        userService.updateUser = mockThrow;
        await expect(userService.updateUserList(userList())).rejects.toThrow('blblbl');
    });
});

describe('getAllUsers', () => {
    const list = userList();
    const expectedList: User[] = list.map(user => ({
        ...user,
        _id: expect.anything(),
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
    }));
    const mockOK = jest.fn().mockResolvedValue(list);
    const mockThrow = jest.fn().mockRejectedValue(new Error('blblbl'));

    it('should fetch users', async () => {
        UserRepository.prototype.all = mockOK;
        await expect(userService.getAllUsers()).resolves.toMatchObject(expectedList);
    });

    it('should throw an error when repository throws', async () => {
        UserRepository.prototype.all = mockThrow;
        await expect(userService.getAllUsers()).rejects.toThrow('blblbl');
    });
});

describe('checkCredentials', () => {
    const rawPwd = 'blblbl';

    const user = new User();
    user.email = 'theo@ryble.com';
    user.password = bcrypt.hashSync(rawPwd, 2);

    test.each`
        userFound   | email         | password  | result
        ${user}     | ${user.email} | ${rawPwd} | ${user}
        ${user}     | ${user.email} | ${' '}    | ${null}
        ${null}     | ${user.email} | ${rawPwd} | ${null}
    `(`[$email] and [$password] should be [$result]`, async ({userFound, email, password, result}) => {
        UserRepository.prototype.findByEmail = jest.fn().mockResolvedValue(userFound);
        const resolvedValue = await expect(userService.checkCredentials(email, password)).resolves;
        // if expected result is null
        if (result == null) {
            resolvedValue.toBeNull();
        } else {
            resolvedValue.toMatchObject(result);
        }
    });
});
