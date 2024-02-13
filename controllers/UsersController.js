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

const UsersController = {
  postNew: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Check if email and password are provided
      if (!email) {
        return res.status(400).json({ error: 'Missing email' });
      }
      if (!password) {
        return res.status(400).json({ error: 'Missing password' });
      }

      // Check if the email already exists
      const existingUser = await dbClient.userExist(email);
      if (existingUser) {
        return res.status(400).json({ error: 'Already exist ' });
      }

      // Create a new user obj
      const newUser = await dbClient.createUser(email, password);
      const userId = `${newUser.insertedId}`;

      // Return the new user with email and id
      return res.status(201).json({ userId, email });
    } catch (error) {
      console.error('Error creating user:', error);
      return res.status(500).json({ error: 'Internal Server Error ' });
    }
  },
};

module.exports = UsersController;
