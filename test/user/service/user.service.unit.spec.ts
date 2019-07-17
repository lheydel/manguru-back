import { UserService } from '../../../src/user/user.service';
import { UserRepository } from '../../../src/user/user.repository';
import { userList, userLatest } from '../user.constants.unit';
import { User } from '../../../src/user/user.model';
import bcrypt from 'bcrypt';

const userService = new UserService();

describe('createUser', () => {
    const mockOK = jest.fn().mockResolvedValue(userLatest());
    const mockThrow = jest.fn().mockRejectedValue(new Error('blblbl'));
    const mock = jest.fn();

    it('should return the created user', async () => {
        UserRepository.prototype.save = mockOK;
        await expect(userService.createUser(userLatest())).resolves.toMatchObject(userLatest());
    });

    it('should throw an error when user already exists', async () => {
        UserRepository.prototype.findByEmail = mockOK;
        await expect(userService.createUser(userLatest())).rejects.toThrow();
    });

    it('should throw an error when repository throws', async () => {
        UserRepository.prototype.findByEmail = mock;
        UserRepository.prototype.save = mockThrow;
        await expect(userService.createUser(userLatest())).rejects.toThrow('blblbl');
    });
});

describe('updateUser', () => {
    const mockOK = jest.fn().mockResolvedValue(userLatest());
    const mockThrow = jest.fn().mockRejectedValue(new Error('blblbl'));

    it('should return the updated user', async () => {
        UserRepository.prototype.update = mockOK;
        await expect(userService.updateUser('id', userLatest())).resolves.toMatchObject(userLatest());
    });

    it('should throw an error when the id is empty', async () => {
        UserRepository.prototype.update = mockOK;
        await expect(userService.updateUser('', userLatest())).rejects.toThrow();
    });

    it('should throw an error when repository throws', async () => {
        UserRepository.prototype.update = mockThrow;
        await expect(userService.updateUser('id', userLatest())).rejects.toThrow('blblbl');
    });
});

describe('updateUserList', () => {
    const mockId = jest.fn().mockImplementation((id: string, user: User) => {
        if (id == null || id === '') {
            throw new Error('Empty id: ');
        } // else
        return user;
    });
    const mockThrow = jest.fn().mockRejectedValue(new Error('blblbl'));

    it('should return the updated users', async () => {
        userService.updateUser = mockId;
        await expect(userService.updateUserList(userList())).resolves.toMatchObject(userList());
    });

    it('should throw an error when an id is empty', async () => {
        userService.updateUser = mockId;
        const list: User[] = [...userList(), new User()];
        await expect(userService.updateUserList(list)).rejects.toThrow('Empty id');
    });

    it('should throw an error when updateUser throws', async () => {
        userService.updateUser = mockThrow;
        await expect(userService.updateUserList(userList())).rejects.toThrow('blblbl');
    });
});

describe('getAllUsers', () => {
    const mockOK = jest.fn().mockResolvedValue(userList());
    const mockThrow = jest.fn().mockRejectedValue(new Error('blblbl'));

    it('should fetch users', async () => {
        UserRepository.prototype.all = mockOK;
        await expect(userService.getAllUsers()).resolves.toMatchObject(userList());
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
