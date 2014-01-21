// Document ready

$(function() {
  currentPage = "package.html";
  //all links handled here
  $('body').on("click",".custom-link",function(e) {
    e.preventDefault();
    // Use Pace for a loading indicator
    Pace.start();
    var that = e.currentTarget;
    var href = $(that).attr("href");
    $(".page").load(href,function(){
      Pace.stop();
    });
    
    return false;
  });
})

// Define shake detecting JS

var shake = (function () {
  var shake = {},
  watchId = null,
  options = { "minimumGap": "300" },
  previousAcceleration = { x: null, y: null, z: null },
  shakeCallBack = null;

  // Start watching the accelerometer for a shake gesture
  shake.startWatch = function (onShake) {
    if (onShake) {
      shakeCallBack = onShake;
    }
    watchId = Rho.Sensor.makeSensorByType(Rho.Sensor.SENSOR_TYPE_ACCELEROMETER);
    if (watchId !== null) {
      watchId.setProperties(options);
      console.log('starting detection');

      watchId.start(assessCurrentAcceleration);
    }
    else
    {
      handleError();
    }
  };

    // Stop watching the accelerometer for a shake gesture
    shake.stopWatch = function () {
      if (watchId !== null) {
        console.log('stopping detection');
        
        watchId.stop();
        watchId = null;
      }
    };

  // Assess the current acceleration parameters to determine a shake
  function assessCurrentAcceleration(acceleration) {
    var accelerationChange = {};
    if (previousAcceleration.x !== null) {
      accelerationChange.x = Math.abs(previousAcceleration.x, acceleration.accelerometer_x);
      accelerationChange.y = Math.abs(previousAcceleration.y, acceleration.accelerometer_y);
      accelerationChange.z = Math.abs(previousAcceleration.z, acceleration.accelerometer_z);
    }
    // console.log('movement detected:' + (accelerationChange.x + accelerationChange.y + accelerationChange.z).toString());
    if (accelerationChange.x + accelerationChange.y + accelerationChange.z > 30) {
      // Shake detected
      console.log('shake detected');

      if (typeof (shakeCallBack) === "function") {
        shakeCallBack();
      }
      shake.stopWatch();
      setTimeout(shake.startWatch, 1000);
      previousAcceleration = { 
        x: null, 
        y: null, 
        z: null
      }
    } else {
      previousAcceleration = {
        x: acceleration.accelerometer_x,
        y: acceleration.accelerometer_y,
        z: acceleration.accelerometer_z
      }
    }
  }

  // Handle errors here
  function handleError() {
  }

  return shake;
})();

// Define Functions that work with shake detection

function start(){
  shake.startWatch(myShakeCallback);
}

function stop(){
  shake.stopWatch();
}

myShakeCallback = function() {
  // Use Pace to add a loading indicator
  Pace.start();
  if(currentPage == "package.html")
    currentPage = "sign.html";
  else{
    currentPage = "package.html";
    // Capture Signature
  }
  $(".page").load(currentPage, function(){Pace.stop();});
};