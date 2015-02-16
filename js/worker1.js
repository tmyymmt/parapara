// copyright tmyymmt

var TIMES_PER_SEC = 10;
var INTERVAL = 1000 / TIMES_PER_SEC;

var running = true;
var counter = 0;
var counterMax = TIMES_PER_SEC;
var speed = 0;
var speedMax = 0;

self.addEventListener("message", function(e) {
  running = e.data.running;
  speed = e.data.speed;
  speedMax = e.data.speedMax;
//  counter = 0;
  counterMax = Math.floor((1 - (speed / speedMax)) * TIMES_PER_SEC); 
}, false);

var run = setInterval(function() {
  if (running) {
    if (speed != 0 && counter == counterMax) {
      self.postMessage("");
    }
    counter++;
    if (counterMax < counter) {
      counter = 0;
    }
  } else {
    clearInterval(run);
  }
}, INTERVAL);
