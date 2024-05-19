import { inject, injectable, singleton } from 'tsyringe';
import jwt from 'jsonwebtoken';
import AppConfig from 'config/app.config';
import { Logger } from 'helpers/logger';

export interface BaseJWT {
    verify(token: string): Object | null;

    sign(payload: Object): string | null;
}

@singleton()
@injectable()
export class JWT implements BaseJWT {
    constructor(
        @inject('JWTLogger') private logger: Logger,
        @inject(AppConfig) private appConfig: AppConfig,
        ) { }

    verify = (token: string): Object | null => {
        try {
            const decoded = jwt.verify(token, this.appConfig.jwt_secret_key!);

            return decoded;
        } catch (err) {
            this.logger.error('jwt verify token', err);
            return null;
        }
    }

    sign = (payload: Object): string | null => {
        try {
            const token = jwt.sign(payload, this.appConfig.jwt_secret_key!, { expiresIn: this.appConfig.jwt_expires_in_minutes * 60 });

            return token;
        } catch (err) {
            this.logger.error('jwt sign new token', err);
            return null;
        }
    }
}