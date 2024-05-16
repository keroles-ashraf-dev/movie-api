import "reflect-metadata";
import { Router } from 'express';
import { container } from 'tsyringe';
import { MovieController } from 'app/controllers/v1/movie.controller'
import validate from 'app/middlewares/validate';
import { createSchema, getSchema, paginateSchema } from 'app/validations/v1/movie.validation';
import authenticate from 'app/middlewares/authenticate';
import authorize from 'app/middlewares/authorize';
import { UserRole } from 'utils/type';

const router: Router = container.resolve('AppRouter');;
const movieCtrl = container.resolve(MovieController);

router.post('/movies/create', authenticate, authorize([UserRole.ADMIN]), validate(createSchema), movieCtrl.create);
router.get('/movies/get', validate(getSchema), movieCtrl.get);
router.get('/movies/paginate', validate(paginateSchema), movieCtrl.paginate);