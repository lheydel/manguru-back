import { User } from '../../src/user/user.model';
import { VersionStruct } from '../../src/common/properties';

export function userLatest(): User {
    return {
        ...new User(),
        vs: VersionStruct.USER,
        email: 'sandra@geffroi',
        username: 'SandraGeffroi',
        password: 'bestpwdever',
        rememberMe: true,
    };
}

export function userV1(): User {
    return {
        ...userLatest(),
        vs: 1,
        username: '',
        name: userLatest().username
    };
}

export function userList(): User[] {
    return [
        userLatest(),
        {...userLatest(), email: userLatest().email + '_1'},
        {...userLatest(), email: userLatest().email + '_2'}
    ];
}
