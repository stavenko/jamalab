var React= require('react');
var t = require('tcomb-form');
var Form = t.form.Form;


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
    console.log("EEE", value);
    if(!SamePasswords(value))
      return "Passwords do not match";
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
  onClick(){
    var val = this.refs.form.getValue(true);
    console.log(val);
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
      <a className='btn btn-primary' onClick ={this.onClick }>Save </a>
    </div>
  }

})


