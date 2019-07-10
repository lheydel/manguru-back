import { BaseDTO } from '../../common/base.dto';
import { User } from '../user.model';

export class UserDTO extends BaseDTO {

    id?: string;
    email: string;
    username: string;

    constructor(data: any) {
        super();
        this.id = data.id;
        this.email = data.email;
        this.username = data.username;
    }

    /**
     * Transform the dto into an actual User
     */
    public toUser(): User {
        return {
            ...new User(this.id),
            email: this.email,
            username: this.username
        };
    }

    public checkFields() {
        // check email
        if (!this.isValidString(this.email)) {
            this.addEmptyFieldError('email');
        }

        // check username
        if (!this.isValidString(this.username)) {
            this.addEmptyFieldError('username');
        }
    }

    public validateMe() {
        this.checkFields();
        this.throwIfError();
    }
}
