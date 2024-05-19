import "reflect-metadata";
import { inject, injectable, singleton } from 'tsyringe';
import { BaseCache } from "cache/cache";
import UserFavoriteMovie from "app/models/user.favorite.movie.model";

export interface BaseUserFavoriteMovieRepo {
    create(data: Record<string, any>): Promise<UserFavoriteMovie>;

    findOne(query: Record<string, any>): Promise<UserFavoriteMovie | null>;

    findAll(query: Record<string, any>): Promise<UserFavoriteMovie[]>;
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

    findOne = async (query: Record<string, any>): Promise<UserFavoriteMovie | null> => {
        const data = await this.cache.get(this.cacheKey(query));

        let favoriteMovie: UserFavoriteMovie;

        if (data) {
            const json = JSON.parse(data);
            favoriteMovie = UserFavoriteMovie.build(json);
        } else {
            favoriteMovie = await UserFavoriteMovie.findOne(query);

            // cache result
            if(favoriteMovie) await this.cache.set(
                this.cacheKey(query),
                JSON.stringify(favoriteMovie.toJSON())
            );
        }

        return favoriteMovie;
    }

    findAll = async (query: Record<string, any>): Promise<UserFavoriteMovie[]> => {
        const data = await this.cache.get(this.cacheKey(query));

        let favoriteMovies: UserFavoriteMovie[];

        if (data) {
            const json: [] = JSON.parse(data);
            favoriteMovies = json.map(e => UserFavoriteMovie.build(e)); 
        } else {
            favoriteMovies = await UserFavoriteMovie.findAll(query);

            // cache results
            if(favoriteMovies) await this.cache.set(
                this.cacheKey(query),
                JSON.stringify(favoriteMovies.map(e => e.toJSON()))
            );
        }

        return favoriteMovies;
    }

    private cacheKey = (key: any) => {
        return `user.fav.movies.${JSON.stringify(key)}`;
    }
}