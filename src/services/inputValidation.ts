import Joi from 'joi';
import {customError} from '../utils';
import {HttpStatusCodes} from '../utils/httpStatuses';
import {IRequest} from '../interfaces';
import {NextFunction} from 'express';

export const userRegisterAndLoginSchema = Joi.object({
    name: Joi.string().min(3).max(90).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{5,30}$')).required(),
});

export const updateUserSchema = Joi.object({
    name: Joi.string().min(3).max(90).required()
});

export const createTaskSchema = Joi.object({
    title: Joi.string().min(5).max(90).required(),
    text: Joi.string().min(5).max(240).required(),
})

export const validateData = (schema: Joi.Schema, req: IRequest, next: NextFunction) => {
    const { error } = schema.validate(req.body);

    if (error) customError(error.message, HttpStatusCodes.FAILED_USER_INPUT);

    next();
}

