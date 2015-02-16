// copyright tmyymmt

// var URL = "http://192.168.1.10:8100/api/csc/";
var URL = "http://192.168.1.20:8080/api/getCSC";
var TIMES_PER_SEC = 2;
var INTERVAL = 1000 / TIMES_PER_SEC;

var running = true;

self.addEventListener("message", function(e) {
  running = e.data.running;
}, false);

var myCallback = function(data){
    self.postMessage({"value":data.value});
};

var run = setInterval(function() {
  if (running) {
    // json
    try {
      var xhr = new XMLHttpRequest({mozSystem: true});
      xhr.open("GET", URL, false);
      xhr.send(null);
      var obj = JSON.parse(xhr.responseText);
      self.postMessage({"value":obj.speed});
    }catch(e){
      console.log(e);
    }

    // static
    // self.postMessage({"value":10});
  } else {
    clearInterval(run);
  }
}, INTERVAL);
