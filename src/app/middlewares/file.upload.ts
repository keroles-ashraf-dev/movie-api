import "reflect-metadata";
import { container } from 'tsyringe';
import { Request, Response, NextFunction } from 'express';
import upload from 'express-fileupload';
import { ApiError } from 'helpers/error';
import { ErrorType, HttpStatusCode } from 'utils/type';
import AppConfig from 'config/app.config';

const appConfig: AppConfig = container.resolve(AppConfig);

function fileUpload() {
  return upload({
    uploadTimeout: appConfig.file_upload_timeout,
    abortOnLimit: true,
    limits: { fileSize: appConfig.file_upload_size_limit * 1024 * 1024 },
    limitHandler: (req: Request, res: Response, next: NextFunction) => {
      try {
        throw new ApiError(ErrorType.GENERAL_ERROR, HttpStatusCode.BAD_REQUEST, 'File is too bigger');
      } catch (error) {
        next(error); // Pass error to error-handler middleware
      }
    }
  });
};

export default fileUpload;

