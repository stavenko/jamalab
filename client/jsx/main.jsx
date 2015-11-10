var reactRouter = require('react-router')
var ReactDOM = require('react-dom');
var React= require('react');
var moment = require('moment');
var AuthCheker = require('./auth/auth.jsx');
var Backbone = require('backbone');
var router = require('./router.jsx');


function requireAuth(nextState, replaceState){
  if(nextState.location.pathname == '/')
    HTTP.auth.ask.isLoggedIn(function(result) {
      if(!result._id)
        return replaceState({ nextPathname: nextState.location.pathname }, '/login/')
      return replaceState({ nextPathname: nextState.location.pathname }, '/scripts')
    })
}

function init(){
  moment.locale(window.navigator.language);
  Backbone.history.start();
}

module.exports.init = init;

