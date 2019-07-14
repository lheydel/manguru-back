import { UserCreateReqDTO } from '../../../src/user/dto/user.create.req';


describe('validateMe', () => {
    it('should be ok', () => {
        const data = {
            email: 'larry@golade.com',
            username: 'LarryGolade',
            password: 'blblbl'
        };
        const dto = new UserCreateReqDTO(data);
        expect(dto.validateMe.bind(dto)).not.toThrow();
    });

    it('should be defined', () => {
        expect(new UserCreateReqDTO(null)).toBeDefined();
    });

    it('should throw an error with the empty fields', () => {
        const data = {
            email: '',
            username: '',
            password: ''
        };
        const dto = new UserCreateReqDTO(data);
        const errRegex = Object.keys(data).reduce((regex, key) => regex + '||' + key);
        expect(dto.validateMe.bind(dto)).toThrowError(RegExp(errRegex));
    });
});
