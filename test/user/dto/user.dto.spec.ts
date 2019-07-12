import { UserDTO } from '../../../src/user/dto/user.dto';

describe('validateMe', () => {
    it('should be ok', () => {
        const data = {
            email: 'larry@golade.com',
            username: 'LarryGolade'
        };
        const dto = new UserDTO(data);
        expect(dto.validateMe.bind(dto)).not.toThrow();
    });

    it('should throw an error with the empty fields', () => {
        const data = {
            email: '',
            username: ''
        };
        const dto = new UserDTO(data);
        const errRegex = Object.keys(data).reduce((regex, key) => regex + '||' + key);
        expect(dto.validateMe.bind(dto)).toThrowError(RegExp(errRegex));
    });
});
