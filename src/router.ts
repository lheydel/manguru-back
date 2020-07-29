import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import { RequestContext } from 'mikro-orm';
import morgan from 'morgan';
import { Route } from './common/properties';
import mikro from './config/mikro';
import passport, { jwtAuth } from './config/passport';
import { UserController } from './user/user.controller';

const app = express();

/* ====== CONFIG ====== */

// mikro orm
app.use((_req, _res, next) => RequestContext.create(mikro.orm.em, next));

// express
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS requests
app.use(cors({ credentials: true, origin: true }));

// passport
app.use(passport.initialize());

// logs
app.use(morgan('combined'));

/* ====== ROUTES ====== */

// users
const userController = new UserController();
app.route(Route.LOGIN)
    .get(jwtAuth, userController.loginJWT)
    .post(userController.login);

app.route(Route.USER)
    .post(userController.register);

app.route(Route.USER + '/:id')
    .put(jwtAuth, userController.update)
    .delete(jwtAuth, userController.delete);

export default app;
