const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

  userId: {
    type: String,
    required: true,
    unique: true
  },

  // เงินหลัก
  money: {
    type: Number,
    default: 1000
  },

  // Daily
  lastDaily: {
    type: Number,
    default: 0
  },

  // Work
  workLevel: {
    type: Number,
    default: 1
  },

  workXp: {
    type: Number,
    default: 0
  },

  lastWork: {
    type: Number,
    default: 0
  },

  // Casino Stats
  casinoPlayed: {
    type: Number,
    default: 0
  },

  casinoWin: {
    type: Number,
    default: 0
  },

  casinoLose: {
    type: Number,
    default: 0
  }

});

module.exports =
  mongoose.model('User', userSchema);
