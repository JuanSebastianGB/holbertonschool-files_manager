import express from 'express';
import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';

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
};

export default router;
