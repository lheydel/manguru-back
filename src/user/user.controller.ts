import { Request, Response } from 'express';
import { UserService } from './user.service';
import { Inject, Singleton } from 'typescript-ioc';

@Singleton
export class UserController {

    @Inject
    private userService: UserService;

    // test
    public getName(req: Request, res: Response) {
        res.send('Larry Golade\n' + this.userService.blblbl());
    }

    // test
    public async create(req: Request, res: Response) {
        try {
            await this.userService.createUser('sandra.geffroi@gmail.com', 'Sandra Geffroi');
            res.send('User created ;)');
        } catch (err) {
            res.send('[User creation failed]: ' + err);
        }
    }
}
