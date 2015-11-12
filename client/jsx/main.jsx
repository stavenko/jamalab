var reactRouter = require('react-router')
var ReactDOM = require('react-dom');
var React= require('react');
var moment = require('moment');
var Backbone = require('backbone');
var router = require('./router.jsx');



function init(){
  moment.locale(window.navigator.language);
  Backbone.history.start();
}

module.exports.init = init;

