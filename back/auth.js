var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var models = require('../models.js');

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, function(username, password,done){
  models.user.findOne({ email : username},function(err,user){
    if(err) return done(err);
    if(!user) return done(null, false, 'Wrong username')
    if(user.password !== password) return done(null, false, 'Wrong password')
    done(null, user)
  });
}));


passport.serializeUser(function(user,done){
  done(null, user.id);
})

passport.deserializeUser(function(id, done){
  models.user.findById(id, function(err, user){
    if(err) return done(err);
    return done(null, user);
  })
})

module.exports.init = function(app, server){  
  app.use(passport.initialize());
  app.use(passport.session());

  app.post("/auth/register/", 
           function(req, res){
             var u = models.user(req.body);
             u.save(function(err, u){
               if(err) res.send(JSON.stringify({error: err}));
               res.send(JSON.stringify(u));
             })
           })

  app.get("/auth/is-logged-in/", 
           function(req, res){
             if(req.user)
               return res.send(JSON.stringify(req.user));
             return res.send(JSON.stringify({}));
           });

  app.post("/auth/login/", 
           function(req, res, next){
             passport.authenticate('local', function(err, user, info) {
               if(err) return next(err);
               if(user)
                 req.logIn(user, function(err){
                   if(err) return next(err);
                   res.send(JSON.stringify( {login:'ok'} ));
                 });
               else res.status(200).json({ error: info });
             })(req, res, next)
           });
}

