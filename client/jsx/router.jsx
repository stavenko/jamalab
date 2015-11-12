var ReactDOM = require('react-dom');
var React= require('react');
var Login = require('./auth/login.jsx');
var Register = require('./auth/register.jsx');
var ScriptsList = require('./script/list.jsx')
var Script = require('./script/item.jsx')
var HTTP = require('./http.jsx')
var Backbone = require('backbone');

var App = Backbone.Router.extend({
  routes:{
    '': 'checkLogin',
    'login': 'login',
    'register': 'register',
    'scripts': 'scripts',
    'scripts/:id':'script'
  },

  scripts() {
    this.render(<ScriptsList router={this} />);
  },

  script(id) {
    this.render(<Script itemId={id} router={this} />);
  },

  checkLogin() {
    HTTP.auth.ask.isLoggedIn((e)=>{
      if(!e._id) this.nav('/login');
      else this.nav('/scripts');
    });
  },

  register() {
    this.render(<Register router={this} />);
  },

  login() {
    this.render(<Login router={this} />);
  },

  nav(url) {
    this.navigate(url, {trigger: true});
  },

  render(C) {
    ReactDOM.render(C, document.getElementById('content'));
  }
  

})

var router = new App();
var historyStarted = false;

module.exports = {
  navigate: function(url){
    router.nav(url);
  }
}


