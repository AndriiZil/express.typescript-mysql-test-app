import { Request } from 'express';

export interface ICustomError extends Error {
    code?: number;
    message: string;
}

export interface IRequest extends Request {
    [key: string]: any
}

export interface ICookieOptions {
    maxAge?: number
    httpOnly?: boolean;
    secure?: boolean;
}
