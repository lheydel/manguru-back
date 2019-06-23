import bluebird from 'bluebird';
import express from 'express';
import mongoose from 'mongoose';

import { APP_PORT } from './config/app';
import { MONGO_URI } from './config/mongo';

import * as indexController from './index';
import { UserController } from './controller/user.controller';


const app = express();


/* ====== CONFIG ====== */

// mongodb
mongoose.Promise = bluebird;
mongoose.connect(MONGO_URI, { useNewUrlParser: true }).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.log('MongoDB connection error. Please make sure MongoDB is running. ' + err);
});


/* ====== ROUTES ====== */

// home
app.get('/', indexController.getHome);
app.get('/about', indexController.getAbout);
app.get('/contact', indexController.getContact);

// users
// const userController = <UserController> .get('user.ctl');
const userController = new UserController();
app.get('/user/name', userController.getName.bind(userController));

// start serv
app.listen(APP_PORT, () => {
    console.log('app started');
});
