import "reflect-metadata";
import { Router } from 'express';
import { container } from 'tsyringe';
import { DBController } from 'app/controllers/v1/db.controller'
import authenticate from 'app/middlewares/authenticate';
import authorize from 'app/middlewares/authorize';
import { UserRole } from 'utils/type';

const router: Router = container.resolve('AppRouter');;
const dbCtrl = container.resolve(DBController);

router.post('/db/seed/movies', authenticate, authorize([UserRole.ADMIN]), dbCtrl.seedMovies);