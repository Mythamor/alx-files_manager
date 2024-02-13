const sha1 = require('sha1');
const dbClient = require('../utils/db');

// Hash the password with SHA1
export const hashedPassword = (password) => sha1(password);

// Define the req body
export const getAuthHeader = (req) => {
  const header = req.headers.authorization;
  if (!header) {
    return null;
  }
  return header;
};

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email) {
      res.status(400).json({ error: 'Missing email' });
      res.end();
      return;
    }
    if (!password) {
      res.status(400).json({ error: 'Missing password' });
      res.end();
      return;
    }

    // Check if the email already exists
    const existingUser = await dbClient.userExist(email);
    if (existingUser) {
      res.status(400).json({ error: 'Already exist ' });
      res.end();
      return;
    }

    // Create a new user obj
    const newUser = await dbClient.createUser(email, password);
    const userId = `${newUser.insertedId}`;

    // Return the new user with email and id
    res.status(201).json({ userId, email });
    res.end();
  }
}

module.exports = UsersController;
