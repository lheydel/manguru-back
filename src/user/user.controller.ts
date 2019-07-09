import { Request, Response } from 'express';
import { UserService } from './user.service';
import { Inject, Singleton } from 'typescript-ioc';
import { User } from './user.model';

@Singleton
export class UserController {

    @Inject
    private userService!: UserService;

    // test
    // /users/name
    public getName(req: Request, res: Response) {
        // res.send('Larry Golade\n' + this.userService.blblbl());
        // this.userService.getAll().then(users => {
        //     // const user = new User(users[0]._doc.email, users[0]._doc.name);
        //     res.send('getAll: ' + users);
        // }).catch(err => {
        //     res.send('getAll failed: ' + err);
        // });
        res.send('Sandra Geffroi');
    }

    // test
    // /users/create
    public create(req: Request, res: Response) {
        const user = new User('sandra.geffroi@gmail.com', 'Sandra Geffroi');
        this.userService.createUser(user)
        // success
        .then(newUser => {
            res.send('User created ;)\n' + newUser);

        // fail
        }).catch(err => {
            res.send('[User creation failed]: ' + err);
        });
    }
}
