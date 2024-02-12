const { MongoClient } = require('mongodb');

class DBClient {
  constructor() {
    const {
      DB_HOST = 'localhost',
      DB_PORT = '27017',
      DB_DATABASE = 'files_manager',
    } = process.env;

    const url = `mongodb://${DB_HOST}:${DB_PORT}`;

    this.client = new MongoClient(url, { useUnifiedTopology: true });
    this.host = DB_HOST;
    this.port = DB_PORT;
    this.database = DB_DATABASE;
  }

  // Returns true if connection is alive, else False
  async isAlive() {
    try {
      await this.client.connect();
      return true;
    } catch (error) {
      console.error('MongoDB Connection Error:', error);
      return false;
    }
  }

  // Returns the number of documents in the collection users
  async nbUsers() {
    try {
      const db = this.client.db(this.database);
      await db.createCollection('users');
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
}

const dbClient = new DBClient();
module.exports = dbClient;
