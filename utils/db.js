const { MongoClient } = require('mongodb');

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
}

const dbClient = new DBClient();
module.exports = dbClient;
