const Router = require('express').Router;
const routes = Router();
const userCtrl = require('../../controllers/user');

routes.post('/create', userCtrl.signup );
routes.post('/login', userCtrl.signin );
routes.put('/reset', userCtrl.resetPassword);
module.exports = routes;