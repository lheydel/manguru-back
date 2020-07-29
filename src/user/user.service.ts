import bcrypt from 'bcrypt';
import { Inject, Singleton } from 'typescript-ioc';
import { BaseService } from '../common/base.service';
import { User } from './user.model';
import { UserRepository } from './user.repository';
import { ObjectID } from 'bson';

@Singleton
export class UserService extends BaseService {

    @Inject
    private userRepository!: UserRepository;

    /**
     * Create a new user and save it in db
     * @param user the user to create
     * @returns the newly created user, including the auto-generated fields
     */
    public async createUser(user: User): Promise<User> {
        // check required fields
        const op = 'Create user';
        this.checkString(user.email, op, 'email');
        this.checkString(user.username, op, 'username');
        this.checkString(user.password, op, 'password');

        // hash password and save user
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
        this.checkString(id, 'Update user', 'id');
        return await this.userRepository.update(id, user);
    }

    /**
     * Update the password of a user in db
     * @param id the id of the user to update
     * @param password the new password
     * @return the updated user
     */
    public async updatePassword(id: string, password: string): Promise<User> {
        this.checkString(id, 'Update password', 'id');
        password = await bcrypt.hash(password, 10);
        return this.userRepository.update(id, { password });
    }

    /**
     * Update the rememberMe field of a user in db
     * @param id the id of the user to update
     * @param remmberMe the new value
     * @return the updated user
     */
    public async updateRememberMe(id: string, rememberMe: boolean): Promise<User> {
        this.checkString(id, 'Update rememberMe', 'id');
        return this.userRepository.update(id, { rememberMe });
    }

    /**
     * Update multiple users in db
     * @param users the users to update. Each user must have a valid id
     */
    public async updateUserList(users: User[]) {
        return await Promise.all(users.map(async user => await this.updateUser(user.id, user)));
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
