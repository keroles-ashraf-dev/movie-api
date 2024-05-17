import "reflect-metadata";
import { Request, Response, NextFunction } from 'express';
import { inject, injectable, singleton } from 'tsyringe';
import { HttpStatusCode } from 'utils/type';
import apiRes from 'helpers/api.response';
import { Logger } from 'helpers/logger';
import { BaseUserFavoriteMovieService } from 'app/services/v1/user.favorite.movie.service';
import Movie from "app/models/movie.model";

@injectable()
@singleton()
export class UserFavoriteMovieController {
    constructor(
        @inject('UseFavoriteMovieLogger') private logger: Logger,
        @inject('BaseUserFavoriteMovieService') private userFavoriteMovieService: BaseUserFavoriteMovieService,
    ) { }

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = {
                // @ts-ignore
                userId: req._user.id,
                movieId: req.body.movie_id,
            }

            const movie = await this.userFavoriteMovieService.create(data);

            const resData: Record<string, any> = {
                id: movie.id,
                title: movie.title,
                director: movie.director,
                year: movie.year,
                country: movie.country,
                length: movie.length,
                genre: movie.genre,
                color: movie.color,
                extData: movie.extData,
            }

            this.logger.info('User Favorite Movie creating succeeded', resData);

            return apiRes(res, HttpStatusCode.CREATED, 'Successfully movie added to favorites', null, resData);
        } catch (err) {
            next(err); // Pass error to error-handler middleware
        }
    }

    get = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const useFavoriteMovieId: number = Number(req.params.id);

            const movie: Movie = await this.userFavoriteMovieService.get(useFavoriteMovieId);

            const resData: Record<string, any> = {
                id: movie.id,
                title: movie.title,
                director: movie.director,
                year: movie.year,
                country: movie.country,
                length: movie.length,
                genre: movie.genre,
                color: movie.color,
                extData: movie.extData,
            }

            return apiRes(res, HttpStatusCode.CREATED, 'Successfully favorite movie fetched', null, resData);
        } catch (err) {
            next(err); // Pass error to error-handler middleware
        }
    }

    getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // @ts-ignore
            const userId: number = req._user.id;

            const movies: Movie[] = await this.userFavoriteMovieService.getAll(userId);

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

            return apiRes(res, HttpStatusCode.CREATED, 'Successfully favorite movies fetched', null, resData);
        } catch (err) {
            next(err); // Pass error to error-handler middleware
        }
    }
}