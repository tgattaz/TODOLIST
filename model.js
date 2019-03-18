var mongoose = require('mongoose');

var Liste = mongoose.model('Liste', {
  text : String,
  date : String,
  creator : String
});

module.exports = Liste;