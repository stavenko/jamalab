var React= require('react');
var utils = require('./utils.js');
var dom = require('./dom.js');

var get = utils.get;
var set = utils.set;
var emit = dom.emit;

var Handle = React.createClass({
  handleChange: function(sectionName, handleKey){
    return onHandleChange.bind(this);

    function onHandleChange(e){
      var newValue = e.currentTarget.value;
      this.setState({ value: newValue });
      emit('handle-changed', {
        sectionName: sectionName,
        value:newValue,
        handle:handleKey
      })
    }
  },

  getInitialState: function(){
    return {value:this.props.handle.value}
  },

  render: function(){
    return <div  className='form-group'>
      <label className='col-xs-3'> {this.props.handleName} </label>
      <div className='col-xs-2'> 
        <input 
          type='range' 
          value={this.state.value} 
          onChange={this.handleChange(this.props.sectionName, this.props.handleName) }
        />
      </div>
    </div>
  }
})


module.exports=Handle;
