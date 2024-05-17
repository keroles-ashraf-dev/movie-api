import "reflect-metadata";
import { inject, injectable, singleton } from 'tsyringe';
import { BaseCache } from "cache/cache";
import UserFavoriteMovie from "app/models/user.favorite.movie.model";

export interface BaseUserFavoriteMovieRepo {
    create(data: Record<string, any>): Promise<UserFavoriteMovie>;

    findOne(query: any): Promise<UserFavoriteMovie | null>;

    findAll(query: any): Promise<UserFavoriteMovie[]>;
}

@injectable()
@singleton()
export class UserFavoriteMovieRepo implements BaseUserFavoriteMovieRepo {
    constructor(
        @inject('BaseCache') private cache: BaseCache,
    ) { }

    create = async (data: Record<string, any>): Promise<UserFavoriteMovie> => {
        const favoriteMovie = await UserFavoriteMovie.create(data);

        return favoriteMovie;
    }

    findOne = async (query: any): Promise<UserFavoriteMovie | null> => {
        const data = await this.cache.get(query);

        let favoriteMovie: UserFavoriteMovie;

        if (data) {
            const json = JSON.parse(data);
            favoriteMovie = UserFavoriteMovie.build(json);
        } else {
            favoriteMovie = await UserFavoriteMovie.findOne(query);

            // cache result
            await this.cache.set(query, favoriteMovie.toJSON())
        }

        return favoriteMovie;
    }

    findAll = async (query: any): Promise<UserFavoriteMovie[]> => {
        const data = await this.cache.get(query);

        let favoriteMovies: UserFavoriteMovie[];

        if (data) {
            const json: [] = JSON.parse(data);
            favoriteMovies = json.map(e => UserFavoriteMovie.build(e));
        } else {
            favoriteMovies = await UserFavoriteMovie.findAll(query);

            // cache results
            await this.cache.set(query, favoriteMovies.map(e => e.toJSON()))
        }

        return favoriteMovies;
    }
}