import "reflect-metadata";
import { inject, injectable, singleton } from 'tsyringe';
import { Op } from 'sequelize';
import { BaseMovieRepo } from 'app/repositories/v1/movie.repo';
import { ApiError } from 'helpers/error';
import { ErrorType, HttpStatusCode } from 'utils/type';
import Movie from 'app/models/movie.model';

export interface BaseMovieService {
    create(data: Record<string, any>): Promise<Movie>;

    get(q: Record<string, any>): Promise<Movie[]>;

    paginate(q: Record<string, any>, offset: number, limit: number): Promise<Movie[]>;
}

@injectable()
@singleton()
export class MovieService implements BaseMovieService {
    constructor(
        @inject('BaseMovieRepo') private movieRepo: BaseMovieRepo,
    ) { }

    create = async (data: Record<string, any>): Promise<Movie> => {
        const title: string = data.title;
        const director: string = data.director;
        const year: number = data.year;
        const country: string = data.country;
        const length: number = data.length;
        const genre: string = data.genre;
        const color: string = data.color;

        const movieData: Record<string, any> = {
            title: title,
            director: director,
            year: year,
            country: country,
            length: length,
            genre: genre,
            color: color,
        }

        const movie = await this.movieRepo.create(movieData);

        if (!movie) {
            throw new ApiError(
                ErrorType.UNKNOWN_ERROR,
                HttpStatusCode.INTERNAL_SERVER_ERROR,
                'Movie not created. something wrong happened, try again later',
            );
        }

        return movie;
    }

    get = async (q: Record<string, any>): Promise<Movie[]> => {
        const id: number | null | undefined = q.id;
        const title: string | null | undefined = q.title;
        const genre: string | null | undefined = q.genre;

        const where = {};

        if (id) {
            // @ts-ignore
            where.id = id;
        }
        if (title) {
            // @ts-ignore
            where.title = { [Op.match]: Sequelize.fn('to_tsquery', title) };
        }
        if (genre) {
            // @ts-ignore
            where.genre = { [Op.match]: Sequelize.fn('to_tsquery', genre) };
        }

        const movies = await this.movieRepo.findAll({ where: where });

        if (!movies) {
            throw new ApiError(
                ErrorType.SERVER_ERROR,
                HttpStatusCode.INTERNAL_SERVER_ERROR,
                'Something wrong happens, try again later',
            );
        }

        return movies;
    }

    paginate = async (q: Record<string, any>, offset: number = 0, limit: number = 10): Promise<Movie[]> => {
        const genre: string | null | undefined = q.genre;

        const where = {};
        
        if (genre) {
            // @ts-ignore
            where.genre = { [Op.match]: Sequelize.fn('to_tsquery', genre) };
        }

        const query = {
            where: where,
            limit: limit,
            offset: offset,
        }

        const movies = await this.movieRepo.findAll(query);

        if (!movies) {
            throw new ApiError(
                ErrorType.SERVER_ERROR,
                HttpStatusCode.INTERNAL_SERVER_ERROR,
                'Something wrong happens, try again later',
            );
        }

        return movies;
    }
}