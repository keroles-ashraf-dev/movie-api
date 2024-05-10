import bodyParser from 'body-parser';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { client_origin_url } from 'config/app.config';
import errorCatch from 'app/middlewares/error_catch';
import rateLimiting from 'app/middlewares/rate.limiting';

const app = express();

app.use(bodyParser.json()); // parse requests of content-type - application/json
app.use(bodyParser.urlencoded({ extended: true })); // parse requests of content-type - application/x-www-form-urlencoded
app.use(helmet()); // set secure HTTP response headers
app.use( 
    cors({
        origin: client_origin_url, // specify the allowed origins
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: '*' // or specify the allowed headers
    })
);
app.use(rateLimiting); // set rate limiting middleware

app.use(errorCatch); // Error handler middleware

export default app;