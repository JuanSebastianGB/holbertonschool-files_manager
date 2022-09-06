import sha1 from 'sha1';
import DBClient from '../utils/db';

class UsersController {
  /**
   * It creates a new user in the database
   * @param req - The request object.
   * @param res - The response object.
   */
  static async postNew(req, res) {
    if (!req.body.email) res.status(400).json({ error: 'Missing email' });
    if (!req.body.password) res.status(400).json({ error: 'Missing password' });

    const { email } = req.body;
    const userEmail = await DBClient.db.collection.findOne({ email });
    if (userEmail) res.status(400).json({ error: 'Already exist' });
    const { password } = req.body;
    const hashedPassword = sha1(password);

    const insertedUserId = await DBClient.db
      .collection('users')
      .insertOne({ email: userEmail, password: hashedPassword });
    res.status(201).json({ id: insertedUserId, email: userEmail });
  }
}
export default UsersController;
