var React= require('react');
var utils = require('./utils.js');
var dom = require('./dom.js');
var Handle = require('./handleRenderer.jsx');
var Plot=require('./Plot.jsx');

var get = utils.get;
var set = utils.set;
var emit = dom.emit;

var SectionsRender = React.createClass({
  events:['source-changed', 'handle-changed'],

  handleChanged(e){
    set(this.state,  'computationState.sections.'
        + e.detail.sectionName + '.handles.'
        + e.detail.handle + '.value', parseFloat(e.detail.value));
    this.renderValues(e.sectionName);
          
  },

  componentDidMount: function(){
    dom.bindEvents(this);
  },

  componentWillUnmount: function(){
    dom.unbindEvents(this);
  },

  sourceChanged: function(e){
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
        //if(typeof fn !== 'function')
        //  fn = utils.arrayGetter(row.data, opts.start, opts.end);
        for(var x = opts.start; x < opts.end; x+= opts.step){
          row.x[counter] = x;

          try{
            row.y[counter] = fn(x, opts);
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
    if(this.parseScript(javascript))
      this.renderValues();
    return <div>
      {this.renderParseResults() }
    </div>
  }

})

module.exports = SectionsRender;
