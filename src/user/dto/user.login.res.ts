import { UserDTO } from './user.dto';
import { User } from '../user.model';

export class UserLoginResponse {
    user: UserDTO;
    token: string;

    constructor(user: User, token: string) {
        this.user = new UserDTO(user);
        this.token = token;
    }
}
