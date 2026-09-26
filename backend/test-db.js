const mongoose = require('mongoose');

const uri = 'mongodb+srv://yasaswinikayala24_db_user:2VvR57qNVoD87Ynp@cluster0.m6qblny.mongodb.net/skillswap?retryWrites=true&w=majority';

console.log('Testing direct MongoDB Atlas connection to:', uri.replace(/:[^:@]+@/, ':****@'));

mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    console.log('✅ SUCCESS: Connected to MongoDB Atlas!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ FAILURE: MongoDB Atlas Error:');
    console.error(err);
    process.exit(1);
  });
