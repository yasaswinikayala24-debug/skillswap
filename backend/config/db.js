const mongoose = require('mongoose');

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  // If already connected, return existing connection
  if (mongoose.connection && mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  let mongoUri = process.env.MONGODB_URI || 'mongodb+srv://yasaswinikayala24_db_user:2VvR57qNVoD87Ynp@cluster0.m6qblny.mongodb.net/skillswap?retryWrites=true&w=majority';
  const forceInMemory = process.env.USE_IN_MEMORY_DB === 'true';

  if (forceInMemory) {
    console.log('USE_IN_MEMORY_DB is set to true. Initializing MongoMemoryServer...');
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongoServer = await MongoMemoryServer.create();
    mongoUri = mongoServer.getUri();
  }

  if (!cached.promise || mongoose.connection.readyState === 0) {
    const opts = {
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000
    };

    cached.promise = mongoose.connect(mongoUri, opts).then((mongooseInstance) => {
      console.log(`MongoDB Connected: ${mongooseInstance.connection.host}`);
      return mongooseInstance;
    }).catch(err => {
      cached.promise = null;
      console.error('MongoDB Connection Error:', err.message);
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
};

module.exports = connectDB;
