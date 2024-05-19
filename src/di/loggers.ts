import "reflect-metadata";
import { container } from 'tsyringe';
import { Logger } from 'helpers/logger';

container.register('AppLogger', { useValue: new Logger('app') });
container.register('TMDBLogger', { useValue: new Logger('tmdb') });
container.register('CacheLogger', { useValue: new Logger('cache') });
container.register('RateLimitingLogger', { useValue: new Logger('rate-limiting') });
container.register('JWTLogger', { useValue: new Logger('jwt') });
container.register('AuthLogger', { useValue: new Logger('auth') });
container.register('DBLogger', { useValue: new Logger('db') });
container.register('MovieLogger', { useValue: new Logger('movie') });
container.register('UseFavoriteMovieLogger', { useValue: new Logger('User-favorite-movie') });
container.register('UserLogger', { useValue: new Logger('user') });
