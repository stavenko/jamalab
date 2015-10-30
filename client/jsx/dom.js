
module.exports.emit = emit;
module.exports.bindEvents = bindEvents;
module.exports.unbindEvents = unbindEvents;

function toCamelCase(str){
  return str
  .replace(/-(.)/g, function($1) { return $1.toUpperCase(); })
  .replace(/-/g, '')
  .replace(/^(.)/, function($1) { return $1.toLowerCase(); });
}

function bindEvents(inst) {
  var events =[];
  events = events.concat(inst.events);
  events = events.concat(inst.baseEvents || []);
  events.forEach(function(e){
    document.addEventListener(e, inst[toCamelCase(e)]);
  });

}
function unbindEvents(inst) {
  var events = [];
  events = events.concat(inst.events);
  events = events.concat(inst.baseEvents);
  inst.events.forEach(function(e){
    document.removeEventListener(e, inst[toCamelCase(e)]);
  });
}

function emit(evt, data){
  var event;
  if(data!=undefined) event = new CustomEvent(evt, {detail:data} );
  else event = new Event(evt);
  document.dispatchEvent(event);
}
