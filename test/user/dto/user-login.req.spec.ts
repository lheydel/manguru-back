import { UserLoginRequest } from '../../../src/user/dto/user-login.req';

it('should be defined', () => {
    expect(new UserLoginRequest(null)).toBeDefined();
});

describe('validateMe', () => {
    it('should be ok', () => {
        const data = {
            email: 'larry@golade.com',
            password: 'blblbl'
        };
        const dto = new UserLoginRequest(data);
        expect(dto.validateMe.bind(dto)).not.toThrow();
    });

    it('should throw an error with the empty fields', () => {
        const data = {
            email: '',
            password: ''
        };
        const dto = new UserLoginRequest(data);
        const errRegex = Object.keys(data).reduce((regex, key) => regex + '||' + key);
        expect(dto.validateMe.bind(dto)).toThrowError(RegExp(errRegex));
    });
});
