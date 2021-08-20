import express from 'express';
import logger from 'morgan';
import * as http from 'http';
import cookieParser from 'cookie-parser';

import { Router } from './routes/allRoutes';
import { establishConnection } from './db/db-connection';
import { error404, handleErrors } from './utils';

class Server {

    constructor(
        public server: http.Server | null = null,
        private app: express.Express | null = null
    ) {}

    async start() {
        this.initServer();
        await this.dbConnection();
        this.middleware();
        this.routes();
        this.errorHandler();
        this.unhandledRejectionError();
        this.listen();
    }

    initServer() {
        this.app = express();
    }

    middleware() {
        this.app.use(express.json());
        this.app.use(logger('dev'));
        this.app.use(cookieParser());
    }

    routes() {
        Router(this.app);
    }

    listen() {
        this.server = this.app.listen(process.env.PORT, () => {
            console.log(`Server started on port ${process.env.PORT}`);
        });
    }

    async dbConnection() {
        await establishConnection();
    }

    errorHandler() {
        this.app.use(error404);
        this.app.use(handleErrors);
    }

    unhandledRejectionError() {
        process.on('unhandledRejection', (error) => {
            console.error(error);
            this.server?.close(() => process.exit(1));
        });
    }
}

export default Server;

