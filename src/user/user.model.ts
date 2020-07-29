import { Entity, Property } from 'mikro-orm';
import { BaseEntity } from '../common/base.model';
import { VersionStruct } from '../common/properties';

@Entity()
export class User extends BaseEntity {
    @Property({ unique: true })
    email: string;

    @Property()
    password: string;

    @Property()
    username: string;

    @Property()
    rememberMe: boolean;

    /** @deprecated 2019/07/05 - vs2 - use [username] property instead */
    @Property()
    name?: string;

    constructor(id?: string) {
        super(id, VersionStruct.USER);
        this.email = '';
        this.password = '';
        this.username = '';
        this.rememberMe = false;
    }
}
