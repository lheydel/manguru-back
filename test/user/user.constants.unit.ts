import { User } from '../../src/user/user.model';
import { VersionStruct } from '../../src/common/properties';

export const userLatest: User = {
    vs: VersionStruct.USER,
    id: 'id',
    email: 'sandra@geffroi',
    username: 'SandraGeffroi',
    password: 'bestpwdever'
};

export const userV1: User = {
    ...userLatest,
    vs: 1,
    username: '',
    name: userLatest.username
};

export const userList: User[] = [
    userLatest,
    {...userLatest, email: userLatest.email + '_1'},
    {...userLatest, email: userLatest.email + '_2'}
];
