import { Router } from 'express';

// Controllers
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

// Middlewares
import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/session', SessionController.store);

// All routes below this line require authentication
routes.use(authMiddleware);

routes.put('/users', UserController.update);

export default routes;
