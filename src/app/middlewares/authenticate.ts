import "reflect-metadata";
import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { BaseJWT } from 'helpers/jwt';
import { ApiError } from 'helpers/error';
import { ErrorType, HttpStatusCode } from 'utils/type';

const jwt: BaseJWT = container.resolve('BaseJWT');

function authenticate(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        throw new ApiError(ErrorType.GENERAL_ERROR, HttpStatusCode.UNAUTHORIZED, 'Token required',);
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        throw new ApiError(ErrorType.GENERAL_ERROR, HttpStatusCode.UNAUTHORIZED, 'Token required',);
    }

    const payload = jwt.verify(token);
    if (!payload || payload instanceof String) {
        throw new ApiError(ErrorType.GENERAL_ERROR, HttpStatusCode.UNAUTHORIZED, 'Invalid token',);
    }

    // @ts-ignore
    const userId = payload._id;
    // @ts-ignore
    const userRole = payload._role;

    if (!userId || !userRole) {
        throw new ApiError(ErrorType.GENERAL_ERROR, HttpStatusCode.UNAUTHORIZED, 'Invalid token',);
    }

    // @ts-ignore
    req._user = { id: userId, role: userRole };

    next();
}

export default authenticate;