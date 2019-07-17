import { Request, Response } from 'express';
import { UserService } from './user.service';
import { Inject, Singleton } from 'typescript-ioc';
import { UserCreateRequest } from './dto/user.create.req';
import { UserDTO } from './dto/user.dto';
import { DuplicateError } from '../common/errors/duplicate.error';
import { UserLoginRequest } from './dto/user.login.req';
import jwt from 'jsonwebtoken';
import { UserLoginResponse } from './dto/user.login.res';

@Singleton
export class UserController {

    @Inject
    private userService!: UserService;

    constructor() {
        this.login = this.login.bind(this);
        this.register = this.register.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    /**
     * POST /login
     * Check the crendentials of a user and return a JWT if they are valid
     */
    public login(req: Request, res: Response) {
        try {
            // get data from request
            const dto = new UserLoginRequest(req.body);
            dto.validateMe();

            // check credentials
            this.userService.checkCredentials(dto.email, dto.password)
            // no internal error
            .then(user => {
                if (!user) {
                    // wrong credentials
                    res.status(404).json('Username or password incorrect');
                } else {
                    // generate jwt
                    jwt.sign({id: user.id!}, process.env.JWT_SECRET || 'DEFAULT', { expiresIn: 86400 }, (err, token) => {
                        if (err) {
                            // error while generating jwt
                            console.error('[User login check failed]: ' + err.message);
                            res.status(500).json(err.message);
                        } else {
                            // send user and jwt
                            res.status(200).json(new UserLoginResponse(user, token));
                        }
                    });
                }

            // internal error
            }).catch(err => {
                console.error('[User login check failed]: ' + err.message);
                res.status(500).json(err.message);
            });

        } catch (err) {
            // wrong request
            console.error(err);
            res.status(400).json(err.message);
        }
    }

    /**
     * POST /user
     * Create a new user from the data contained in the request
     */
    public register(req: Request, res: Response) {
        try {
            // get data from request
            const dto = new UserCreateRequest(req.body);
            dto.validateMe();

            // create user
            this.userService.createUser(dto.toUser())
            // success
            .then(newUser => {
                const newDto = new UserDTO(newUser);
                res.status(200).json(newDto);

            // fail
            }).catch(err => {
                const msg = '[User creation failed]: ' + err.message;
                console.error(msg);
                const status = (err instanceof DuplicateError) ? 420 : 500;
                res.status(status).json(msg);
            });

        } catch (err) {
            // wrong request
            console.error(err);
            res.status(400).json(err.message);
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
