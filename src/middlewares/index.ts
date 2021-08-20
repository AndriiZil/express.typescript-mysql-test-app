import jwt from 'jsonwebtoken';
import { NextFunction, Response, Request } from 'express';
import { userSchema } from '../services/inputValidation';
import {customError} from '../utils';
import {HttpStatusCodes} from '../utils/httpStatuses';

export async function jwtProtect(req: Request, res: Response, next: NextFunction) {
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
        // @ts-ignore
        req['user'] = await jwt.verify(token, 'secret'); // TODO move to .env file
        next();
    } catch (err) {
        err.code = 401;
        err.message = 'Token invalid or expired.';
        next(err);
    }
}

export function validateUserCreation(req: Request, res: Response, next: NextFunction) {
    console.log(req.body);
    const { error } = userSchema.validate(req.body);

    if (error) {
        customError(error.message, HttpStatusCodes.FAILED_USER_INPUT);
    }

    next();
}
