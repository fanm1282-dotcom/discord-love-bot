const mongoose =
  require('mongoose');

const dailyLoveSchema =
  new mongoose.Schema({

    userId: String,

    date: String,

    result: Object

});

module.exports =
  mongoose.model(
    'DailyLove',
    dailyLoveSchema
  );
