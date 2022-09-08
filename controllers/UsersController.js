import sha1 from 'sha1';
import dbClient from '../utils/db';

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
    const userEmail = await dbClient.db.collection('users').find({ email });
    console.log(userEmail);
    if (userEmail) res.status(400).json({ error: 'Already exist' });
    const { password } = req.body;
    const hashedPassword = sha1(password);

    const insertedUserId = await dbClient.db
      .collection('users')
      .insertOne({ email: userEmail, password: hashedPassword });
    res.status(201).json({ id: insertedUserId, email: userEmail });
  }
}
export default UsersController;
