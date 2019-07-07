import { User } from '../../../src/user/user.model';
import { VersionStruct } from '../../../src/common/properties';

export const userLatest: User = {
    vs: VersionStruct.USER,
    email: 'sandra@geffroi',
    username: 'SandraGeffroi'
};

export const userV1: User = {
    ...userLatest,
    vs: 1,
    username: '',
    name: userLatest.username
};
