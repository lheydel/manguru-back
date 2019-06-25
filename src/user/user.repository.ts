import { Singleton } from 'typescript-ioc';
import { prisma } from '../../prisma/generated/prisma-client';
import { User } from './user.model';

@Singleton
export class UserRepository {

    public async save(user: User): Promise<User> {
        return await prisma.createUser(user);
    }

    public async getAll(): Promise<Array<User>> {
        return await prisma.users();
    }
}
