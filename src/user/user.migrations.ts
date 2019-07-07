import { User } from './user.model';
import { UserService } from './user.service';
import { VersionStruct } from '../common/properties';
import { BaseMigrator } from '../common/base.migrations';
import { Singleton, Inject } from 'typescript-ioc';

// tslint:disable: deprecation no-switch-case-fall-through
@Singleton
export class UserMigrator implements BaseMigrator<User> {

    @Inject
    userService!: UserService;

    /**
     * Check and migrate all users to the latest version struct
     */
    async doMigrations(): Promise<User[]> {
        // get all users
        // that need migrations
        // and upgrade them
        const users = (await this.userService.getAll())
                      .filter(this.needMigration)
                      .map(this.upgradeVersionStruct.bind(this));

        // save upgraded users in db
        return await this.userService.updateUserList(users);
    }

    /**
     * Check if a given user must be updated or not
     * @param user the user to check
     * @return true must be updated,
     *         false if the user is null or doesn't need any update
     */
    public needMigration(user: User): boolean {
        return user.vs < VersionStruct.USER;
    }

    /**
     * Update the version struct of a given user
     * @param user the user to update
     * @return the updated user
     */
    public upgradeVersionStruct(user: User): User {
        switch (user.vs) {
            case 1: this._fromVs1To2(user); // FALLTHROUGH
            // case 2: UserMigrations._fromVs2To3(user); // FALLTHROUGH
            // case 3: UserMigrations._fromVs3To4(user); // FALLTHROUGH
            // case 4: UserMigrations._fromVs4To5(user); // FALLTHROUGH
            // case 5: UserMigrations._fromVs5To6(user); // FALLTHROUGH
        }
        return user;
    }

    /**
     * Update version struct from 1 to 2
     * Changes:
     *  - change [name] into [username]
     *
     * 2019/07/05
     * (this migration just serves as example so it's not realy useful)
     */
    private _fromVs1To2(user: User) {
        user.username = user.name || '';
        user.name = undefined;
        user.vs = 2;
    }
}
