import { User } from '../../src/user/user.model';
import { VersionStruct } from '../../src/common/properties';

export const userLatest: User = {
    vs: VersionStruct.USER,
    email: 'user@latest.com',
    username: 'SandraGeffroi',
    password: 'bestpwdever'
};

export const userV1: User = {
    ...userLatest,
    vs: 1,
    email: 'user@v1.com',
    username: '',
    name: userLatest.username
};

export const userList: User[] = [
    {...userLatest},
    {...userLatest, email: userLatest.email + '_1'},
    {...userLatest, email: userLatest.email + '_2'}
];
