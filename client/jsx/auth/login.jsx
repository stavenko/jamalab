var React = require('react');
var ReactRouter = require('react-router');
var t = require('tcomb-form');

var Link = ReactRouter.Link;



module.exports = React.createClass({
  render(){
    return <div> 
      Auth form 
      <Link to='register' 
        className='btn'
        > Register </Link>
    </div>
  }

})

