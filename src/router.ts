import compression from 'compression';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import passport, { jwtAuth } from './config/passport';

import { Route } from './common/properties';
import { UserController } from './user/user.controller';
import morgan = require('morgan');


const app = express();

/* ====== CONFIG ====== */

// express
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS requests
app.use(cors({credentials: true, origin: true}));

// passport
app.use(passport.initialize());

// logs
app.use(morgan('combined'));

/* ====== ROUTES ====== */

// users
const userController = new UserController();
app.route(Route.LOGIN)
   .post(userController.login);

app.route(Route.USER)
   .post(userController.register);

app.route(Route.USER + '/:id')
   .put(jwtAuth, userController.update)
   .delete(jwtAuth, userController.delete);

export default app;
