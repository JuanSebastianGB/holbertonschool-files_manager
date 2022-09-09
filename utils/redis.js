import { createClient } from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    this.client = createClient();
    this.client.on('error', (err) => console.log(err.message));
    this.asyncGet = promisify(this.client.get).bind(this.client);
  }

  isAlive() {
    return this.client.connected;
  }

  async get(key) {
    const getValue = await promisify(this.client.get).bind(this.client);
    const value = await getValue(key);
    return value;
  }

  async set(key, value, duration) {
    this.client.setex(key, duration, value);
  }

  async del(key) {
    await this.client.del(key);
  }
}

const redisClient = new RedisClient();
export default redisClient;
