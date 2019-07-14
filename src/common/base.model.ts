export class BaseEntity {
    id?: string;
    vs: number;
    createdAt?: string;
    updatedAt?: string;

    constructor(id?: string, vs = 1) {
        this.id = id;
        this.vs = vs;
    }
}
