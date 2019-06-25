import { BaseEntity } from '../common/base.model';

export class User extends BaseEntity {
    email: string;
    name: string;

    constructor(email: string, name: string, id?: string, vs?: number, createdAt?: string, updatedAt?: string) {
        super(id, vs, createdAt, updatedAt);
        this.email = email;
        this.name = name;
    }
}
