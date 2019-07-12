import compression from 'compression';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import * as indexController from './index';
import { UserController } from './user/user.controller';
import { Route } from './common/properties';


const app = express();

/* ====== CONFIG ====== */

// express
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS requests
app.use(cors({credentials: true, origin: true}));

/* ====== ROUTES ====== */

// home
app.get('/', indexController.getHome);
app.get('/about', indexController.getAbout);
app.get('/contact', indexController.getContact);

// users
const userController = new UserController();
app.route(Route.USER)
   .post(userController.create);

app.route(Route.USER + '/:id')
   .get(userController.getById)
   .put(userController.update)
   .delete(userController.delete);

export default app;