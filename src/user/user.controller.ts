import { Request, Response } from 'express';
import { UserService } from './user.service';
import { Inject, Singleton } from 'typescript-ioc';
import { User } from './user.model';
import { UserCreateReqDTO } from './dto/user.create.req.dto';
import { UserDTO } from './dto/user.dto';

@Singleton
export class UserController {

    @Inject
    private userService!: UserService;

    constructor() {
        this.getById = this.getById.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    /**
     * GET /user?id
     * Get a user from it's id
     */
    public getById(req: Request, res: Response) {
        // TODO
    }

    /**
     * POST /user
     * Create a new user from the data contained in the request
     */
    public create(req: Request, res: Response) {
        try {
            // get data from request
            const dto = new UserCreateReqDTO(req.body);
            dto.validateMe();

            // create user
            this.userService.createUser(dto.toUser())
            // success
            .then(newUser => {
                const newDto = new UserDTO(newUser);
                res.status(200).send(newDto);

            // fail
            }).catch(err => {
                const msg = '[User creation failed]: ' + err;
                console.error(msg);
                res.status(500).send(msg);
            });

        } catch (err) {
            console.log(err);
            // res.status(400).send(err);
            res.status(400).send(err);
        }

    }

    /**
     * PUT /user?id
     * Create a user from the data contained in the request
     */
    public update(req: Request, res: Response) {
        // TODO
    }

    /**
     * DELETE /user?id
     * Delete a user from the data contained in the request
     */
    public delete(req: Request, res: Response) {
        // TODO
    }
}
