var express = require('express');
var session = require('cookie-session');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser'); 
var paginate = require('express-paginate');


var config = require('./config');
// var auth = require('./endpoints/auth.js');
// var crud = require('./endpoints/crud.js');
mongoose.connect(config.production.db.url);

var app = express()

app.use(cookieParser());
app.use(session({
  name:'session',
  keys:["secret", "keys"]
}));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(paginate.middleware(20, 70));


app.use(express.static(__dirname + '/client'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

var server = app.listen(3000, function(){
  
})


module.exports.testApp = app;

