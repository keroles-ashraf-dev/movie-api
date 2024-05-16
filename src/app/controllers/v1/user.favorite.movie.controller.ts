import "reflect-metadata";
import { Request, Response, NextFunction } from 'express';
import { inject, injectable, singleton } from 'tsyringe';
import { HttpStatusCode } from 'utils/type';
import apiRes from 'helpers/api.response';
import { Logger } from 'helpers/logger';
import { BaseMovieService } from 'app/services/v1/movie.service';
import Movie from "app/models/movie.model";

@injectable()
@singleton()
export class MovieController {
    constructor(
        @inject('MovieLogger') private logger: Logger,
        @inject('BaseMovieService') private movieService: BaseMovieService,
    ) { }

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const movie = await this.movieService.create(req.body);

            const resData: Record<string, any> = {
                id: movie.id,
                title: movie.title,
                director: movie.director,
                year: movie.year,
                country: movie.country,
                length: movie.length,
                genre: movie.genre,
                color: movie.color,
            }

            this.logger.info('Movie creating succeeded', resData);

            return apiRes(res, HttpStatusCode.CREATED, 'Successfully movie created', null, resData);
        } catch (err) {
            next(err); // Pass error to error-handler middleware
        }
    }

    get = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const q: Record<string, any> = {
                id: req.body.id,
                title: req.body.title,
                genre: req.body.genre,
            }

            const movies: Movie[] = await this.movieService.get(q);

            const jsonMovies: Record<string, any>[] = [];

            movies.forEach(movie => {
                const data: Record<string, any> = {
                    title: movie.title,
                    director: movie.director,
                    year: movie.year,
                    country: movie.country,
                    length: movie.length,
                    genre: movie.genre,
                    color: movie.color,
                    extData: movie.extData,
                }

                jsonMovies.push(data);
            });

            const resData = {
                movies: jsonMovies
            }

            return apiRes(res, HttpStatusCode.CREATED, 'Successfully movie fetched', null, resData);
        } catch (err) {
            next(err); // Pass error to error-handler middleware
        }
    }
    
    paginate = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const q: Record<string, any> = {
                id: req.body.id,
                title: req.body.title,
                genre: req.body.genre,
            }
            const offset = req.body.offset | 0;
            const limit = req.body.limit | 10;

            const movies: Movie[] = await this.movieService.paginate(q, offset, limit);

            const jsonMovies: Record<string, any>[] = [];

            movies.forEach(movie => {
                const data: Record<string, any> = {
                    title: movie.title,
                    director: movie.director,
                    year: movie.year,
                    country: movie.country,
                    length: movie.length,
                    genre: movie.genre,
                    color: movie.color,
                    extData: movie.extData,
                }

                jsonMovies.push(data);
            });

            const resData = {
                movies: jsonMovies
            }

            return apiRes(res, HttpStatusCode.CREATED, 'Successfully movie fetched', null, resData);
        } catch (err) {
            next(err); // Pass error to error-handler middleware
        }
    }
}