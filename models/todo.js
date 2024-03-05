const mongoose  = require('mongoose');

const User = require('./userModel'); // assuming the User model is in a separate file named userModel.js

const todoSchema = new mongoose.Schema({
    task: { 
        type: String,
        required: true 
    },
    completed : {
        type: Boolean,
        default: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Todo', todoSchema);
