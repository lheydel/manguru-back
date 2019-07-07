import { BaseEntity } from '../common/base.model';
import { VersionStruct } from '../common/properties';

export class User extends BaseEntity {
    email: string;
    username: string;

    /** @deprecated 2019/07/05 - vs2 - use [username] property instead */
    name ?= '';

    constructor(email: string, username: string, id?: string) {
        super(id, VersionStruct.USER);
        this.email = email;
        this.username = username;
    }
}
