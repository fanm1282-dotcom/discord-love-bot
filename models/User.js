const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

  userId: {
    type: String,
    required: true,
    unique: true
  },

  money: {
    type: Number,
    default: 1000
  }

});

module.exports =
  mongoose.model('User', userSchema);
