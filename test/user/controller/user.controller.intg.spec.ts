import { Route } from '../../../src/common/properties';
import { fakePost } from '../../test.utils';
import { userLatest } from '../user.constants.intg';
import { UserDTO } from '../../../src/user/dto/user.dto';
import { UserCreateReqDTO } from '../../../src/user/dto/user.create.req';
import { prisma } from '../../../prisma/generated/prisma-client';

beforeEach(async () => {
    await prisma.deleteManyUsers();
});

describe('getById', () => {
    it.todo('');
});

describe('create', () => {
    const userReq = new UserCreateReqDTO(userLatest);
    const expectedUser = {...new UserDTO(userReq), id: expect.anything()};

    it('should return the newly created user with status 200', async () => {
        const response = await fakePost(Route.USER, userReq).expect(200);
        expect(response.body).toMatchObject(expectedUser);
    });

    it('should return a code 400 if dto is not valid', async () => {
        await fakePost(Route.USER, {}).expect(400);
    });

    it('should return a code 500 if duplicate user', async () => {
        await prisma.createUser(userLatest);
        await fakePost(Route.USER, userReq).expect(500);
    });
});

describe('update', () => {
    it.todo('');
});

describe('delete', () => {
    it.todo('');
});

afterAll(async () => {
    await prisma.deleteManyUsers();
});
