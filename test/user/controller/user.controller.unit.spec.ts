import { UserController } from '../../../src/user/user.controller';
import { Route } from '../../../src/common/properties';
import { fakePost } from '../../test.utils';
import { userLatest } from '../user.constants.unit';
import { UserService } from '../../../src/user/user.service';
import { UserDTO } from '../../../src/user/dto/user.dto';
import { UserCreateRequest } from '../../../src/user/dto/user.create.req';
import jwt from 'jsonwebtoken';
import { UserLoginRequest } from '../../../src/user/dto/user.login.req';
import { UserLoginResponse } from '../../../src/user/dto/user.login.res';

it('should be defined', () => {
    expect(new UserController()).toBeDefined();
});


const mockThrow = jest.fn().mockImplementation(() => { throw new Error('sync'); });
const mockAsyncOk = jest.fn().mockResolvedValue(userLatest());
const mockAsyncThrow = jest.fn().mockRejectedValue(new Error('async'));

describe('login', () => {
    const mockLoginErr = jest.fn().mockResolvedValue(null);
    const mockJwtOk = jest.fn().mockImplementation((_payload: any, _secret: any, _opt: any, callback: Function) => {
        callback(null, 'token');
    });
    const mockJwtErr = jest.fn().mockImplementation((_payload: any, _secret: any, _opt: any, callback: Function) => {
        callback('error');
    });
    const loginReq = new UserLoginRequest(userLatest());

    it('should return a jwt and the user logged', async () => {
        UserLoginRequest.prototype.validateMe = jest.fn();
        UserService.prototype.checkCredentials = mockAsyncOk;
        jwt.sign = mockJwtOk;

        const response = await fakePost(Route.LOGIN, loginReq).expect(200);
        expect(response.body).toMatchObject(new UserLoginResponse(userLatest(), 'token'));
    });

    it('should return a code 404 if credentials are not valid', async () => {
        UserLoginRequest.prototype.validateMe = jest.fn();
        UserService.prototype.checkCredentials = mockLoginErr;

        await fakePost(Route.LOGIN, loginReq).expect(404);
    });

    it('should return a code 400 if dto is not valid', async () => {
        UserLoginRequest.prototype.validateMe = mockThrow;

        await fakePost(Route.LOGIN, loginReq).expect(400);
    });

    it('should return a code 500 if service throws', async () => {
        UserLoginRequest.prototype.validateMe = jest.fn();
        UserService.prototype.checkCredentials = mockAsyncThrow;

        await fakePost(Route.LOGIN, loginReq).expect(500);
    });

    it('should return a code 500 if jwt generation fails', async () => {
        UserLoginRequest.prototype.validateMe = jest.fn();
        UserService.prototype.checkCredentials = mockAsyncOk;
        jwt.sign = mockJwtErr;

        await fakePost(Route.LOGIN, loginReq).expect(500);
    });
});

describe('register', () => {
    const userReq = new UserCreateRequest(userLatest());

    it('should return the newly created user with status 200', async () => {
        UserService.prototype.createUser = mockAsyncOk;
        UserCreateRequest.prototype.validateMe = jest.fn();

        const response = await fakePost(Route.USER, userReq).expect(200);
        expect(response.body).toMatchObject(new UserDTO(userReq));
    });

    it('should return a code 400 if dto is not valid', async () => {
        UserService.prototype.createUser = mockAsyncOk;
        UserCreateRequest.prototype.validateMe = mockThrow;

        await fakePost(Route.USER, userReq).expect(400);
    });

    it('should return a code 500 if service throws', async () => {
        UserService.prototype.createUser = mockAsyncThrow;
        UserCreateRequest.prototype.validateMe = jest.fn();

        await fakePost(Route.USER, userReq).expect(500);
    });
});

describe('update', () => {
    it.todo('');
});

describe('delete', () => {
    it.todo('');
});
