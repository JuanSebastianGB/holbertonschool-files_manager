import sha1 from 'sha1';
import dbClient from '../utils/db';

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
    const userSearched = await dbClient.db.collection('users').find({ email });

    if (userSearched) return res.status(400).json({ error: 'Already exist' });
    const hashedPassword = sha1(password);

    const insertedUser = await dbClient.db
      .collection('users')
      .insertOne({ email, password: hashedPassword });
    return res.status(201).json({
      id: insertedUser.ops[0]._id,
      email: insertedUser.ops[0].email,
    });
  }
}
export default UsersController;
