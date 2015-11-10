var React = require('react');
var HTTP = require('../http.jsx');
var t = require('tcomb-form');
var Form = t.form.Form;
var Link = require('../utils/Link.jsx');


var scriptName = t.struct({
  name: t.String
});

var options={
  auto:'placeholders'
}
module.exports = React.createClass({
  getInitialState(){
    return {
      isFormVisible: false,
      items:[],
      newValue:{
        name:''
      }
    };

  },
  componentDidMount(){
    this.updateFromServer();
  },

  createNew(){
    var isFormVisible = this.state.isFormVisible;
    this.setState({ isFormVisible: !isFormVisible });
  },

  onChange(newValue){
    this.setState({ newValue });
  },

  updateFromServer(){
    HTTP.crud.list('scripts', {}, (data)=>{
      if(!data.error) this.setState({ items: data.data });
    });
  },

  create(){
    var value = this.refs.form.getValue();
    HTTP.crud.save('scripts', value, e=> {
      if(!e.error) this.setState({ isFormVisible:false });
      this.updateFromServer();
    })
  },

  cancel(){
    this.setState({ isFormVisible:false });
  },

  renderForm(){
    return <div className='form-inline'>
      <Form type={scriptName} 
        ref='form'
        options={options}
        value={this.state.newValue}
        onChange = {this.onChange }
      />
      <a className='btn btn-primary' onClick={this.create}> Create</a>
      <a className='btn' onClick={this.cancel}> Cancel</a>
    </div>

  },

  renderItem(item){
    return <div key={item._id}> 
      <Link to={"/scripts/" +item._id} > {item.name}</Link> 
    </div>
  },

  render(){
    var newButton = this.state.isFormVisible?
                    '':
                    <a onClick={this.createNew}> Create new script </a>
    var form = this.state.isFormVisible?this.renderForm():'';
      

    return <div> 
      <div>
        { this.state.items.map(item=>this.renderItem(item) )}
      </div>
      {newButton}
      {form}
    </div>
  }

})


