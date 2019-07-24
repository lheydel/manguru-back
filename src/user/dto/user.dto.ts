import { BaseDTO } from '../../common/base.dto';
import { isValidString } from '../../common/utils';
import { User } from '../user.model';

export class UserDTO extends BaseDTO {

    id?: string;
    email: string;
    username: string;

    constructor(data: any) {
        super();
        this.id = data ? data.id : '';
        this.email = data ? data.email : '';
        this.username = data ? data.username : '';
    }

    /**
     * Transform the dto into an actual User
     */
    public toUser(): User {
        const user = new User(this.id);
        user.email = this.email;
        user.username = this.username;
        return user;
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

        // check username
        if (!isValidString(this.username)) {
            this.addEmptyFieldError('username');
        }
    }
}
