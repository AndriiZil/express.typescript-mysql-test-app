import { Router } from 'express';
import UsersController from '../controllers/usersController';
import { jwtProtect, validateUpdateUser, validateUserLoginAndRegister } from '../middlewares';

const r = Router();

r.post('/create', validateUserLoginAndRegister, UsersController.create);

r.post('/login', validateUserLoginAndRegister, UsersController.login);

r.get('/', jwtProtect, UsersController.getAll);

r.get('/me', jwtProtect, UsersController.getMe);

r.get('/:id', jwtProtect, UsersController.getById);

r.patch('/me',  validateUpdateUser, jwtProtect, UsersController.updateMe);

r.patch('/:id',  validateUpdateUser, jwtProtect, UsersController.updateById);

r.delete('/:id', jwtProtect, UsersController.delete);

export default r;
