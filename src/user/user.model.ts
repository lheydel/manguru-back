import { prop, Typegoose } from 'typegoose';

export class User extends Typegoose {
    @prop({ required: true, unique: true })
    private email: string;

    @prop({ required: true })
    private name: string;

    constructor(email?: string, name?: string) {
        super();
        this.email = email;
        this.name = name;
    }

    public setEmail(email: string) {
        this.email = email;
    }

    public getEmail(): string {
        return this.email;
    }

    public setName(name: string) {
        this.name = name;
    }

    public getName(): string {
        return this.name;
    }
}