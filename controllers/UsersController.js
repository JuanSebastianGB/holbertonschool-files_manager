import { ObjectId } from 'mongodb';
import crypto from 'crypto';

import dbClient from '../utils/db';
import redisClient from '../utils/redis';

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

class UsersController {
  /**
   * It creates a new user in the database
   * @param req - The request object.
   * @param res - The response object.
   */
  static async postNew(req, res) {
    const { email, password } = req.body;
    if (!email) return res.status(400).json({ error: 'Missing email' });
    if (!password) return res.status(400).json({ error: 'Missing password' });
    const userSearched = await dbClient.db
      .collection('users')
      .find({ email })
      .toArray();
    if (userSearched.length > 0) {
      return res.status(400).json({ error: 'Already exist' });
    }
    const hashedPassword = hashPasswd(password);
    const insertedUser = await dbClient.db
      .collection('users')
      .insertOne({ email, password: hashedPassword });
    return res.status(201).json({
      id: insertedUser.ops[0]._id,
      email: insertedUser.ops[0].email,
    });
  }

  /**
   * It gets the user's session from the database and returns it to the client
   * @param req - The request object.
   * @param res - The response object.
   * @returns The user's id and email.
   */
  static async getMe(req, res) {
    const key = req.header('X-Token');
    const session = await redisClient.get(`auth_${key}`);
    if (!key || key.length === 0) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    if (session) {
      const search = await dbClient.db
        .collection('users')
        .find({ _id: ObjectId(session) })
        .toArray();
      return res
        .status(200)
        .json({ id: search[0]._id, email: search[0].email });
    }
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

export default UsersController;
