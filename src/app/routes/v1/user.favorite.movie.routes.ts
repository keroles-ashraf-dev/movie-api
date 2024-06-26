import "reflect-metadata";
import { Router } from 'express';
import { container } from 'tsyringe';
import { UserFavoriteMovieController } from 'app/controllers/v1/user.favorite.movie.controller';
import validate from 'app/middlewares/validate';
import { createSchema, getSchema } from 'app/validations/v1/user.favorite.movie.validation';
import authenticate from 'app/middlewares/authenticate';

const router: Router = Router();
const userFavoriteMovieCtrl = container.resolve(UserFavoriteMovieController);

router.post('/favorite-movies/create', authenticate, validate(createSchema), userFavoriteMovieCtrl.create);
router.get('/favorite-movies/:id', authenticate, validate(getSchema, 'params'), userFavoriteMovieCtrl.get);
router.get('/favorite-movies/', authenticate, userFavoriteMovieCtrl.getAll);

export default router;