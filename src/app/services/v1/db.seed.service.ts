import "reflect-metadata";
import { singleton } from "tsyringe";
import fileUpload from "express-fileupload";
import { ApiError } from 'helpers/error';
import { ErrorType, HttpStatusCode } from 'utils/type';

export interface BaseDBService {
    seed(files: fileUpload.FileArray | null | undefined): Promise<void>;
}

@singleton()
export class DBService implements BaseDBService {
    seed = async (files: fileUpload.FileArray | null | undefined): Promise<void> => {
        if (!files || Object.keys(files).length < 1) {
            throw new ApiError(ErrorType.GENERAL_ERROR, HttpStatusCode.BAD_REQUEST, 'No files were uploaded.');
        }

        const uploadedFile = files.file;

        if(uploadedFile instanceof Array){
            throw new ApiError(ErrorType.GENERAL_ERROR, HttpStatusCode.BAD_REQUEST, 'Multiple files are not supported.');
        }

        if(uploadedFile.mimetype !== 'text/csv'){
            throw new ApiError(ErrorType.GENERAL_ERROR, HttpStatusCode.BAD_REQUEST, 'File mimetype should be "text/csv"');
        }

        const data = uploadedFile.data.toJSON();
    }
}