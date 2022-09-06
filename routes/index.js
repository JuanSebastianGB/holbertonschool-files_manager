import express from 'express';
import AppController from '../controllers/AppController';

const router = (app) => {
  const route = express.Router();
  app.use(express.json());
  app.use('/', route);
  app.get('/status', AppController.getStatus());
  app.get('/stats', AppController.getStats());
};

export default router;
