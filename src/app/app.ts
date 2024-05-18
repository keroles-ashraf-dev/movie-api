import "reflect-metadata";
import { inject, injectable, singleton } from 'tsyringe';
import bodyParser from 'body-parser';
import { Sequelize } from "sequelize";
import { RedisClientType } from "redis";
import express, { Router } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import fileUpload from 'app/middlewares/file.upload';
import AppConfig from 'config/app.config';
import errorCatch from 'app/middlewares/error_catch';
import rateLimiting from 'app/middlewares/rate.limiting';
import { Logger } from "helpers/logger";
import authRoute from "app/routes/v1/auth.routes"
import dbRoute from "app/routes/v1/db.routes"
import userRoute from "app/routes/v1/user.routes"
import movieRoute from "app/routes/v1/movie.routes"
import userFavoriteMovieRoute from "app/routes/v1/user.favorite.movie.routes"

@injectable()
@singleton()
export default class App {
    app = express();

    constructor(
        @inject('AppLogger') private logger: Logger,
        @inject('Postgres') private postgres: Sequelize,
        @inject('Redis') private redis: RedisClientType,
        @inject(AppConfig) private appConfig: AppConfig,
    ) {
        this.setup();
    }

    setup = (): void => {
        // set rate limiter
        this.app.use(rateLimiting);

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

        // set app router
        this.registerRoutes()

        // Error handler middleware
        this.app.use(errorCatch);
    }

    registerRoutes = () => {
        this.app.use('/api/v1', authRoute);
        this.app.use('/api/v1', dbRoute);
        this.app.use('/api/v1', userRoute);
        this.app.use('/api/v1', movieRoute);
        this.app.use('/api/v1', userFavoriteMovieRoute);
    }

    run = async (): Promise<void> => {
        try {
            this.app.listen(this.appConfig.port, async (): Promise<void> => {
                this.logger.info('Server running on port' + this.appConfig.port);

                // sync models
                await this.postgres.sync();

                await this.redis.connect();
            });
        } catch (err) {
            this.logger.error('Start server', err);
            process.exit(1);
        }
    }
}