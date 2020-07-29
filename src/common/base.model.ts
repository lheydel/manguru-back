import { PrimaryKey, Property, IEntity } from 'mikro-orm';
import { ObjectID } from 'bson';

export abstract class BaseEntity {
    @PrimaryKey()
    _id: ObjectID;

    @Property()
    vs: number;

    @Property()
    createdAt = new Date();

    @Property({ onUpdate: () => new Date() })
    updatedAt = new Date();

    constructor(id?: string, vs = 1) {
        this._id = new ObjectID(id || 0);
        this.vs = vs;
    }
}

// tslint:disable-next-line: no-empty-interface
export interface BaseEntity extends IEntity<string> { }
