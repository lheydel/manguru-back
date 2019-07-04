export class BaseEntity {
    id?: string;
    vs: number;
    createdAt?: string;
    updatedAt?: string;

    constructor(id?: string, vs: number = 0, createdAt?: string, updatedAt?: string) {
        this.id = id;
        this.vs = vs;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
