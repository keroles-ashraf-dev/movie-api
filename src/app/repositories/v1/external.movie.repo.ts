import "reflect-metadata";
import { inject, injectable, singleton } from 'tsyringe';
import ServiceConfig from "config/service.config";
import axios from "axios";
import { HttpStatusCode } from "utils/type";
import { Logger } from "helpers/logger";
import Movie from "app/models/movie.model";

export interface BaseExternalMovieRepo {
    search(movie: Movie): Promise<Record<string, any> | null>;

    get(movie: Movie): Promise<Record<string, any> | null>;
}

@injectable()
@singleton()
export class TMDBMovieRepo implements BaseExternalMovieRepo {
    constructor(
        @inject('TMDBLogger') private logger: Logger,
        @inject(ServiceConfig) private config: ServiceConfig,
    ) { }

    search = async (movie: Movie): Promise<Record<string, any> | null> => {
        try {
            const res = await axios.get(this.config.themoviedb_api_search(movie.title));

            if (res.status != HttpStatusCode.OK || !res.data) throw Error(res.statusText);

            if (!res.data.results) throw Error('No results');

            const results: Record<string, any>[] = res.data.results;

            if (!results) throw Error('No results');

            let result: Record<string, any> | null = null;

            for (const e of results) {
                // validate title and year
                if (e['title'].toLowerCase() == movie.title.toLowerCase() &&
                    new Date(e['release_date']).getUTCFullYear().toString() == movie.year
                ) {
                    result = e;
                    break;
                }
            }

            return result;
        } catch (error) {
            this.logger.error('TMDB movie search failed')
            return null;
        }
    }

    get = async (movie: Movie): Promise<Record<string, any> | null> => {
        try {
            // @ts-ignore
            const tmdbMovieId: number = Number(movie.extData!['tmdb']['id']);

            const res = await axios.get(this.config.themoviedb_api_movie_details(tmdbMovieId));

            if (res.status != HttpStatusCode.OK || !res.data) throw Error(res.statusText);

            const json = JSON.parse(res.data);
            const results: Record<string, any>[] | null | undefined = json['results'];

            if (!results) throw Error('No results');

            let result: Record<string, any> | null = null;

            for (const e of results) {
                // validate title and year
                if (e['title'].toLowerCase() == movie.title.toLowerCase() &&
                    new Date(e['release_date']).getUTCFullYear().toString() == movie.year
                ) {
                    result = e;
                    break;
                }
            }

            return result;
        } catch (error) {
            this.logger.error('TMDB movie get details failed')
            return null;
        }
    }
}