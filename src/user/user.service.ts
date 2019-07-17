import { Singleton, Inject } from 'typescript-ioc';
import { UserRepository } from './user.repository';
import { User } from './user.model';
import bcrypt from 'bcrypt';
import { DuplicateError } from '../common/errors/duplicate.error';

@Singleton
export class UserService {

    @Inject
    private userRepository!: UserRepository;

    /**
     * Create a new user and save it in db
     * @param user the user to create
     * @returns the newly created user, including the auto-generated fields
     */
    public async createUser(user: User): Promise<User> {
        // check password
        if (!user.password || user.password.length === 0) {
            throw new Error('Create user: password cannot be empty');
        } // else

        // check if duplicate
        const userFound = await this.userRepository.findByEmail(user.email);
        if (userFound) {
            throw new DuplicateError('User already exists');
        } // else

        user.password = await bcrypt.hash(user.password, 10);
        return await this.userRepository.save(user);
    }

    /**
     * Update a user in db
     * @param id the id of the user to update
     * @param user the info of the user to update
     * @return the updated user
     */
    public async updateUser(id: string, user: User): Promise<User> {
        // check id
        if (id.trim().length === 0) {
            throw new Error('Update user: id cannot be empty');
        } // else
        user.id = id;

        // if password changes, hash it
        if (user.password != null && user.password.length > 0) {
            user.password = await bcrypt.hash(user.password, 10);
        }

        return await this.userRepository.update(user);
    }

    /**
     * Update multiple users in db
     * @param users the users to update. Each user must have a valid id
     */
    public async updateUserList(users: User[]) {
        return await Promise.all(users.map(async user => await this.updateUser(user.id || '', user)));
    }

    /**
     * Get all the known users
     * @return an array with all the users found
     */
    public async getAllUsers(): Promise<Array<User>> {
        return await this.userRepository.all();
    }

    /**
     * Get the user with a given id
     * @param id the id of the user to get
     * @return the user found if it exists,
     *         null if it doesn't
     */
    public async getUserById(id: string): Promise<User | null> {
        return await this.userRepository.findById(id);
    }

    /**
     * Check if the given credentials are valid
     * @return the concerned user if the credentials are valid,
     *         null if they are not
     */
    public async checkCredentials(email: string, password: string): Promise<User | null> {
        const user = await this.userRepository.findByEmail(email);
        // if user found and credentials valid
        if (user && (await bcrypt.compare(password, user.password))) {
            return user;
        } // else

        return null;
    }
}
