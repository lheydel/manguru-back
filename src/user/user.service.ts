import { Singleton, Inject } from 'typescript-ioc';
import { UserRepository } from './user.repository';
import { User } from './user.model';


@Singleton
export class UserService {

    @Inject
    private userRepository: UserRepository;

    public async createUser(user: User): Promise<User> {
        return await this.userRepository.save(user);
    }

    public async getAll(): Promise<Array<User>> {
        return this.userRepository.getAll();
    }
}
