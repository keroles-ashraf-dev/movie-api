import "reflect-metadata";
import { inject, injectable, singleton } from 'tsyringe';
import Sequelize from "sequelize/types/sequelize";
import bodyParser from 'body-parser';
import express, { Router } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import fileUpload from 'app/middlewares/file.upload';
import AppConfig from 'config/app.config';
import errorCatch from 'app/middlewares/error_catch';
import rateLimiting from 'app/middlewares/rate.limiting';
import { Logger } from "helpers/logger";

@injectable()
@singleton()
export default class App {
    app = express();

    constructor(
        @inject('AppLogger') private logger: Logger,
        @inject('AppRouter') private appRouter: Router,
        @inject('Postgres') private postgres: Sequelize,
        @inject(AppConfig) private appConfig: AppConfig,
    ) {
        this.setup();
    }

    setup = (): void => {
        // parse requests of content-type - application/json
        // set 10kb for request body size
        this.app.use(bodyParser.json({ limit: this.appConfig.request_body_size }));

        // parse requests of content-type - application/x-www-form-urlencoded
        // set 10kb for request body size
        this.app.use(bodyParser.urlencoded({ extended: true, limit: this.appConfig.request_body_size }));

        // set secure HTTP response headers
        this.app.use(fileUpload());
        
        // set secure HTTP response headers
        this.app.use(helmet());

        // set cors
        this.app.use(
            cors({
                origin: this.appConfig.client_origin_url, // specify the allowed origins
                methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], // specify the allowed methods
                allowedHeaders: '*' // specify the allowed headers
            })
        );

        // set rate limiting middleware
        this.app.use(rateLimiting);

        // set app router
        this.app.use('/api/v1', this.appRouter);

        // Error handler middleware
        this.app.use(errorCatch);
    }

    run = async (): Promise<void> => {
        try {
            this.app.listen(this.appConfig.port, async (): Promise<void> => {
                // sync models
                await this.postgres.sync();

                this.logger.info('Server running on port ' + this.appConfig.port);
            });
        } catch (err) {
            this.logger.error('Start server', err);
            process.exit(1);
        }
    }
}