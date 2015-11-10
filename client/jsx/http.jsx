var HTTP = {
  json:function(url, data, fn){
    var xhr = new XMLHttpRequest();

    url += '?q=' + JSON.stringify(data)

    xhr.open('GET', url, true);
    xhr.onload = function(){
      if(xhr.status == 200)
        return fn(JSON.parse(xhr.responseText));
      fn({ error: xhr.responseText, status: xhr.status })
    }
    xhr.send();
  },

  http: function(method, url, data, fn){
    var xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.onload = function(){
      if(xhr.status == 200)
        return fn(JSON.parse(xhr.responseText));
      fn({ error: xhr.responseText, status: xhr.status })
    }
    xhr.setRequestHeader("Content-Type", 'application/json');
    var fd = new FormData();
    xhr.send(JSON.stringify(data));

  },

  put: function(url, data, fn){
    this.http('PUT', url, data, fn);
  },

  post: function(url, data, fn){
    this.http('POST', url, data, fn);
  },

  crud:{
    list(model, params, fn){
      HTTP.json("/api/"+model +'/',  params, fn);
    },

    remove:function(model, id, fn){
      HTTP.post('/crud/delete/' + model + '/' + id + '/', {}, fn);
    },

    save(model, params, fn){
      if( params._id )
        HTTP.put('/api/' + model + '/', params, fn);
      else
        HTTP.post("/api/" + model + "/", params, fn);
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
