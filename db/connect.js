const mongoose = require('mongoose');

const connectDB = (url) => {
  return mongoose.connect(url)
    .then(() => {
      console.log('Connected to the database');
      return mongoose.connection;
    })
    .catch((error) => {
      console.error('Error connecting to the database:', error);
      process.exit(1);
    });
};

module.exports = connectDB;
