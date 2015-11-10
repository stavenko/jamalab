var React = require('react');
var AceEditor  = require('react-ace');
var SectionsRender = require('./scriptrenderer.jsx');
var utils = require('../utils.js');
var dom = require('../dom.js');
var _ = require('underscore');
var HTTP = require('../http.jsx');

var get = utils.get;
var set = utils.set;
var emit = dom.emit;

require('brace/mode/javascript');
require('brace/theme/chrome');

module.exports = React.createClass({
  getInitialState(){
    return {
      item:{
        name:'',
        content:''
      }
    }
  },
  componentDidMount(){
    console.log(this.props);
    HTTP.crud.list('scripts',{_id:this.props.itemId}, 
                   (r)=>{
                     this.setState({ item: r.data[0] })
                     emit('source-changed', r.data[0].content);
                   }
                  );

  },

  onChange: function(obj) {
    emit('source-changed', obj);
    this.state.item.content = obj;
  },

  save(){
    HTTP.crud.save('scripts', 
                   _.extend({}, this.state.item,{_id:this.props.itemId}), 
                   e=>{
                     console.log(e);
                   })
  },

  render(){
    var javascript = get(this.state,'item.content') || '';

    return <div className='container-fluid'>

      <div className = 'row'>
        <div className='col-xs-12'>
          {get(this.state, 'item.name')}
        </div>
        <div className='col-xs-6'>
          <div id='id-javascript-editor'>
            <AceEditor
              mode="javascript"
              theme="chrome"
              name="blah1"
              value={javascript}
              onChange={ this.onChange } >
            </AceEditor>
          </div>

        </div>
        <div className='col-xs-6'>
          <SectionsRender source={this.state.item.content} />
        </div>
        <div className='clearfix' />
        <div className='col-xs-12'> 
          <a className='btn btn-primary' onClick={this.save}> Save </a>
        </div>

      </div>
    </div>
  }

})


