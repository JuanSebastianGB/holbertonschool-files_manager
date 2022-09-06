import { createClient } from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    this.client = createClient();
    this.client.on('error', (err) => {
      console.log(`It was not able to connect, Err: ${err}`);
    });
    this.asyncGet = promisify(this.client.get).bind(this.client);
  }

  isAlive() {
    return this.client.connected;
  }

  async get(key) {
    return this.asyncGet(key);
  }

  async set(key, value, duration) {
    this.client.setex(key, duration, value);
  }
}

const redisClient = new RedisClient();
export default redisClient;
