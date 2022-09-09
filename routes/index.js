import express from 'express';
import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController';

/**
 * It's a function that takes an express app as an argument and returns a function that takes an
 * express app as an argument
 * @param app - The express app object
 */
const router = (app) => {
  const route = express.Router();
  app.use(express.json());
  app.use('/', route);
  app.get('/status', (req, res) => AppController.getStatus(req, res));
  app.get('/stats', (req, res) => AppController.getStats(req, res));
  app.post('/users', (req, res) => UsersController.postNew(req, res));
  app.get('/connect', (req, res) => AuthController.getConnect(req, res));
  app.get('/disconnect', (req, res) => AuthController.getDisconnect(req, res));
  app.get('/users/me', (req, res) => UsersController.getMe(req, res));
};

export default router;
