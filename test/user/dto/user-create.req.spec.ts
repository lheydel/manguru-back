import { UserCreateRequest } from '../../../src/user/dto/user-create.req';

it('should be defined', () => {
    expect(new UserCreateRequest(null)).toBeDefined();
});

describe('validateMe', () => {
    it('should be ok', () => {
        const data = {
            email: 'larry@golade.com',
            username: 'LarryGolade',
            password: 'blblbl'
        };
        const dto = new UserCreateRequest(data);
        expect(dto.validateMe.bind(dto)).not.toThrow();
    });

    it('should throw an error with the empty fields', () => {
        const data = {
            email: '',
            username: '',
            password: ''
        };
        const dto = new UserCreateRequest(data);
        const errRegex = Object.keys(data).reduce((regex, key) => regex + '||' + key);
        expect(dto.validateMe.bind(dto)).toThrowError(RegExp(errRegex));
    });
});
