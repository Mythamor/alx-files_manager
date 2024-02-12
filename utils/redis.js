import { createClient } from 'redis';

class RedisClient {
  constructor() {
    this.client = createClient({ debug_mode: true });

    // Handle Refis client errors
    this.client.on('error', (err) => console.error('Redis Client Error', err));

    // Handle the 'connect'
    this.client.on('connect', () => console.log('Redis client connected'));
  }

  isAlive() {
    return this.client.connected;
  }

  async get(key) {
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, reply) => {
        if (err) {
          console.error('Redis GET Error:', err);
          reject(err);
        } else {
          resolve(reply);
        }
      });
    });
  }

  async set(key, value, duration) {
    return new Promise((resolve, reject) => {
      this.client.set(key, value, 'EX', duration, (err, reply) => {
        if (err) {
          console.error('Redis SET Error:', err);
          reject(err);
        } else {
          resolve(reply);
        }
      });
    });
  }

  async del(key) {
    // eslint-disable-next-line no-unused-vars
    return new Promise((resolve, reject) => {
      this.client.del(key, (err, reply) => {
        if (err) {
          console.error('Redis DEL Error:', err);
        } else {
          resolve(reply);
        }
      });
    });
  }
}

// Create an instance of RedisClient n export it
const redisClient = new RedisClient();

module.exports = redisClient;
