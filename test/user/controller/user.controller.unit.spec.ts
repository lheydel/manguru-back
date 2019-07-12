import { UserController } from '../../../src/user/user.controller';
import { Route } from '../../../src/common/properties';
import { fakePost } from '../../test.utils';
import { userLatest } from '../user.constants.unit';
import { UserService } from '../../../src/user/user.service';
import { UserDTO } from '../../../src/user/dto/user.dto';
import { UserCreateReqDTO } from '../../../src/user/dto/user.create.req';


it('should be defined', () => {
    expect(new UserController()).toBeDefined();
});

describe('getById', () => {
    it.todo('');
});

describe('create', () => {
    const mockOk = jest.fn().mockResolvedValue(userLatest);
    const mockAsyncThrow = jest.fn().mockRejectedValue(new Error('async'));
    const mockThrow = jest.fn().mockImplementation(() => { throw new Error('sync'); });
    const userReq = new UserCreateReqDTO(userLatest);

    it('should return the newly created user with status 200', async () => {
        UserService.prototype.createUser = mockOk;
        UserCreateReqDTO.prototype.validateMe = jest.fn();

        const response = await fakePost(Route.USER, userReq).expect(200);
        expect(response.body).toMatchObject(new UserDTO(userReq));
    });

    it('should return a code 400 if dto is not valid', async () => {
        UserService.prototype.createUser = mockOk;
        UserCreateReqDTO.prototype.validateMe = mockThrow;

        await fakePost(Route.USER, userReq).expect(400);
    });

    it('should return a code 500 if service throws', async () => {
        UserService.prototype.createUser = mockAsyncThrow;
        UserCreateReqDTO.prototype.validateMe = jest.fn();

        await fakePost(Route.USER, userReq).expect(500);
    });
});

describe('update', () => {
    it.todo('');
});

describe('delete', () => {
    it.todo('');
});
