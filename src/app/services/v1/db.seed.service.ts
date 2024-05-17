import "reflect-metadata";
import { inject, injectable, singleton } from "tsyringe";
import fileUpload from "express-fileupload";
import csv from "csvtojson";
import { ApiError } from 'helpers/error';
import { ErrorType, HttpStatusCode } from 'utils/type';
import { BaseMovieRepo } from "app/repositories/v1/movie.repo";

export interface BaseDBService {
    seedMovies(files: fileUpload.FileArray | null | undefined): Promise<void>;
}

@injectable()
@singleton()
export class DBService implements BaseDBService {
    constructor(
        @inject('BaseMovieRepo') private movieRepo: BaseMovieRepo,
    ) { }

    seedMovies = async (files: fileUpload.FileArray | null | undefined): Promise<void> => {
        if (!files || Object.keys(files).length < 1) {
            throw new ApiError(ErrorType.GENERAL_ERROR, HttpStatusCode.BAD_REQUEST, 'No files were uploaded.');
        }

        const uploadedFile = files.file;

        if (uploadedFile instanceof Array) {
            throw new ApiError(ErrorType.GENERAL_ERROR, HttpStatusCode.BAD_REQUEST, 'Multiple files are not supported.');
        }

        if (uploadedFile.mimetype !== 'text/csv') {
            throw new ApiError(ErrorType.GENERAL_ERROR, HttpStatusCode.BAD_REQUEST, 'File mimetype should be "text/csv"');
        }

        const data: Record<string, any>[] = await csv().fromString(uploadedFile.data.toString());

        await this.movieRepo.bulkCreate(data);
    }
}