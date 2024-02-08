import { createClient } from 'redis';


class RedisClient {
  constructor() {
    this.client = createClient();

    // Handle Refis client errors
    this.client.on('error', err => console.error('Redis Client Error', err));
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

export default redisClient;
