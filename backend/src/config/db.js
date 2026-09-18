import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let mongodInstance = null;

export const connectDB = async () => {
  // If already connected, return immediately
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hyperlocal_construction';

  try {
    // Attempt connecting to the configured URI with a 2-second timeout
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`[DB] Connected to MongoDB at ${mongoose.connection.host}:${mongoose.connection.port}`);
  } catch (err) {
    console.warn(`[DB] Could not connect to MongoDB at ${uri}. Launching resilient in-memory database...`);
    try {
      if (!mongodInstance) {
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        mongodInstance = await MongoMemoryServer.create();
      }
      const memUri = mongodInstance.getUri();
      if (mongoose.connection.readyState !== 1) {
        await mongoose.connect(memUri);
      }
      console.log(`[DB] In-Memory MongoDB running successfully at ${memUri}`);
    } catch (memErr) {
      console.error('[DB] Failed to initialize MongoMemoryServer fallback:', memErr);
      throw memErr;
    }
  }

  return mongoose.connection;
};

export const closeDB = async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    if (mongodInstance) {
      await mongodInstance.stop();
      mongodInstance = null;
    }
  } catch (err) {
    console.error('[DB] Error closing MongoDB connection:', err);
  }
};
