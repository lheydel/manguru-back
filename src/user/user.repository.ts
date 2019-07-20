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
        const userInput = this._toFullUpdateInput(user);
        return this._doUpdate(user.id || '', userInput);
    }

    /**
     * Update the password of a user in db
     * @param id the id of the user to update
     * @param password the new password
     * @return the updated user
     */
    public async updatePassword(id: string, password: string): Promise<User> {
        return this._doUpdate(id, { password });
    }

    /**
     * Update the rememberMe field of a user in db
     * @param id the id of the user to update
     * @param remmberMe the new value
     * @return the updated user
     */
    public async updateRememberMe(id: string, rememberMe: boolean): Promise<User> {
        return this._doUpdate(id, { rememberMe });
    }

    /**
     * Format a given user to match the prisma update input interface
     * @param user the user to format
     * @return the formatted user
     */
    private _toFullUpdateInput(user: User): UserUpdateInput {
        return {
            vs: user.vs,
            email: user.email,
            username: user.username,
            password: user.password,
            rememberMe: user.rememberMe,

            // deprecated fields
            name: undefined
        };
    }

    /**
     * Do the actual update of a given user
     * @param id the id of the user to update
     * @param user the info to update on the user
     * @return the updated user
     */
    private async _doUpdate(id: string, user: UserUpdateInput): Promise<User> {
        return await prisma.updateUser({
            data: user,
            where: {
                id: id
            }
        });
    }

    /**
     * Find all the users in db
     * @return an array with all the users found
     */
    public async all(): Promise<Array<User>> {
        return await prisma.users();
    }

    /**
     * Find the user with the given id
     * @param id the id of the user
     * @return the user found if it exists,
     *         null if it doesn't
     */
    public async findById(id: string): Promise<User | null> {
        return await prisma.user({id: id});
    }

    /**
     * Find the user with the given email
     * @param email the email of the user if it exists,
     *              null if it doesn't
     */
    public async findByEmail(email: string): Promise<User | null> {
        return await prisma.user({email: email});
    }
}
