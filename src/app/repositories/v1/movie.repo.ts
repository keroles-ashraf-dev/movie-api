import "reflect-metadata";
import { inject, injectable, singleton } from 'tsyringe';
import Movie from 'app/models/movie.model';
import { BaseCache } from "cache/cache";

export interface BaseMovieRepo {
	create(data: Record<string, any>): Promise<Movie>;

	bulkCreate(data: Record<string, any>[]): Promise<Movie[]>;

	findOne(query: Record<string, any>): Promise<Movie | null>;

	findAll(query: Record<string, any>): Promise<Movie[]>;

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

	findOne = async (query: Record<string, any>): Promise<Movie | null> => {
		const cacheKey = this.cacheKey(query);

		const data = await this.cache.get(cacheKey);

		let movie: Movie | null;

		if (data) {
			const json = JSON.parse(data);
			movie = Movie.build(json);
		} else {
			movie = await Movie.findOne(query);

			// cache result
			if (movie) await this.cache.set(cacheKey, JSON.stringify(movie.toJSON()))
		}

		return movie;
	}

	findAll = async (query: Record<string, any>): Promise<Movie[]> => {
		const cacheKey = this.cacheKey(query);

		const data = await this.cache.get(cacheKey);

		let movies: Movie[];

		if (data) {
			const json: [] = JSON.parse(data);
			movies = json.map(e => Movie.build(e));
		} else {
			movies = await Movie.findAll(query);

			// cache results
			if (movies) await this.cache.set(
				cacheKey,
				JSON.stringify(movies.map(e => (e.toJSON())))
			);
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

		if (data.extData) {
			movie.setDataValue('extData', data.extData);
		}

		let modifiedMovie = null;

		if (movie.changed()) {
			modifiedMovie = await movie.save();
		}

		return modifiedMovie;
	}

	private cacheKey = (key: any) => {
		if (!key.where.tsvector) return `movies.${JSON.stringify(key)}`;

		const keyClone = JSON.parse(JSON.stringify(key));

		delete key.where.searchable;
		delete keyClone.where.tsvector;

		return `movies.${JSON.stringify(keyClone)}`;
	}
}