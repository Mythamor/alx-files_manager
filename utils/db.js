const { MongoClient } = require('mongodb');
const mongo = require('mongodb');
const { hashedPassword } = require('../controllers/UsersController');

class DBClient {
  constructor() {
    const {
      DB_HOST = 'localhost',
      DB_PORT = '27017',
      DB_DATABASE = 'files_manager',
    } = process.env;

    this.host = DB_HOST;
    this.port = DB_PORT;
    this.database = DB_DATABASE;

    const url = `mongodb://${this.host}:${this.port}`;

    this.connected = false;
    this.client = new MongoClient(url, { useUnifiedTopology: true });

    // Handle promise rejection
    this.client.connect()
      .then(() => {
        this.connected = true;
      })
      .catch((err) => {
        console.error(err.message);
      });
  }

  // Returns true if connection is alive, else False
  isAlive() {
    return this.connected;
  }

  // Returns the number of documents in the collection users
  async nbUsers() {
    try {
      await this.client.connect();
      const db = this.client.db(this.database);
      const usersCollection = db.collection('users');
      const count = await usersCollection.countDocuments();
      return count;
    } catch (error) {
      console.error('Error getting number of users:', error);
      throw error;
    }
  }

  // Returns the number of documents in the collection files
  async nbFiles() {
    try {
      const db = this.client.db(this.database);
      const filesCollection = db.collection('files');
      const count = await filesCollection.countDocuments();
      return count;
    } catch (error) {
      console.error('Error getting number of files:', error);
      throw error;
    }
  }

  // Creates a new user in the db
  async createUser(email, password) {
    try {
      const hashedPwd = hashedPassword(password);
      await this.client.connect();
      const db = this.client.db(this.database);
      const usersCollection = db.collection('users');
      const user = await usersCollection.insertOne({ email, password: hashedPwd });
      return user;
    } catch (error) {
      console.error('Error getting user by email:', error);
      throw error;
    }
  }

  // Gets users by email
  async getUserByEmail(email) {
    try {
      await this.client.connect();
      const db = this.client.db(this.database);
      const usersCollection = db.collection('users');
      const user = await usersCollection.find({ email }).toArray();
      if (!user.length) {
        return null;
      }
      return user[0];
    } catch (error) {
      console.error('Error getting user by email:', error);
      throw error;
    }
  }

  // Gets user by id
  async getUserById(id) {
    try {
      const userId = new mongo.ObjectID(id);
      await this.client.connect();
      const db = this.client.db(this.database);
      const usersCollection = db.collection('users');
      const user = await usersCollection.find({ userId }).toArray();
      if (!user.length) {
        return null;
      }
      return user[0];
    } catch (error) {
      console.error('Error getting user by email:', error);
      throw error;
    }
  }

  // Check if user exists in the db
  async userExist(email) {
    const user = await this.getUser(email);
    if (user) {
      return true;
    }
    return false;
  }
}

const dbClient = new DBClient();
module.exports = dbClient;
