import dotenv from 'dotenv';
import { singleton } from 'tsyringe';

@singleton()
export default class ServiceConfig {
  constructor() {
    dotenv.config({ path: '.env' });
  }

  // themoviedb
  themoviedb_api_key = process.env.THEMOVIEDB_api_key;
  themoviedb_api_base = 'https://api.themoviedb.org/3';

  themoviedb_api_search = (movieTitle: string): string => {
    return `${this.themoviedb_api_base}/search/movie?api_key=${this.themoviedb_api_key}&query=${movieTitle}`;
  }

  themoviedb_api_movie_details = (movieId: number): string => {
    return `${this.themoviedb_api_base}/movie/${movieId}?api_key=${this.themoviedb_api_key}`;
  }
}