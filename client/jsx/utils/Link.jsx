var React = require('react');

module.exports=  React.createClass({
  getInitialState(){
    return {};
  },
  componentDidMount(){
    this.router = require('../router.jsx');
  },
  nav(url){
    return (function(e){
      console.log("NAV", this.state);
      this.router.navigate(url);
    }).bind(this);
  },
  render(){
    return <a 
      className={this.props.cls }
      onClick={this.nav(this.props.to)}> {this.props.children }
      </a>
  }
})
