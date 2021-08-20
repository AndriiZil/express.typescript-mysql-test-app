import { Request, Response, NextFunction} from 'express';
import { UsersService } from '../services';
import { getCookieOptions } from '../utils';
import { IRequest } from '../interfaces';
import { HttpStatusCodes } from '../utils/httpStatuses';

class UsersController {

    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const newUser = await UsersService.create(req.body);

            return res.status(HttpStatusCodes.CREATED).json({ ...newUser });
        } catch (err) {
            next(err);
        }
    }

    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const token = await UsersService.login(req.body);
            const options = getCookieOptions();

            return res
                .cookie('token', token , options)
                .json({ token });
        } catch (err) {
            next(err);
        }
    }

    static async getMe(req: IRequest, res: Response, next: NextFunction) {
        try {
            const user = await UsersService.getById(Number(req.user.id));

            return res.json({ ...user });
        } catch (err) {
            next(err);
        }
    }

    static async getById(req: IRequest, res: Response, next: NextFunction) {
        try {
            const user = await UsersService.getById(Number(req.user.id));

            return res.json({ ...user });
        } catch (err) {
            next(err);
        }
    }

    static async getAll(req: IRequest, res: Response, next: NextFunction) {
        try {
            const allUsers = await UsersService.getAll();

            return res.json({
                count: allUsers.length,
                users: allUsers,
            });
        } catch (err) {
            next(err);
        }
    }

    static async update(req: IRequest, res: Response, next: NextFunction) {
        try {
            await UsersService.update(Number(req.user.id), req.body);

            return res.status(HttpStatusCodes.NO_CONTENT).end();
        } catch (err) {
            next(err);
        }
    }

    static async delete(req: IRequest, res: Response, next: NextFunction) {
        try {
            await UsersService.delete(Number(req.user.id));

            return res.status(HttpStatusCodes.NO_CONTENT).end();
        } catch (err) {
            next(err);
        }
    }

}

export default UsersController;
