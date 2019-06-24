import { User } from './user.model';
import { Singleton } from 'typescript-ioc';

@Singleton
export class UserRepository {

    private UserModel = new User().getModelForClass(User);

    public async save(user: User) {
        const userDoc = new this.UserModel(user);
        await userDoc.validate().catch(err => { throw err; });
        await userDoc.save().catch(err => { throw err; });
    }
}