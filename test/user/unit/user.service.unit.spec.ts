import { UserService } from '../../../src/user/user.service';
import { User } from '../../../src/user/user.model';
import { UserRepository } from '../../../src/user/user.repository';

const userService = new UserService();

test('should fetch users', async () => {
    const users = [new User('blblbl', 'yolo')];
    UserRepository.prototype.getAll = jest.fn().mockImplementationOnce(() => {
        return users;
    });
    const all = await userService.getAll();
    expect(all).toBeDefined();
    expect(all[0]).toEqual(users[0]);
});

test('should receive an error', async () => {
    UserRepository.prototype.getAll = jest.fn().mockImplementationOnce(() => {
        throw new Error('Something weird happened');
    });

    let error: Error;
    try {
        await userService.getAll();
    } catch (err) {
        error = err;
    }
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe('Something weird happened')
});
