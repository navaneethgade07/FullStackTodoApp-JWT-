const mongoose = require('mongoose');

const createSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
});

// Virtual method to compute the user's full name
createSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Method to exclude the password field when the document is converted to JSON
createSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('newUser', createSchema);
