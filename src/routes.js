import { Router } from 'express';

import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileControler from './app/controllers/FileController';
import ProviderControler from './app/controllers/ProviderController';
import AppointmentControler from './app/controllers/AppointmentController';

import authMiddlaware from './app/middlewares/auth';

const routes = new Router();

const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddlaware); // Middleware usado apenas nas rotas abaixo (não nas de cima)

routes.put('/users', UserController.update);

routes.get('/providers', ProviderControler.index);

routes.post('/appointments', AppointmentControler.store);

routes.post('/files', upload.single('file'), FileControler.store);

export default routes;
