const redisClient = require('../utils/redis');
const dbClient = require('../utils/db');

const AppController = {
  getStatus: async (req, res) => {
    try {
      const redisStatus = await redisClient.isAlive();
      const mongoStatus = await dbClient.isAlive();

      res.status(200).json({ redis: redisStatus, db: mongoStatus });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  },

  getStats: async (req, res) => {
    try {
      const usersCount = await dbClient.nbUsers();
      const filesCount = await dbClient.nbFiles();

      res.status(200).json({ users: usersCount, files: filesCount });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  },
};

module.exports = AppController;
