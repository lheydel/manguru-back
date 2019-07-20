import { BaseDTO } from '../../common/base.dto';
import { isValidString } from '../../common/utils';

export class UserLoginRequest extends BaseDTO {

    email: string;
    password: string;
    rememberMe: boolean;

    constructor(data: any) {
        super();
        this.email = data ? data.email : '';
        this.password = data ? data.password : '';
        this.rememberMe = data && data.rememberMe;
    }

    public validateMe() {
        this.checkFields();
        this.throwIfError();
    }

    protected checkFields() {
        // check email
        if (!isValidString(this.email)) {
            this.addEmptyFieldError('email');
        }

        // check password
        if (!isValidString(this.password)) {
            this.addEmptyFieldError('password');
        }
    }
}
