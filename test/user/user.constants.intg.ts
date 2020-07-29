import { User } from '../../src/user/user.model';
import { VersionStruct } from '../../src/common/properties';

// tslint:disable: deprecation

export function userLatest(): User {
    const user = new User();
    user.vs = VersionStruct.USER;
    user.email = 'user@latest.com';
    user.username = 'SandraGeffroi';
    user.password = 'bestpwdever';
    user.rememberMe = true;
    return user;
}

export function userV1(): User {
    const user = userLatest();
    user.vs = 1;
    user.email = 'user@v1.com';
    user.name = user.username;
    user.username = '';
    return user;
}

export function userList(): User[] {
    const list = new Array(3).fill(null).map((_val, i) => {
        const user = userLatest();
        user.email += '_' + i;
        return user;
    });
    return list;
}
