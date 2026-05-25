const mongoose =
  require('mongoose');

const schema =
  new mongoose.Schema({

    userId: String,

    streak: {

      type: Number,
      default: 1

    },

    lastDate: String

});

module.exports =
  mongoose.model(
    'Streak',
    schema
  );
