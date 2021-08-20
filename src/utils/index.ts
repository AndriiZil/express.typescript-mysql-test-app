import { ICookieOptions, ICustomError } from '../interfaces';
import { NextFunction, Response, Request } from 'express';

export function customError(message: string, code: number): void {
    const error: ICustomError = new Error(message);
    error.code = code;
    throw error;
}

export function error404(req: Request, res: Response, next: NextFunction) {
    const error: ICustomError = new Error('Not Found.');
    error.code = 404;
    next(error);
}

export function handleErrors(err: ICustomError, req: Request, res: Response, next: NextFunction) {
    if (err) {
        const message = err.message || 'Internal Server Error';
        const code = typeof err.code !== 'string' && err.code || 500;
        return res.status(code).json({ message });
    }
    next();
}

export function getCookieOptions(): ICookieOptions {
    return {
        maxAge: 86400,
        httpOnly: true
    }
}
