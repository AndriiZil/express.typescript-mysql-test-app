import { Router } from 'express';
import { TasksController } from '../controllers';
import {jwtProtect} from '../middlewares';

const r = Router();

r.post('/', jwtProtect, TasksController.create);

r.get('/', TasksController.getAll);

r.get('/:id', TasksController.getTaskById);

r.patch('/change-status/:id', TasksController.changeStatusToCompleted);

r.patch('/update/:id', TasksController.update);

r.delete('/:id', TasksController.delete);

export default r;
