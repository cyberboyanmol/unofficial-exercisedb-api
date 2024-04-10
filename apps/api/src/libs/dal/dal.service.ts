import { Connection, ConnectOptions } from 'mongoose';
import * as mongoose from 'mongoose';
export class DalService {
  connection: Connection;

  async connect(url: string, config: ConnectOptions = {}): Promise<Connection> {
    const baseConfig: ConnectOptions = {
      maxPoolSize: +process.env.MONGO_MAX_POOL_SIZE || 500,
      minPoolSize: +process.env.MONGO_MIN_POOL_SIZE || 10,
      maxIdleTimeMS: 1000 * 60 * 10, //default 10 minutes
      autoIndex: process.env.AUTO_CREATE_INDEXES === 'true',
    };

    const instance = await mongoose.connect(url, {
      ...baseConfig,
      ...config,
    });
    console.log('Database connected successfully');
    this.connection = instance.connection;
    return this.connection;
  }

  isConnected(): boolean {
    return this.connection && this.connection.readyState === 1;
  }

  async disconnect() {
    await mongoose.disconnect();
  }

  /**
   * The `destroy` function drops the database only in a test environment.
   */
  async destroy() {
    if (process.env.NODE_ENV !== 'test')
      throw new Error('Allowed only in test environment');

    await mongoose.connection.dropDatabase();
  }
}
