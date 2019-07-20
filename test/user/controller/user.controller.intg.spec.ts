import bcrypt from 'bcrypt';
import { prisma } from '../../../prisma/generated/prisma-client';
import { Route } from '../../../src/common/properties';
import { UserCreateRequest } from '../../../src/user/dto/user.create.req';
import { UserDTO } from '../../../src/user/dto/user.dto';
import { UserLoginRequest } from '../../../src/user/dto/user.login.req';
import { fakeGet, fakePost } from '../../test.utils';
import { userLatest } from '../user.constants.intg';

beforeEach(async () => {
    await prisma.deleteManyUsers();
});

afterAll(async () => {
    await prisma.deleteManyUsers();
});

describe('loginJwt', () => {
    const user = userLatest();
    const rawPwd = user.password;
    user.password = bcrypt.hashSync(rawPwd, 2);

    it.only('should return the user logged', async () => {
        // create user and get jwt
        const newUser = await prisma.createUser(user);
        const res = (await fakePost(Route.LOGIN, new UserLoginRequest({...newUser, password: rawPwd})));

        const response = await fakeGet(Route.LOGIN, res.header['set-cookie']).expect(200);
        expect(response.body).toMatchObject(new UserDTO(newUser));
    });

    it('should return a code 401 when jwt is not valid', async () => {
        await fakeGet(Route.LOGIN).expect(401);
    });
});

describe('login', () => {
    const user = userLatest();
    user.password = bcrypt.hashSync(user.password, 2);

    it('should return the user logged', async () => {
        const newUser = await prisma.createUser(user);

        const response = await fakePost(Route.LOGIN, new UserLoginRequest(userLatest())).expect(200);
        expect(response.body).toMatchObject(new UserDTO(newUser));
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
