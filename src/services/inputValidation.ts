import Joi from 'joi';

export const userSchema = Joi.object({
    name: Joi.string().min(3).max(90).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{5,30}$')).required(),
});
