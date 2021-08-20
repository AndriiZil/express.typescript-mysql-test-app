import jwt from 'jsonwebtoken';
import { NextFunction, Response } from 'express';
import {
    createTaskSchema,
    updateUserSchema,
    userRegisterAndLoginSchema,
    validateData
} from '../services/inputValidation';
import {IRequest} from '../interfaces';
import {getRepository} from 'typeorm';
import {User} from '../models/User';
import {customError} from '../utils';
import {HttpStatusCodes} from '../utils/httpStatuses';

export async function jwtProtect(req: IRequest, res: Response, next: NextFunction) {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.token) {
        token = req.cookies.token
    }

    if (!token) {
        return next({
            code: 403,
            message: 'Access token should be provided.',
        });
    }

    try {
        let user;
        let userId;

        const decoded = await jwt.verify(token, 'secret');

        if (typeof decoded !== 'string' && decoded.id) {
            userId = decoded.id;
            user = await getRepository(User).findOne({ id: decoded.id });
        }

        if (!user) {
            customError(`User not found.`, HttpStatusCodes.NOT_FOUND);
        }
        delete user.password;
        req['userId'] = userId;

        next();
    } catch (err) {
        err.code = 401;
        err.message = 'Token invalid or expired.';
        next(err);
    }
}

export function validateUpdateUser(req: IRequest, res: Response, next: NextFunction) {
    validateData(updateUserSchema, req, next);
}

export function validateUserLoginAndRegister(req: IRequest, res: Response, next: NextFunction) {
    validateData(userRegisterAndLoginSchema, req, next);
}

export function validateCreateUpdateTask(req: IRequest, res: Response, next: NextFunction) {
    validateData(createTaskSchema, req, next);
}
