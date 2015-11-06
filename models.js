var mongoose = require('mongoose');
var config = require('./config.js');
mongoose.connect(config.production.db.url);

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
});

module.exports={
  user:mongoose.model('user', UserSchema)
}
