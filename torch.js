
var canvas = document.getElementById("canvas")
var ctx = canvas.getContext("2d")
var pauseButton = document.getElementById("pause")
var resetTorchButton = document.getElementById("torch")
var timeSlider = document.getElementById("timeSlider")
var endSound = document.getElementById("sound")
var timeSpan = document.getElementById("time")
var extinguishedOverlay = document.getElementById('torch-extinguished-overlay')
var lightAnotherTorchButton = document.getElementById('light-torch');
var alpha = 1
var paused = true
var intervalId

var torchDuration; // unit: milliseconds
var timeRemaining = 0; // unit: milliseconds

var fire = document.getElementById("torchImg")
var frame = 0
var hasTorch = false


ctx.clearRect(0,0,800,500)

function setTorchDurationMinutes(mins) {
  torchDuration = mins * 60 * 1000;
  timeSlider.max = mins;
  timeRemaining = Math.min(timeRemaining, torchDuration)
}

function lightTorch(overrideDuration) {
  hasTorch = true;
  if (overrideDuration === undefined) {
    timeRemaining = timeRemaining > 0 ? timeRemaining : torchDuration;
  } else {
    timeRemaining = overrideDuration;
  }
  endSound.pause()
  setText();
  setIsRunning(true);
  extinguishedOverlay.classList.add('hidden');
}

function onTorchBurnedOut() {
  hasTorch = false;
  setIsRunning(false);
  showExtinguishedOverlay();
  endSound.currentTime = 0;
  endSound.play()
}

function showExtinguishedOverlay() {
  extinguishedOverlay.classList.remove('hidden');
  let firstTimeMessage = extinguishedOverlay.querySelector('.message-first-time');
  let extinguishedMessage = extinguishedOverlay.querySelector('.message-extinguished');
  firstTimeMessage.classList.add('hidden');
  extinguishedMessage.classList.remove('hidden')
}


function setText() {
  let remainingSec = Math.max(0, timeRemaining / 1000);
  let minutes = `${Math.floor(remainingSec / 60)}`.padStart(2, '0')
  let seconds = `${Math.floor(remainingSec % 60)}`.padStart(2, '0')
  timeSpan.innerText = `${hasTorch && paused ? "Game Paused ... ": ""}${minutes}:${seconds}`
}

function setIsRunning(isRunning) {
  if (isRunning) {
    pauseButton.innerText = 'Pause';
    paused = false
    if (!intervalId) {
      lastUpdateTime = Date.now();
      intervalId = setInterval(updateTorch, 1000/8)
    }
    setText()
  } else {
    pauseButton.innerText = "Play"
    paused = true
    endSound.pause();
    setText()
    clearInterval(intervalId);
    intervalId = undefined;
  }
}

pauseButton.onclick = function() {
  if (!hasTorch) {
    lightTorch();
  } else {
    setIsRunning(paused);
  }
};

canvas.onclick = function() {
  if (hasTorch) {
    setIsRunning(paused);
  }
}

lightAnotherTorchButton.onclick = function () {
  // this will use the current slider value, or reset it if empty
  lightTorch();
}

resetTorchButton.onclick = function () {
  // always reset torch to the full duration
  lightTorch(torchDuration);
}

timeSlider.oninput = function(e) {
  setIsRunning(false);
  timeRemaining = Math.max(5, Math.floor(e.target.value * 60)) * 1000;
  setText();
}

var lastUpdateTime = undefined;
function updateTorch() {
  setText()

  alpha = (timeRemaining)/(1000*60*60)
  ctx.globalAlpha = 1
  ctx.fillRect(0,0,300,600)

  if (alpha < 0.25 && alpha > 0) {
    ctx.globalAlpha = 0.25
  } else {
    ctx.globalAlpha = alpha
  }
  // console.log(ctx.globalAlpha)
  if (!paused) {
    timeRemaining -= (Date.now() - lastUpdateTime);
    lastUpdateTime = Date.now();

    if (timeRemaining > 0) {
      if (timeSlider != document.activeElement) {
        timeSlider.value = "" + alpha*60
      }
    } else {
      if (hasTorch) {
        onTorchBurnedOut()
      }
      ctx.globalAlpha = 0
    }
  }

  // Drawing Shenanigans
  frame = Math.floor(Math.random()*14)
  ctx.fillRect(0,0,300,600)
  ctx.drawImage(fire, 759*frame,0,759,1650,0,0,300,600)
  ctx.globalAlpha -= 0.5
  frame = Math.floor(Math.random()*14)
  ctx.drawImage(fire, 759*frame,0,759,1650,0,0,300,600)
  ctx.globalAlpha -= 0.25
  frame = Math.floor(Math.random()*14)
  ctx.drawImage(fire, 759*frame,0,759,1650,0,0,300,600)
}

// TODO: there could be a config option to set the duration, and this could be stored 
// in localStorage
setTorchDurationMinutes(60);
timeRemaining = torchDuration;
