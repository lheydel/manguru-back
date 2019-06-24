import { prop, Typegoose } from 'typegoose';

export class User extends Typegoose {
    @prop({ required: true, unique: true })
    private email: String;

    @prop({ required: true })
    private name: String;

    constructor(email?: String, name?: String) {
        super();
        this.email = email;
        this.name = name;
    }

    public setEmail(email: String) {
        this.email = email;
    }

    public getEmail(): String {
        return this.email;
    }

    public setName(name: String) {
        this.name = name;
    }

    public getName(): String {
        return this.name;
    }
}