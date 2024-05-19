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
        try {
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
    
            const data: Record<string, any>[] = await csv().fromString(uploadedFile.data.toString('utf8'));
    
            for (let i: number = 0; i < data.length; i++) {
                const row = data[i];
    
                const cleanedRow = {
                    // @ts-ignore
                    title: String(row.Title),
                    // @ts-ignore
                    director: String(row.Director),
                    // @ts-ignore
                    year: String(row.Year),
                    // @ts-ignore
                    country: String(row.Country),
                    // @ts-ignore 
                    length: Number(row.Length),
                    // @ts-ignore
                    genre: String(row.Genre),
                    // @ts-ignore
                    color: String(row.Colour).toLowerCase(),
                }
    
                data[i] = cleanedRow;
            }
    
            await this.movieRepo.bulkCreate(data);
        } catch (error) {
            console.log(error)
            throw new ApiError(
                ErrorType.UNKNOWN_ERROR, 
                HttpStatusCode.UNPROCESSABLE_CONTENT, 
                'Something wrong with your file', 
            );
        }   
    }
}