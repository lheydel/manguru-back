import { isValidString } from '../../common/utils';
import { User } from '../user.model';
import { UserDTO } from './user.dto';

export class UserCreateRequest extends UserDTO {

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
        if (!isValidString(this.password)) {
            this.addEmptyFieldError('password');
        }
    }
}
