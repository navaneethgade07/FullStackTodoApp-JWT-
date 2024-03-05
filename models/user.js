const mongoose = require('mongoose');

const createSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  
  username: {
    type: String,
    required: true,
    unique: true,
  },
  
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
});

module.exports = mongoose.model('newUser', createSchema);
