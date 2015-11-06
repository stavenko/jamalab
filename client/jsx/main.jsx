var reactRouter = require('react-router')
var ReactDOM = require('react-dom');
var React= require('react');
var moment = require('moment');

var AuthCheker = require('./auth/auth.jsx');
var Login = require('./auth/login.jsx');
var Register = require('./auth/register.jsx');
var ScriptsList = require('./script/list.jsx')
var Script = require('./script/item.jsx')
var HTTP = require('./http.jsx')

var Router = reactRouter.Router;
var Route = reactRouter.Route;

function requireAuth(nextState, replaceState){
  if(nextState.location.pathname != '/')
    HTTP.auth.ask.isLoggedIn(function(result) {
      if(!result._id)
        return replaceState({ nextPathname: nextState.location.pathname }, '/login')
      return replaceState({ nextPathname: nextState.location.pathname }, '/scripts')

    })
}

function init(){
  moment.locale(window.navigator.language);
  ReactDOM.render(<Router>
    <Route path='/' onEnter={requireAuth} >
      <Route path='login' component={Login} />
      <Route path='register' component={Register} />
      <Route path='scripts' component={ScriptsList} >
        <Route path=':scriptId' component={Script} />
      </Route>
    </Route>
  </Router>, 
  document.getElementById('content'));
}

module.exports.init = init;

