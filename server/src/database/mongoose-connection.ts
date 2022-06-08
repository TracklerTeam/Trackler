import mongoose, { Connection } from 'mongoose';
import 'dotenv/config';

let mongooseConnection: Connection = null;
export async function connect(): Promise<void> {
  try {
    mongoose.connection.on('connecting', () => {
      console.info(`MongoDB: connecting.`);
    });
    mongoose.connection.on('connected', () => {
      console.info('MongoDB: connected.');
    });
    mongoose.connection.on('disconnecting', () => {
      console.info('MongoDB: disconnecting.');
    });
    mongoose.connection.on('disconnected', () => {
      console.info('MongoDB: disconnected.');
    });

    if (mongoose.connection.readyState !== 1 && mongoose.connection.readyState !== 2) {
      const conn = await mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URL}/?retryWrites=true&w=majority`, {
        autoIndex: true,
        serverSelectionTimeoutMS: 5000,
      });
      mongooseConnection = conn.connection;
    }
  } catch (error) {
    console.error(`Error connecting to DB`, error);
  }
}