var express = require('express');
var session = require('cookie-session');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser'); 
var paginate = require('express-paginate');
var models = require('./models.js');
var auth = require('./back/auth.js');
var scripts = require('./back/scripts.js');





var config = require('./config');

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
  auth.init(app, server);
  scripts.init(app, server);

})


module.exports.testApp = app;

