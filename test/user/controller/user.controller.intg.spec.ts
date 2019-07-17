import { Route } from '../../../src/common/properties';
import { fakePost } from '../../test.utils';
import { userLatest } from '../user.constants.intg';
import { UserDTO } from '../../../src/user/dto/user.dto';
import { UserCreateRequest } from '../../../src/user/dto/user.create.req';
import { prisma } from '../../../prisma/generated/prisma-client';
import { UserLoginRequest } from '../../../src/user/dto/user.login.req';
import { UserLoginResponse } from '../../../src/user/dto/user.login.res';
import { User } from '../../../src/user/user.model';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { UserService } from '../../../src/user/user.service';

beforeEach(async () => {
    await prisma.deleteManyUsers();
});

afterAll(async () => {
    await prisma.deleteManyUsers();
});

describe('login', () => {
    const user = userLatest();
    user.password = bcrypt.hashSync(user.password, 2);

    it('should return a jwt and the user logged', async () => {
        const newUser = await prisma.createUser(user);

        const response = await fakePost(Route.LOGIN, new UserLoginRequest(userLatest())).expect(200);
        expect(response.body).toMatchObject(new UserLoginResponse(newUser, expect.anything()));
        expect(jwt.verify(response.body.token, process.env.JWT_TOKEN || 'DEFAULT')).toBeDefined();
    });

    it('should return a code 404 if credentials are not valid', async () => {
        await fakePost(Route.LOGIN, new UserLoginRequest(user)).expect(404);
    });

    it('should return a code 400 if dto is not valid', async () => {
        await fakePost(Route.LOGIN, new UserLoginRequest({})).expect(400);
    });
});

describe('register', () => {
    const userReq = new UserCreateRequest(userLatest());
    const expectedUser = {...new UserDTO(userReq), id: expect.anything()};

    it('should return the newly created user with status 200', async () => {
        const response = await fakePost(Route.USER, userReq).expect(200);
        expect(response.body).toMatchObject(expectedUser);
    });

    it('should return a code 400 if dto is not valid', async () => {
        await fakePost(Route.USER, {}).expect(400);
    });

    it('should return a code 420 if duplicate user', async () => {
        await prisma.createUser(userLatest());
        await fakePost(Route.USER, userReq).expect(420);
    });
});

describe('update', () => {
    it.todo('');
});

describe('delete', () => {
    it.todo('');
});
