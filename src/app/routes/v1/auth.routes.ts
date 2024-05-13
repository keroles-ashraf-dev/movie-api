import "reflect-metadata";
import { Router } from 'express';
import { container } from 'tsyringe';
import {AuthController} from 'app/controllers/v1/auth.controller'
import validate from 'app/middlewares/validate';
import { registerSchema, loginSchema, refreshTokenSchema } from 'app/validations/v1/auth.validation';

const router = Router();
const authCtrl = container.resolve(AuthController);

router.post('/register', validate(registerSchema), authCtrl.register);
router.post('/login', validate(loginSchema), authCtrl.login);
router.post('/token/refresh', validate(refreshTokenSchema), authCtrl.refreshToken);

export default router;