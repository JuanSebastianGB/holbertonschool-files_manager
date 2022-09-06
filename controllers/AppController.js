import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class AppController {
  /**
   * If the redis client is alive and the database
   *  client is alive, return a 200 status code with a JSON
   * object that has a redis key with a value of true and a db key with a value of true
   * @param req - The request object
   * @param res - The response object
   */
  static getStatus(req, res) {
    if (redisClient.isAlive() && dbClient.isAlive()) {
      res.status(200).json({ redis: true, db: true });
    }
  }

  /**
   * It gets the number of users and files from the database and sends them back to the client
   * @param req - the request object
   * @param res - the response object
   */
  static async getStats(req, res) {
    const users = await dbClient.nbUsers();
    const files = await dbClient.nbFiles();
    res.send({ users, files });
  }
}

export default AppController;
