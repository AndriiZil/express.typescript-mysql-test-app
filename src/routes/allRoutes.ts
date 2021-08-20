import express from 'express';
import {
    users,
    tasks,
    documentation
} from './index';

const prefix = '/api';

export const Router = (app: express.Application) => {
    app.use(`${prefix}/status`, (req, res) => res.send({ status: 'healthy' }));
    app.use(`${prefix}/documentation`, documentation);
    app.use(`${prefix}/tasks`, tasks);
    app.use(`${prefix}/users`, users);
};
