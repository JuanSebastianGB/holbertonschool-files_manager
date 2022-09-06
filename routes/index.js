import express from 'express';
import AppController from '../controllers/AppController';

const router = (app) => {
  const route = express.Router();
  app.use(express.json());
  app.use('/', route);
  app.get('/status', (req, res) => AppController.getStatus(req, res));
  app.get('/stats', (req, res) => AppController.getStats(req, res));
};

export default router;
