import { Singleton, Inject } from 'typescript-ioc';
import { UserRepository } from './user.repository';
import { User } from './user.model';


@Singleton
export class UserService {

    @Inject
    private userRepository: UserRepository;

    public blblbl(): string {
        return 'Blblbl!';
    }

    public async createUser(email: string, name: string) {
        await this.userRepository.save(new User(email, name));
    }
}