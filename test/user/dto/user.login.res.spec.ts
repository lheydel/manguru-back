import { UserLoginResponse } from '../../../src/user/dto/user.login.res';
import { User } from '../../../src/user/user.model';

it('should be defined', () => {
    expect(new UserLoginResponse(new User(), 'token')).toBeDefined();
});
