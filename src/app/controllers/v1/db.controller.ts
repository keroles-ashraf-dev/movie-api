import "reflect-metadata";
import { Request, Response, NextFunction } from 'express';
import { inject, injectable, singleton } from 'tsyringe';
import { HttpStatusCode } from 'utils/type';
import apiRes from 'helpers/api.response';
import { Logger } from 'helpers/logger';
import { BaseDBService } from 'app/services/v1/db.seed.service';

@injectable()
@singleton()
export class DBController {
    constructor(
        @inject('DBLogger') private logger: Logger,
        @inject('BaseDBService') private dbService: BaseDBService,
    ) { }

    seed = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const files = req.files;
            
            await this.dbService.seed(files);

            this.logger.error('DB seeding succeeded');

            return apiRes(res, HttpStatusCode.CREATED, 'Successfully DB seeded', null);
        } catch (err) {
            next(err); // Pass error to error-handler middleware
        }
    }
}