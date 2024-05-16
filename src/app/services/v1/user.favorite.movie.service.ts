import "reflect-metadata";
import { inject, injectable, singleton } from 'tsyringe';
import { Op } from 'sequelize';
import { BaseUserFavoriteMovieRepo } from 'app/repositories/v1/user.favorite.movie.repo';
import { ApiError } from 'helpers/error';
import { ErrorType, HttpStatusCode } from 'utils/type';
import UserFavoriteMovie from 'app/models/user.favorite.movie.model';
import { BaseMovieRepo } from "app/repositories/v1/movie.repo";

export interface BaseUserFavoriteMovieService {
    create(data: Record<string, any>): Promise<UserFavoriteMovie>;

    get(id: number,): Promise<UserFavoriteMovie>;

    getAll(userId: number): Promise<UserFavoriteMovie[]>;
}

@injectable()
@singleton()
export class UserFavoriteMovieService implements BaseUserFavoriteMovieService {
    constructor(
        @inject('BaseMovieRepo') private MovieRepo: BaseMovieRepo,
        @inject('BaseUserFavoriteMovieRepo') private userFavoriteMovieRepo: BaseUserFavoriteMovieRepo,
    ) { }

    create = async (data: Record<string, any>): Promise<UserFavoriteMovie> => {
        const userId: number = data.userId;
        const movieId: number = data.movieId;

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

        return userFavMovie;
    }

    get = async (id: number): Promise<UserFavoriteMovie> => {
        const userFavMovie = await this.userFavoriteMovieRepo.findOne({ where: { id: id } });

        if (!userFavMovie) {
            throw new ApiError(
                ErrorType.GENERAL_ERROR,
                HttpStatusCode.NOT_FOUND,
                'Movie notfound.',
            );
        }

        return userFavMovie;
    }

    getAll = async (userId: number): Promise<UserFavoriteMovie[]> => {
        const query = { where: { user_id: userId }, }

        const userFavoriteMovies = await this.userFavoriteMovieRepo.findAll(query);

        if (!userFavoriteMovies) {
            throw new ApiError(
                ErrorType.GENERAL_ERROR,
                HttpStatusCode.INTERNAL_SERVER_ERROR,
                'Something wrong happens, try again later',
            );
        }

        return userFavoriteMovies;
    }
}