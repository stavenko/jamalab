var crud = require('node-crud');
var models = require('../models.js');


var Script = models.script;
module.exports.init = function(app, server){

  crud.entity('/scripts/').Read()
  .use(function(req,res,next){
    console.log("MIDDLE");
    next();
  })

  .pipe(function(data, query, cb){
    console.log(query);
    var q = JSON.parse(query.q || '{}');
    Script.find(q, cb)
  });

  crud.entity('/scripts/')
  .Update()
  .pipe(function(data, q, cb){
    console.log(data, q);
    Script.update({_id:data._id}, data, cb);
    // var s = Script(data);
    // s.save(cb);
  }) ;

  crud.entity('/scripts/')
  .Create()
  .pipe(function(data, q, cb){
    var s = Script(data);
    s.save(cb);
  })
  ;

  crud.launch(app);

}
