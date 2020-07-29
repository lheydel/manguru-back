import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Inject, Singleton } from 'typescript-ioc';
import { DuplicateError } from '../common/errors/duplicate.error';
import { UserCreateRequest } from './dto/user-create.req';
import { UserDTO } from './dto/user.dto';
import { UserLoginRequest } from './dto/user-login.req';
import { UserService } from './user.service';
import { User } from './user.model';

@Singleton
export class UserController {

    @Inject
    private userService!: UserService;

    constructor() {
        this.loginJWT = this.loginJWT.bind(this);
        this.login = this.login.bind(this);
        this.register = this.register.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    /**
     * GET /login
     * Return a user after a jwt only authentication
     */
    public loginJWT(req: Request, res: Response) {
        const user = req.user! as User; // tmp quickfix just to build the app
        this._setJwtCookie(res, user, user.rememberMe)
            .then(resp => {
                resp.status(200)
                    .json(new UserDTO(req.user));

            }).catch(err => {
                console.error('[User login JWT check failed]: ' + err.message);
                res.status(500).json(err.message);
            });
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
                .then(async user => {
                    if (!user) {
                        // wrong credentials
                        res.status(404).json('Username or password incorrect');
                    } else {
                        try {
                            // set rememberMe
                            await this.userService.updateRememberMe(user.id || '', dto.rememberMe);

                            // send jwt cookie and user
                            res = await this._setJwtCookie(res, user, dto.rememberMe);
                            res.status(200)
                                .json(new UserDTO(user));
                        } catch (err) {
                            console.error('[User login check failed]: ' + err.message);
                            res.status(500).json(err.message);
                        }
                    }
                })
                // internal error
                .catch(err => {
                    console.error('[User login check failed]: ' + err.message);
                    res.status(500).json(err.message);
                });

        } catch (err) {
            // wrong request
            console.error(err.message);
            res.status(400).json(err.message);
        }
    }

    private async _setJwtCookie(res: Response, user: User, rememberMe: boolean): Promise<Response> {
        // generate token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'DEFAULT');

        // remember for 30 days
        const maxAge = rememberMe ? { maxAge: 30 * 24 * 60 * 60 * 1000 } : {};

        // set jwt cookie
        return res.cookie('Authorization', token, maxAge);
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
                    const msg = '[User creation failed]: ' + err;
                    console.error(msg);
                    const status = (err instanceof DuplicateError) ? 420 : 500;
                    res.status(status).json(msg);
                });

        } catch (err) {
            // wrong request
            console.error(err.message);
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
