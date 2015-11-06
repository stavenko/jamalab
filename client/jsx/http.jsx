var HTTP = {
  json:function(url, data, fn){
    var xhr = new XMLHttpRequest();
    var params = [];
    for(var k in data) {
      params.push(k + '=' + JSON.stringify(data[k]));
    }

    if(params.length) url += '?' +params.join('&');

    xhr.open('GET', url, true);
    xhr.onload = function(){
      if(xhr.status == 200)
        return fn(JSON.parse(xhr.responseText));
      fn({ error: xhr.responseText })
    }
    xhr.send();
  },

  post: function(url, data, fn){
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.onload = function(){
      fn(JSON.parse(xhr.responseText));
    }
    xhr.setRequestHeader("Content-Type", 'application/json');
    var fd = new FormData();
    for(var k in data){
      fd.append(k, data[k]);
    }
    xhr.send(JSON.stringify(data));

  },

  crud:{
    list(model, params, fn){
      HTTP.json("/crud/read/"+model +'/',  params, fn);
    },

    remove:function(model, id, fn){
      HTTP.post('/crud/delete/' + model + '/' + id + '/', {}, fn);
    },

    save(model, params, fn){
      if( params._id )
        HTTP.post('/crud/update/' + model + '/' + params._id + '/', params, fn);
      else
        HTTP.post("/crud/create/" + model + "/", params, fn);
    }
  },

  auth:{
    register:function(user, fn){
      HTTP.post("/auth/register/", user, fn);
    },
    login: function(user, fn){
      HTTP.post("/auth/login/", user, fn);
    },
    logout: function(fn){
      HTTP.post('/auth/logout/', {}, fn || function(){});
    },
    ask:{
      isLoggedIn: function(fn){
        HTTP.json('/auth/is-logged-in', {}, fn);       
      }
    }
  }
}

module.exports = HTTP;
