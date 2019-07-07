import { User } from '../../../src/user/user.model';
import { VersionStruct } from '../../../src/common/properties';

export const userLatest: User = {
    vs: VersionStruct.USER,
    email: 'user@latest.com',
    username: 'SandraGeffroi'
};

export const userV1: User = {
    ...userLatest,
    vs: 1,
    email: 'user@v1.com',
    username: '',
    name: userLatest.username
};
