import { container } from 'tsyringe';
import { Logger } from 'helpers/logger';

container.register('AppLogger', { useValue: new Logger('general') });
container.register('TMDBLogger', { useValue: new Logger('tmdb') });
container.register('RedisLogger', { useValue: new Logger('redis') });
container.register('JWTLogger', { useValue: new Logger('jwt') });
container.register('AuthLogger', { useValue: new Logger('auth-logger') });
container.register('DBLogger', { useValue: new Logger('db-logger') });
container.register('MovieLogger', { useValue: new Logger('movie-logger') });
container.register('UseFavoriteMovieLogger', { useValue: new Logger('User-favorite-movie-logger') });
container.register('UserLogger', { useValue: new Logger('user-logger') });
