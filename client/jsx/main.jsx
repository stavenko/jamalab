/** @jsx React.DOM */
var ReactDOM = require('react-dom');
var React= require('react');
var brace= require('brace');
var AceEditor  = require('react-ace');
var moment = require('moment');
var utils = require('./utils.js');
var dom = require('./dom.js');
var SectionsRender = require('./scriptrenderer.jsx');

var get = utils.get;
var set = utils.set;
var emit = dom.emit;

require('brace/mode/javascript');
require('brace/theme/chrome');
var Test1 = 
'var section = Section("First");\n'
+'section.handle("k");\n'
+'function b (t){\n'
+'  return section.k * t*t;\n'
+'}\n'
+'\n'
+'function a (t){\n'
+'  return section.k*abs(sqrt(t));\n'
+'}\n'
+'var arr = array([1,0,1,0, 1,0,1], -2,2);\n'
+'var j = sqrt(-1);\n'
+'var f = 0.1;\n'
+'var T = 2/f;\n'
+'var PI = Math.PI\n'
+'function s(t){\n'
+'    return {re:cos(f*PI*t),im:0, isComplex:true};\n'
+'    //return mul( exp(mul(j,f,t,PI,2)), 20);\n'
+'}\n'
+'\n'
+'function re(f){return function(i){ return f(i).re; }};\n'
+'function absf(f){ return function(i){ return abs(f(i)); }};\n'
+'var ff = fft(s,{from:0,to:2*T,amount:5});\n'
+'var iff = ifft(ff,{from:0,to:2*T,amount:5});\n'
+'\n'
+'section.plot([re(s),re(ff), absf(iff)], {\n'
+'   start:-5*T/2, \n'
+'   end:5*T/2, \n'
+'   step:0.1\n'
+'});\n';

var TestScript = Test1; ''
        +'var section = Section("First");\n'
        +'section.handle("k");\n'
                    +'function b (t){\n'
                    +'  return section.k * t*t;\n'
                    +'}\n'
                    +'\n'
                    +'function a (t){\n'
                    +'  return section.k*abs(sqrt(t));\n'
                    +'}\n'
                    +'var arr = array([1,0,1,0, 1,0,1], -2,2);'
                    +'var j = sqrt(-1);\n'
                    +'function s(t){\n'
                    +'    return mul( exp(mul(j,10,t)), 10);\n'
                    +'}\n'
                    +'function re(f){ return function(i){ return f(i).re; }};\n'
                    +'var ff = fft(s,{from:-1,to:1,amount:3});\n'
                    +'\n'
                    +'section.plot([re(s),re(ff)], {start:-1, end:1, step:0.01 });\n';






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
      javascript: TestScript,
      arrays: [{
        x:x, y:y, label:'sqr'
      }]
    }
  },

  render: function(){
    var javascript = this.state.javascript;   

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
