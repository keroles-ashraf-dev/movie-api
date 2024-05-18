import "reflect-metadata";
import { container } from 'tsyringe';
import { UserRefreshTokenRepo } from 'app/repositories/v1/user.refresh.token.repo';
import { UserRepo } from 'app/repositories/v1/user.repo';
import { MovieRepo } from 'app/repositories/v1/movie.repo';
import { UserFavoriteMovieRepo } from 'app/repositories/v1/user.favorite.movie.repo';
import { TMDBMovieRepo } from 'app/repositories/v1/external.movie.repo';

container.register('BaseUserRepo', { useClass: UserRepo });
container.register('BaseUserRefreshTokenRepo', { useClass: UserRefreshTokenRepo });
container.register('BaseMovieRepo', { useClass: MovieRepo });
container.register('BaseUserFavoriteMovieRepo', { useClass: UserFavoriteMovieRepo });
container.register('BaseExternalMovieRepo', { useClass: TMDBMovieRepo });