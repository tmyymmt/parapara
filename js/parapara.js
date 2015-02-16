// copyright tmyymmt

var NUMBER_MIN = 0;
var NUMBER_MAX = 224;

var SPEED_MIN = 0;
var SPEED_MAX = 100;
var SPEED_UNIT = 10;
var number = 0;
var speed = 0;
var sensor = true;

var worker1 = new Worker("/js/worker1.js");
var worker2 = new Worker("/js/worker2.js");

updateImage();
updateSpeed();

document.form.setImage.addEventListener("click", setImage);
document.form.previousImage.addEventListener("click", previousImage);
document.form.nextImage.addEventListener("click", nextImage);

document.form.setSpeed.addEventListener("click", setSpeed);
document.form.minusSpeed.addEventListener("click", minusSpeed);
document.form.plusSpeed.addEventListener("click", plusSpeed);

document.getElementById("sensor").addEventListener("change", changeSensor);
document.getElementById("sensor").checked = true;

worker1.addEventListener("message", function(e){
  nextImage();
});
worker1.postMessage({"running": true, "speed": speed, "speedMax": SPEED_MAX});

worker2.addEventListener("message", function(e){
  if (sensor) {
    speed = e.data.value;
    updateSpeed();
  }
});
worker2.postMessage({"running": true});

function setImage() {
  number = document.form.number.value;
  updateImage();
}

function previousImage() {
  number--;
  if (number < NUMBER_MIN) {
    number = NUMBER_MAX;
  }
  updateImage();
}

function nextImage() {
  number++;
  if (NUMBER_MAX < number) {
    number = NUMBER_MIN;
  }
  updateImage();
}

function updateImage() {
  document.form.number.value = number;
  document.getElementById("img").src = "/img/sv/" + number + ".jpg";  
}

function setSpeed() {
  speed = document.form.speed.value;
  updateSpeed();
}

function minusSpeed() {
  speed -= 10;
  if (speed < SPEED_MIN) {
    speed = SPEED_MIN;
  }
  updateSpeed();
}

function plusSpeed() {
  speed += 10;
  if (SPEED_MAX < speed) {
    speed = SPEED_MAX;
  }
  updateSpeed();
}

function updateSpeed() {
  document.form.speed.value = speed;
  worker1.postMessage({"running": true, "speed": speed, "speedMax": SPEED_MAX});
}

function changeSensor() {
  sensor = document.form.sensor.checked;
}
