import compression from 'compression';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import { APP_PORT } from './config/app';

import * as indexController from './index';
import { UserController } from './user/user.controller';
import { MigrationManager } from './migrations';


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
app.get('/user/name', userController.getName.bind(userController));
app.get('/user/create', userController.create.bind(userController));

// start serv
app.listen(APP_PORT, async () => {
    // entity migrations
    const migrationManager = new MigrationManager();
    await migrationManager.doMigrations();

    console.log('app started');
});
