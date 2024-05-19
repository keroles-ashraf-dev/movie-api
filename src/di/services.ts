import "reflect-metadata";
import { container } from 'tsyringe';
import { UserService } from "app/services/v1/user.service";
import { AuthService } from "app/services/v1/auth.service";
import { MovieService } from "app/services/v1/movie.service";
import { UserFavoriteMovieService } from "app/services/v1/user.favorite.movie.service";
import { DBService } from "app/services/v1/db.seed.service";

container.register('BaseUserService', { useClass: UserService });
container.register('BaseAuthService', { useClass: AuthService });
container.register('BaseMovieService', { useClass: MovieService });
container.register('BaseUserFavoriteMovieService', { useClass: UserFavoriteMovieService });
container.register('BaseDBService', { useClass: DBService });