var mongoose = require('mongoose');

var Liste = mongoose.model('Liste', {
  text : String,
  date : String,
  creator : String,
  done : Boolean
});

module.exports = Liste;