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

var ScriptSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: false
  },
});

module.exports={
  user:mongoose.model('user', UserSchema),
  script:mongoose.model('script', ScriptSchema)
}
