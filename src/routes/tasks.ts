import { Router } from 'express';
import { TasksController } from '../controllers';
import { jwtProtect, validateCreateUpdateTask } from '../middlewares';

const r = Router();

r.post('/', validateCreateUpdateTask, jwtProtect, TasksController.create);

r.get('/', jwtProtect, TasksController.getAll);

r.get('/user', jwtProtect, TasksController.getAllCurrentUserTasks);

r.get('/:id', jwtProtect, TasksController.getTaskById);

r.patch('/change-status/:id', jwtProtect, TasksController.changeStatusToCompleted);

r.patch('/update/:id', validateCreateUpdateTask, jwtProtect, TasksController.update);

r.delete('/:id', jwtProtect, TasksController.delete);

export default r;
