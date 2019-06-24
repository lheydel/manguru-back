import { Singleton, Inject } from 'typescript-ioc';
import { UserRepository } from './user.repository';
import { User } from './user.model';


@Singleton
export class UserService {

    @Inject
    private userRepository: UserRepository;

    public blblbl(): String {
        return 'Blblbl!';
    }

    public async createUser(email: String, name: String) {
        await this.userRepository.save(new User(email, name));
    }
}