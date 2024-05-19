import "reflect-metadata";
import { inject, injectable, singleton } from 'tsyringe';
import { BaseUserFavoriteMovieRepo } from 'app/repositories/v1/user.favorite.movie.repo';
import { ApiError } from 'helpers/error';
import { ErrorType, HttpStatusCode } from 'utils/type';
import { BaseMovieRepo } from "app/repositories/v1/movie.repo";
import { BaseExternalMovieRepo } from "app/repositories/v1/external.movie.repo";
import Movie from "app/models/movie.model";
import runInTransaction from "helpers/run.in.transaction";
import { Op } from "sequelize";

export interface BaseUserFavoriteMovieService {
    create(data: Record<string, any>): Promise<Movie>;

    get(id: number,): Promise<Movie>;

    getAll(userId: number): Promise<Movie[]>;
}

@injectable()
@singleton()
export class UserFavoriteMovieService implements BaseUserFavoriteMovieService {
    constructor(
        @inject('BaseMovieRepo') private movieRepo: BaseMovieRepo,
        @inject('BaseUserFavoriteMovieRepo') private userFavoriteMovieRepo: BaseUserFavoriteMovieRepo,
        @inject('BaseExternalMovieRepo') private externalMovieRepo: BaseExternalMovieRepo,
    ) { }

    create = async (data: Record<string, any>): Promise<Movie> => {
        return await runInTransaction(async () => {
            const userId: number = data.userId;
            const movieId: number = data.movieId;

            let movie = await this.movieRepo.findOne({ where: { id: movieId } });

            if (!movie) {
                throw new ApiError(
                    ErrorType.GENERAL_ERROR,
                    HttpStatusCode.NOT_FOUND,
                    'Movie notfound.',
                );
            }

            const alreadyFav = await this.userFavoriteMovieRepo.findOne({ where: { movie_id: movieId, user_id: userId } });

            if (alreadyFav) {
                throw new ApiError(
                    ErrorType.GENERAL_ERROR,
                    HttpStatusCode.BAD_REQUEST,
                    'Movie already in your favorite list.',
                );
            }

            const userFavMovieData: Record<string, any> = {
                userId: userId,
                movieId: movieId,
            }

            const userFavMovie = await this.userFavoriteMovieRepo.create(userFavMovieData);

            if (!userFavMovie) {
                throw new ApiError(
                    ErrorType.UNKNOWN_ERROR,
                    HttpStatusCode.INTERNAL_SERVER_ERROR,
                    'Movie did not add to favorites. something wrong happened, try again later',
                );
            }

            // get movie data from external resource
            const extMovieData = await this.externalMovieRepo.search(movie);

            const extData = {};

            if (extMovieData) {
                // @ts-ignore
                extData.tmdb = {
                    id: extMovieData.id,
                    adult: extMovieData.adult,
                    original_language: extMovieData.original_language,
                    overview: extMovieData.overview,
                    popularity: extMovieData.popularity,
                    release_date: extMovieData.release_date,
                    vote_average: extMovieData.vote_average,
                    vote_count: extMovieData.vote_count,
                }
            }

            const updatedMovie = await this.movieRepo.update(movie, { extData: extData });

            if (!updatedMovie) {
                throw new ApiError(
                    ErrorType.UNKNOWN_ERROR,
                    HttpStatusCode.INTERNAL_SERVER_ERROR,
                    'Something wrong happened, try again later',
                );
            }

            return updatedMovie;
        });
    }

    get = async (id: number): Promise<Movie> => {
        const userFavMovie = await this.userFavoriteMovieRepo.findOne({ where: { id: id } });

        if (!userFavMovie) {
            throw new ApiError(
                ErrorType.GENERAL_ERROR,
                HttpStatusCode.NOT_FOUND,
                'Movie notfound.',
            );
        }

        const movie = await this.movieRepo.findOne({ where: { id: userFavMovie.movieId } });

        if (!movie) {
            await userFavMovie.destroy();

            throw new ApiError(
                ErrorType.GENERAL_ERROR,
                HttpStatusCode.NOT_FOUND,
                'Movie notfound.',
            );
        }

        return movie;
    }

    getAll = async (userId: number): Promise<Movie[]> => {
        const query = { where: { user_id: userId }, }

        const userFavoriteMovies = await this.userFavoriteMovieRepo.findAll(query);

        let movies: Movie[] = [];

        if (userFavoriteMovies.length > 0) {
            const ids = userFavoriteMovies.flatMap(e => e.movieId);

            movies = await this.movieRepo.findAll({ where: { id: { [Op.in]: ids} } });
        }

        return movies;
    }
}