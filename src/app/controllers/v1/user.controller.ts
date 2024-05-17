import "reflect-metadata";
import { Request, Response, NextFunction } from 'express';
import { inject, injectable, singleton } from 'tsyringe';
import { HttpStatusCode } from 'utils/type';
import apiRes from 'helpers/api.response';
import { Logger } from 'helpers/logger';
import { BaseUserService } from 'app/services/v1/user.service';

@injectable()
@singleton()
export class UserController {
    constructor(
        @inject('UserLogger') private logger: Logger,
        @inject('BaseUserService') private userService: BaseUserService,
    ) { }

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await this.userService.create(req.body);

            const resData: Record<string, any> = {
                id: data.id,
                username: data.username,
                role: data.role,
            }

            this.logger.info('User creating succeeded', resData);

            return apiRes(res, HttpStatusCode.CREATED, 'Successfully user created', null, resData);
        } catch (err) {
            next(err); // Pass error to error-handler middleware
        }
    }

    get = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // @ts-ignore
            const userId = req._user.id;

            const data = await this.userService.get(userId);

            const resData = {
                username: data.username,
                role: data.role,
                deposit: data.deposit,
            }

            return apiRes(res, HttpStatusCode.CREATED, 'Successfully user fetched', null, resData);
        } catch (err) {
            next(err); // Pass error to error-handler middleware
        }
    }

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userData = {
                // @ts-ignore
                id: req._user.id,
                username: req.body.username,
                password: req.body.password,
            }

            const data = await this.userService.update(userData);

            const resData = {
                id: data.id,
                username: data.username,
                role: data.role,
            }

            return apiRes(res, HttpStatusCode.CREATED, 'Successfully user updated', null, resData);
        } catch (err) {
            next(err); // Pass error to error-handler middleware
        }
    }

    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userData = {
                // @ts-ignore
                id: req._user.id,
                password: req.body.password,
            }

            const data = await this.userService.delete(userData);

            const resData = {
                username: data.username,
            }

            this.logger.info('User deleting succeeded', resData);

            return apiRes(res, HttpStatusCode.CREATED, 'Successfully user deleted', null, resData);
        } catch (err) {
            next(err); // Pass error to error-handler middleware
        }
    }
}