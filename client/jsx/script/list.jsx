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
    return <div key={item._id} className="col-xs-2"> 
      <div className='well'>
        <Link to={"/scripts/" +item._id} > {item.name}</Link> 
      </div>
    </div>
  },

  render(){
    var newButton = this.state.isFormVisible?
                    '':
                    <a onClick={this.createNew} className='btn btn-primary'> Create new script </a>
    var form = this.state.isFormVisible?this.renderForm():'';
      

    return <div className ='container'> 
      <div className='row'>
        <div className ='col-xs-12'> 
          <h2> You have scripts </h2>
        </div>
      </div>
      <div>
        { this.state.items.map(item=>this.renderItem(item) )}
      </div>
      <div className ='row'>
        <div className='col-xs-6'>
          {form}
          {newButton}
        </div>
      </div>
    </div>
  }

})


