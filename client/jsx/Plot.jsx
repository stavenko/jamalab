var React = require('react');
var ReactDOM = require('react-dom');
var utils = require('./utils.js');
var Plot = React.createClass({
  lastRender: Date.now(),
  renderOnceIn:2000, // miliseconds
  requestedRedraw:false, 
  requestQueue:[],
  componentDidMount: function(){
    this.refresh();
    document.addEventListener('redraw-graph', this.refresh);
  },

  componentWillUnmount: function(){
    document.removeEventListener('redraw-graph', this.refresh);
  },

  componentWillUpdate: function(){
    this.refresh();
  },
  getArray: function(){
    console.log(this.props);
    if(this.props.arrays) return this.props.arrays;
    return utils.get(this.props.rootObj, this.props.path);

  },

  refresh: function(){
    var that = this;
    this.requestQueue.push(draw.bind(this));
    if(!this.interval)
      this.interval = setInterval(next.bind(this), this.renderOnceIn);

    function draw(){
      var arrays = this.getArray();
      var node = ReactDOM.findDOMNode(this);
      var layout = {
        autosize:true,
        width:node.clientWidth,
        shapes:[]
      }
      for(var i =0; i < arrays.length; i++){
        var array = arrays[i];
        if(array.helpers){
          for(var j = 0; j < array.helpers.length; j++){
            layout.shapes.push( array.helpers[j] );
          }
        }
      }
      Plotly.newPlot(node, arrays, layout);
      that.requestedRedraw = false;
    }
    function next(){
      console.log("Try");
      if(!this.requestQueue.length) return;
      console.log('draw', this.requestQueue);
      var f = this.requestQueue.pop();
      this.requestQueue=[];
      f();
    }


    //function next(){
      //var now = Date.now();
      //var diff = now - this.lastRender;
      //var leftTime = Math.min(Math.abs(this.renderOnceIn - diff), this.renderOnceIn);
    //}
  },

  render: function(){
    return <div />
  }

});

module.exports = Plot;
