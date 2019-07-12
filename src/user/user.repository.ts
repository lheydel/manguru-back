import { Singleton } from 'typescript-ioc';
import { prisma, UserUpdateInput } from '../../prisma/generated/prisma-client';
import { User } from './user.model';

@Singleton
export class UserRepository {

    /**
     * Create a new user in db
     * @param user the user to create
     * @return the newly created user, including the auto generated fields
     */
    public async save(user: User): Promise<User> {
        return await prisma.createUser(user);
    }

    /**
     * Update a user in db
     * @param user the user to update
     * @return the updated user
     */
    public async update(user: User): Promise<User> {
        const userInput = this._toUpdateInput(user);
        const updatedUser = await prisma.updateUser({
            data: userInput,
            where: {
                id: user.id
            }
        });

        return updatedUser;
    }

    /**
     * Format a given user to match the prisma update input interface
     * @param user the user to format
     * @return the formatted user
     */
    private _toUpdateInput(user: User): UserUpdateInput {
        return {
            vs: user.vs,
            email: user.email,
            username: user.username,

            // deprecated fields
            name: undefined
        };
    }

    /**
     * Get all users in db
     * @return an array with all the users found
     */
    public async all(): Promise<Array<User>> {
        return await prisma.users();
    }
}
