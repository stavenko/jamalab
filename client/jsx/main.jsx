/** @jsx React.DOM */
var ReactDOM = require('react-dom');
var React= require('react');
var brace= require('brace');
var AceEditor  = require('react-ace');
var moment = require('moment');
var Plot=require('./Plot.jsx');
var utils = require('./utils.js');
var dom = require('./dom.js');


var get = utils.get;
var set = utils.set;
var emit = dom.emit;

require('brace/mode/javascript')
require('brace/theme/chrome')



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
    console.log(this.props);
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

var SectionsRender = React.createClass({
  events:['source-changed', 'handle-changed'],

  handleChanged(e){
    set(this.state,  'computationState.sections.'
        + e.detail.sectionName + '.handles.'
        + e.detail.handle + '.value', parseFloat(e.detail.value));
        // console.log(this.state.computationState.sections
    this.renderValues(e.sectionName);
          
  },

  componentDidMount: function(){
    dom.bindEvents(this);
  },

  componentWillUnmount: function(){
    dom.unbindEvents(this);
  },

  sourceChanged: function(e){
    console.log("sourceChanged");
    this.setState({ source: e.detail });
  },

  getInitialState: function(){
    return {
      source: this.props.source,
      computationState: { sections: {} }
    }
  },
  renderValues(name, plotId) {
    var plots = get(this.state, 'computationState.sections.'+name+'.plots') ;
    if(plots)
      if(plotId) return renderPlot(plots[plotId]);
      else return renderPlots(plots);
    for(var k in this.state.computationState.sections){
      var section = this.state.computationState.sections[k];
      renderPlots(section.plots);
    }

    function renderPlots(plots){
      for(var j =0; j < plots.length; j++){
        renderPlot(plots[j]);
      }
    }

    function renderPlot(plot){
      var opts = plot.opts;
      var rows = plot.rows;

      if(opts.step == 0){
        console.warn('Step of computation is 0');
        return;
      }

      if((opts.end - opts.start)/opts.step > 3000){
        console.warn('Too big amount of steps');
        return;
      }

      for(var i =0; i < rows.length; i++){
        var row = rows[i];
        var counter = 0;
        var fn = row.data;
        if(typeof fn !== 'function')
          fn = utils.arrayGetter(row.data, opts.start, opts.end);
        for(var x = opts.start; x < opts.end; x+= opts.step){
          row.x[counter] = x;

          try{
            row.y[counter] = fn(x);
          }catch(e){
            console.error("Fail", e.message);
          }
          counter ++;
        }
      }
      emit('redraw-graph');
    }
  },

  parseScript: function(javascript){
    var fns = [];
    for(var k in utils){
      fns.push('var ' + k + ' = api.' + k + ';');
    }
    functionBody = ''+
      fns.join('\n') +  ";\n" +
      Section.toString() + ";\n" +
      javascript;
    try{
      var f= new Function('state', 'api', functionBody)
      f(this.state.computationState, utils);
      return true;
    }catch(e){
      console.error(e.message);
      return false;
    }

    var that = this;

    function Section(n){
      state.sections[n] = {
        name:n,
        handle:function(n, opts){
          opts = opts ||{};
          var default_ = opts.default || 1;
          var min = opts.min || 0;
          var max = opts.max || 100;

          Object.defineProperty(this, n, {
            get: function(){ 
              return get(this, 'handles.'+n+'.value') ||0 ;
            }
          });
          set(this, 'handles.' + n +'.value', default_);
          set(this, 'handles.' + n +'.min', min);
          set(this, 'handles.' + n +'.max', max);
        },

        handles:{},

        plot:function(rows, opts){
          opts = opts || {};
          var defaults = {start:0, end:100, step:1}
          if(!this.plots) this.plots = [];
          var thisPlot = {
            opts: extend({}, defaults, opts),
            rows:[]
          }
          this.plots.push(thisPlot) ;
          for(var i =0; i < rows.length; i++){
            thisPlot.rows[i] = { label: rows[i].label || "Plot" + i, x:[], y:[], data:rows[i] };
          }
          console.log(this.plots);
        }
      }
      return state.sections[n];
    }

  },
  renderHandle: function(sectionName, key, handle){
    return <Handle 
      key={'handle-' +key}
      handleName={key}
      sectionName={sectionName}
      handle={handle}
    />
  },

  renderPlots: function(fromSection, plots){
    var that = this;
    return plots.map(function(plot,i){
      return <div key={i}> 
        <Plot 
          path={'sections.' + fromSection + '.plots.'+ i+ '.rows' }
          rootObj={that.state.computationState }
        />
        </div>
    })
  },


  renderHandles: function(sectionName, handles){
    var ret = [];

    for(var k in handles){
      ret.push( this.renderHandle(sectionName, k, handles.k));
    }
    return <div className = 'form-horizontal'>
      {ret}
    </div>
  },

  renderSection(sectionLabel, section){
    console.log(section);
    return <div className='row' key={'section+' + sectionLabel}>
      <div className='col-xs-12'>
        <h3>{ sectionLabel }</h3>
      </div>
      <div className='col-xs-12'>
        { this.renderHandles(sectionLabel, section.handles) }
      </div>
      <div className='col-xs-12'>
        { this.renderPlots(sectionLabel, section.plots) }
      </div>
    </div>
  },

  renderParseResults: function(){
    var sections = [];
    for(var k in this.state.computationState.sections)
      sections.push(this.renderSection(k, get(this.state,'computationState.sections.'+k)));
    return sections;
  },

  render: function(){
    var javascript = this.state.source;
    console.log('PPPP');
    if(this.parseScript(javascript))
      this.renderValues();
    return <div>
      {this.renderParseResults() }
    </div>
  }

})



var Main = React.createClass({

  onChange: function(obj) {
    emit('source-changed', obj);
  },

  getInitialState: function(){
    var x = [];
    var y = [];
    for(var i = 0; i <= 1; i+=0.01){
      x.push(i);
      y.push(i*i);
    }
    return {
      javascript: ''
        +'var section = Section("First");\n'
        +'section.handle("k");\n'
                    +'function b (t){\n'
                    +'  return section.k * t*t;\n'
                    +'}\n'
                    +'\n'
                    +'function a (t){\n'
                    +'  return section.k*Math.sqrt(t);\n'
                    +'}\n'
                    +'\n'
                    +'section.plot([a,b]);\n',
      arrays: [{
        x:x, y:y, label:'sqr'
      }]
    }
  },

  render: function(){
    var javascript = this.state.javascript;   

    //console.log("JS", javascript);
    return <div className='container-fluid'>

      <div className = 'row'>
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
          <SectionsRender source={this.state.javascript} />
        </div>
      </div>
    </div>
  }
})

function init(){
  moment.locale(window.navigator.language);
  ReactDOM.render(<Main />, document.getElementById('content'));
}

module.exports.init = init;
