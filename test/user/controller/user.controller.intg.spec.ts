import bcrypt from 'bcrypt';
import { EntityRepository } from 'mikro-orm';
import { Route } from '../../../src/common/properties';
import mikro, { mikroInit } from '../../../src/config/mikro';
import { UserCreateRequest } from '../../../src/user/dto/user-create.req';
import { UserLoginRequest } from '../../../src/user/dto/user-login.req';
import { UserDTO } from '../../../src/user/dto/user.dto';
import { User } from '../../../src/user/user.model';
import { fakeGet, fakePost } from '../../test.utils';
import { userLatest } from '../user.constants.intg';

let userDb: EntityRepository<User>;

beforeAll(async () => {
    await mikroInit();
    userDb = mikro.getRepository(User);
});

beforeEach(async () => {
    await userDb.remove({}, true);
});

afterAll(async () => {
    await userDb.remove({}, true);
});

describe('loginJwt', () => {
    const user = userLatest();
    const rawPwd = user.password;
    user.password = bcrypt.hashSync(rawPwd, 2);

    it('should return the user logged', async () => {
        // create user and get jwt
        await userDb.persistAndFlush(user);
        const res = (await fakePost(Route.LOGIN, new UserLoginRequest({...user, password: rawPwd})));

        const response = await fakeGet(Route.LOGIN, res.header['set-cookie']).expect(200);
        expect(response.body).toMatchObject(new UserDTO(user));
    });

    it('should return a code 401 when jwt is not valid', async () => {
        await fakeGet(Route.LOGIN).expect(401);
    });
});

describe('login', () => {
    const user = userLatest();
    user.password = bcrypt.hashSync(user.password, 2);

    it('should return the user logged', async () => {
        await userDb.persistAndFlush(user);

        const response = await fakePost(Route.LOGIN, new UserLoginRequest(userLatest())).expect(200);
        expect(response.body).toMatchObject(new UserDTO(user));
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
        await userDb.persistAndFlush(userLatest());
        await fakePost(Route.USER, userReq).expect(420);
    });
});

describe('update', () => {
    it.todo('');
});

describe('delete', () => {
    it.todo('');
});
