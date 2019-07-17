import { User } from '../../src/user/user.model';
import { VersionStruct } from '../../src/common/properties';

export function userLatest(): User {
    return {
        vs: VersionStruct.USER,
        email: 'user@latest.com',
        username: 'SandraGeffroi',
        password: 'bestpwdever'
    };
}

export function userV1(): User {
    return {
        ...userLatest(),
        vs: 1,
        email: 'user@v1.com',
        username: '',
        name: userLatest().username
    };
}

export function userList(): User[] {
    return [
        {...userLatest()},
        {...userLatest(), email: userLatest().email + '_1'},
        {...userLatest(), email: userLatest().email + '_2'}
    ];
}
