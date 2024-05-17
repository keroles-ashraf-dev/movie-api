import "reflect-metadata";
import { inject, injectable, singleton } from 'tsyringe';
import Movie from 'app/models/movie.model';
import { BaseCache } from "cache/cache";

export interface BaseMovieRepo {
    create(data: Record<string, any>): Promise<Movie>;

    bulkCreate(data: Record<string, any>[]): Promise<Movie[]>;

    findOne(query: any): Promise<Movie | null>;

    findAll(query: any): Promise<Movie[]>;

    update(movie: Movie | number, data: Record<string, any>): Promise<Movie | null>;
}

@injectable()
@singleton()
export class MovieRepo implements BaseMovieRepo {
    constructor(
        @inject('BaseCache') private cache: BaseCache,
    ) { }

    create = async (data: Record<string, any>): Promise<Movie> => {
        const movie = await Movie.create(data);

        return movie;
    }

    bulkCreate = async (data: Record<string, any>[]): Promise<Movie[]> => {
        const movies = await Movie.bulkCreate(data);

        return movies;
    }

    findOne = async (query: any): Promise<Movie | null> => {
        const data = await this.cache.get(query);

        let movie: Movie;

        if (data) {
            const json = JSON.parse(data);
            movie = Movie.build(json);
        } else {
            movie = await Movie.findOne(query);

            // cache result
            await this.cache.set(query, movie.toJSON())
        }

        return movie;
    }

    findAll = async (query: any): Promise<Movie[]> => {
        const data = await this.cache.get(query);

        let movies: Movie[];

        if (data) {
            const json: [] = JSON.parse(data);
            movies = json.map(e => Movie.build(e));
        } else {
            movies = await Movie.findAll(query);

            // cache results
            await this.cache.set(query, movies.map(e => e.toJSON()))
        }

        return movies;
    }

    update = async (movieOrId: Movie | number, data: Record<string, any>): Promise<Movie | null> => {
        let movie: Movie | null;

        if (movieOrId instanceof Number) {
            movie = await this.findOne({ where: { id: movieOrId } });
        } else {
            movie = movieOrId as Movie;
        }

        if (!movie) return null;

        const modifiedMovie = await movie.update(data);

        return modifiedMovie;
    }
}