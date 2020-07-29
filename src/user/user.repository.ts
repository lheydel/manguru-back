import { EntityRepository } from 'mikro-orm';
import { Singleton } from 'typescript-ioc';
import { DuplicateError } from '../common/errors/duplicate.error';
import { NotFoundError } from '../common/errors/not-found.error';
import mikro from '../config/mikro';
import { User } from './user.model';

@Singleton
export class UserRepository {

    private db: EntityRepository<User> = mikro.getRepository(User);

    /**
     * Create a new user in db
     * @param user the user to create
     * @return the newly created user, including the auto generated fields
     */
    public async save(user: User): Promise<User> {
        // check if duplicate
        const userFound = await this.findByEmail(user.email);
        if (userFound) {
            throw new DuplicateError('User already exists');
        } // else

        await this.db.persistAndFlush(user);
        return user;
    }

    /**
     * Update a user in db
     * @param data the user to update
     * @return the updated user
     */
    public async update(id: string, data: Partial<User>): Promise<User> {
        const oldUser = await this.findByIdWithCheck(id);
        oldUser.assign(data);

        await this.db.persistAndFlush(oldUser);
        return oldUser;
    }

    /**
     * Find all the users in db
     * @return an array with all the users found
     */
    public async all(): Promise<Array<User>> {
        return await this.db.findAll();
    }

    /**
     * Find the user with the given id
     * @param id the id of the user
     * @return the user found if it exists,
     *         null if it doesn't
     */
    public async findById(id: string): Promise<User | null> {
        return await this.db.findOne(id);
    }

    /**
     * Find the user with the given id
     * @param id the id of the user
     * @return the user found
     * @throw NotFoundError if the user does not exists
     */
    public async findByIdWithCheck(id: string): Promise<User> {
        const user = await this.findById(id);

        if (!user) {
            throw new NotFoundError(`User not found (id: ${id})`);
        } // else

        return user;
    }

    /**
     * Find the user with the given email
     * @param email the email of the user if it exists,
     *              null if it doesn't
     */
    public async findByEmail(email: string): Promise<User | null> {
        return await this.db.findOne({ email });
    }
}
