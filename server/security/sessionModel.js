var mongoose = require('mongoose');

var SessionSchema = new mongoose.Schema({
  date: {
    type: Date
  }
});

module.exports = mongoose.model('sessions', SessionSchema);