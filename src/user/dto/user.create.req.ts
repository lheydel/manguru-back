import { UserDTO } from './user.dto';
import { User } from '../user.model';

export class UserCreateReqDTO extends UserDTO {

    password: string;

    constructor(data: any) {
        super(data);
        this.password = data ? data.password : '';
    }

    /**
     * Transform the dto into an actual User
     */
    public toUser(): User {
        return {
            ...super.toUser(),
            password: this.password
        };
    }

    public validateMe() {
        this.checkFields();
        this.throwIfError();
    }

    protected checkFields() {
        super.checkFields();

        // check password
        if (!this.isValidString(this.password)) {
            this.addEmptyFieldError('password');
        }
    }
}
