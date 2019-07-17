import { BaseDTO } from '../../common/base.dto';

export class UserLoginRequest extends BaseDTO {

    email: string;
    password: string;

    constructor(data: any) {
        super();
        this.email = data ? data.email : '';
        this.password = data ? data.password : '';
    }

    public validateMe() {
        this.checkFields();
        this.throwIfError();
    }

    protected checkFields() {
        // check email
        if (!this.isValidString(this.email)) {
            this.addEmptyFieldError('email');
        }

        // check password
        if (!this.isValidString(this.password)) {
            this.addEmptyFieldError('password');
        }
    }
}
