import { BaseEntity } from '../common/base.model';
import { VersionStruct } from '../common/properties';

export class User extends BaseEntity {
    email = '';
    password = '';
    username = '';

    /** @deprecated 2019/07/05 - vs2 - use [username] property instead */
    name ?= '';

    constructor(id?: string) {
        super(id, VersionStruct.USER);
    }
}
