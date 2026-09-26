const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/skillswap';
    const forceInMemory = process.env.USE_IN_MEMORY_DB === 'true';

    if (forceInMemory) {
      console.log('USE_IN_MEMORY_DB is set to true. Initializing MongoMemoryServer...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      mongoUri = mongoServer.getUri();
      console.log(`MongoMemoryServer started at ${mongoUri}`);
    }

    try {
      const conn = await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 3000
      });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (connError) {
      if (!forceInMemory) {
        console.warn(`Could not connect to primary MongoDB at ${mongoUri}. Falling back to MongoMemoryServer...`);
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongoServer = await MongoMemoryServer.create();
        const fallbackUri = mongoServer.getUri();
        const conn = await mongoose.connect(fallbackUri);
        console.log(`Fallback MongoDB Connected: ${conn.connection.host}`);
      } else {
        throw connError;
      }
    }
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
