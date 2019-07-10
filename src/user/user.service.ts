import { Singleton, Inject } from 'typescript-ioc';
import { UserRepository } from './user.repository';
import { User } from './user.model';


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
        return await this.userRepository.save(user);
    }

    /**
     * Update a user in db
     * @param id the id of the user to update
     * @param user the info of the user to update
     * @return the updated user
     */
    public async updateUser(id: string, user: User): Promise<User> {
        if (id === '') {
            throw new Error('Update user: id cannot be empty');
        }

        user.id = id;
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
    public async getAll(): Promise<Array<User>> {
        return await this.userRepository.getAll();
    }
}
