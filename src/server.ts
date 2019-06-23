import express from 'express';
import * as indexController from '../routes/index';
import * as userController from './user/UserController';

const app = express();
const port = 8080;

// router
app.get('/', indexController.getHome);
app.get('/about', indexController.getAbout);
app.get('/contact', indexController.getContact);
app.get('/user/name', userController.getName);

// start serv
app.listen(port, () => {
    console.log('app started');
});
