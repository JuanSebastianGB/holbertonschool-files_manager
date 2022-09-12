import { v4 as uuidv4 } from 'uuid';

import dbClient from '../utils/db';
import redisClient from '../utils/redis';

const crypto = require('crypto');

const error = 'Unauthorized';

/**
 * It takes a string, hashes it, and returns the hash
 * @param pwd - The password to be hashed.
 * @returns The hashed password.
 */
const hashPasswd = (pwd) => {
  const hash = crypto.createHash('sha1');
  const data = hash.update(pwd, 'utf-8');
  const genHash = data.digest('hex');
  return genHash;
};

class AuthController {
  /**
   * It takes the user's email and password, hashes the password, and then checks the database for a
   * matching user. If the user is found, it creates a token and stores it in Redis
   * @param req - The request object
   * @param res - The response object.
   * @returns A token
   */
  static async getConnect(req, res) {
    const user = req.header('Authorization');
    if (!user || user.length === 0) {
      return res.status(401).json({ error });
    }
    const data = user.substring(6);
    const buff = Buffer.from(data, 'base64').toString('utf-8');
    const credentials = buff.split(':');
    if (!credentials || credentials.length === 1) {
      return res.status(401).json({ error });
    }

    const email = credentials[0].toString('utf-8');
    const password = credentials[1].toString('utf-8');
    const hashedPassword = hashPasswd(password);
    const search = await dbClient.db
      .collection('users')
      .find({ email, password: hashedPassword })
      .toArray();

    if (search.length < 1) {
      return res.status(401).json({ error });
    }
    if (hashedPassword !== search[0].password) {
      return res.status(401).json({ error });
    }
    const key = uuidv4();
    const token = `auth_${key}`;
    await redisClient.set(token, search[0]._id.toString(), 86400);
    return res.status(200).json({ token: key });
  }

  /**
   * It deletes the key from the Redis database
   * @param req - The request object.
   * @param res - The response object.
   */
  static async getDisconnect(req, res) {
    const key = req.header('X-Token');
    if (!key || key.length === 0) {
      return res.status(401).json({ error });
    }
    if (await redisClient.get(`auth_${key}`)) {
      await redisClient.del(`auth_${key}`);
      return res.status(204).end();
    }
    return res.status(401).json({ error });
  }
}

export default AuthController;
