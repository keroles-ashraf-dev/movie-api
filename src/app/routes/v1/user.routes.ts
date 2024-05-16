import "reflect-metadata";
import { Router } from 'express';
import { container } from 'tsyringe';
import { UserController } from 'app/controllers/v1/user.controller'
import validate from 'app/middlewares/validate';
import { createSchema, updateSchema, deleteSchema } from 'app/validations/v1/user.validation';
import authenticate from 'app/middlewares/authenticate';
import authorize from 'app/middlewares/authorize';
import { UserRole } from 'utils/type';

const router: Router = container.resolve('AppRouter');;
const userCtrl = container.resolve(UserController);

router.post('/users/create', authenticate, authorize([UserRole.ADMIN]), validate(createSchema), userCtrl.create);
router.get('/users/get', authenticate, userCtrl.get);
router.put('/users/update', authenticate, validate(updateSchema), userCtrl.update);
router.delete('/users/delete', authenticate, validate(deleteSchema), userCtrl.delete);