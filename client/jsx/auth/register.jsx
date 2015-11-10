var React= require('react');
var hash = require('jshashes');
var t = require('tcomb-form');
var Form = t.form.Form;
var HTTP = require('../http.jsx');


var SHA1 = new hash.SHA1;
var serverError;

function SamePasswords(v){
  return v.password === v.password_confirm;
}

var Register = t.subtype(t.struct({
  email: t.String,
  password: t.String,
  password_confirm:t.String

}), SamePasswords)

var options={
  auto: 'placeholders',
  error: function(value){
    if(!SamePasswords(value))
      return "Passwords do not match";
    if(serverError) return serverError;

  },
  fields:{
    password_confirm:{
      type:'password',
    },
    password:{
      type:'password',
    }
  }
}
module.exports = React.createClass({
  getInitialState(){

    return {
      email:'',
      password:'',
      password_confirm:'',
    }
  },
  onChange(value){
    this.setState({value});
  },
  getError(error){
    switch(error.code){
        case 11000: return 'Login exists';
        default: return 'Unknown error';
    }
  },
  onClick(){
    var val = this.refs.form.getValue();
    if(!val) return;
    HTTP.auth.register({
      email:val.email,
      password: SHA1.hex(val.password)
    }, (e)=>{ 
      if(!e.error) return this.props.router.nav('login'); 
      if(e.error.code) serverError = this.getError(e.error);
      else serverError = e.error.message;
      this.refs.form.refs.input.setState({hasError: true})
    });
  },
  render(){
    return <div> 
      <Form 
        ref='form'
        type={Register}
        options={options}
        value = {this.state.value}
        onChange={this.onChange}
      />
      <a className='btn btn-primary' onClick ={this.onClick }> Register </a>

    </div>
  }

})


