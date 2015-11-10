var React = require('react');
var Link = require('../utils/Link.jsx');
var t = require('tcomb-form');
var Form = t.form.Form;
var HTTP = require('../http.jsx');
var hash = require('jshashes');

var SHA1 = new hash.SHA1;

var Login = t.struct({
  email: t.String,
  password: t.String
});

var loginError;
var options = {
  auto:'placeholders',
  error: function(v){
    if(loginError) return loginError;
  },

  fields:{
    password:{
      type:'password'
    }
  }
}

module.exports = React.createClass({
  getInitialState(){
    return {
      email: '',
      password: ''
    }
  },
  onChange(value){ this.setState({value}); loginError = false; },
  login(){
    var value = this.refs.form.getValue();
    
    if(value) HTTP.auth.login({
      email:value.email,
      password:SHA1.hex(value.password)
    }, (e)=>{
      if(!e.error) return  this.props.router.nav('/scripts/');
      loginError = e.error;
      this.refs.form.refs.input.setState({ hasError: true });

    })
  },
  render(){
    return <div> 
      <Form 
        ref='form'
        type={Login}
        options={options}
        value = {this.state.value}
        onChange={this.onChange}
      />
      <a onClick={this.login} className='btn btn-primary'> Login </a> 
      <Link to='/register' cls='btn'> Go to registration </Link> 

    </div>
  }

})

