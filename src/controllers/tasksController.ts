import { TaskService } from '../services';
import { IRequest} from '../interfaces';
import { NextFunction, Response } from 'express';
import { HttpStatusCodes } from '../utils/httpStatuses';

class TasksController {

    static async create(req: IRequest, res: Response, next: NextFunction) {
        try {
            const result = await TaskService.create(req.body, req.userId);

            return res.status(HttpStatusCodes.CREATED).json(result);
        } catch (err) {
            next(err);
        }
    }

    static async getAll(req: IRequest, res: Response, next: NextFunction) {
        try {
            const tasks = await TaskService.getAll();

            return res.json(tasks);
        } catch (err) {
            next(err);
        }
    }

    static async getAllCurrentUserTasks(req: IRequest, res: Response, next: NextFunction) {
        try {
            const tasks = await TaskService.getAllCurrentUserTasks(req.userId);

            return res.json(tasks);
        } catch (err) {
            next(err);
        }
    }

    static async getTaskById(req: IRequest, res: Response, next: NextFunction) {
        try {
            const result = await TaskService.getTaskById(Number(req.params.id));

            return res.json(result);
        } catch (err) {
            next(err);
        }
    }

    static async changeStatusToCompleted(req: IRequest, res: Response, next: NextFunction) {
        try {
            await TaskService.changeStatusToCompleted(Number(req.params.id));

            return res.status(HttpStatusCodes.NO_CONTENT).end();
        } catch (err) {
            next(err);
        }
    }

    static async update(req: IRequest, res: Response, next: NextFunction) {
        try {
            await TaskService.update(Number(req.params.id), req.body);

            return res.status(HttpStatusCodes.NO_CONTENT).end();
        } catch (err) {
            next(err);
        }
    }

    static async delete(req: IRequest, res: Response, next: NextFunction) {
        try {
            await TaskService.delete(Number(req.params.id));

            return res.status(HttpStatusCodes.NO_CONTENT).end();
        } catch (err) {
            next(err);
        }
    }

}

export default TasksController;
