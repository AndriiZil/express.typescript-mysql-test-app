import { Router } from 'express';

import UsersController from '../controllers/usersController';
import { jwtProtect, validateUserCreation } from '../middlewares';

const r = Router();

r.post('/create', validateUserCreation, UsersController.create);

r.post('/login', validateUserCreation, UsersController.login);

r.get('/', UsersController.getAll);

r.get('/me', jwtProtect, UsersController.getMe);

r.get('/:id', jwtProtect, UsersController.getById);

r.patch('/:id', UsersController.update);

r.delete('/:id', UsersController.delete);

export default r;
