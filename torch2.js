
var pauseButton = document.getElementById("pause")
var torchButton = document.getElementById("torch")
var timeSlider = document.getElementById("timeSlider")
var endSound = document.getElementById("sound")
var timeSpan = document.getElementById("time")
var alpha = 1
var paused = true
var intervalId

var endTime = Date.now() + 60*60*1000
var pauseTime = Date.now()
var fire = document.getElementById("torchImg")

function setText() {
  // get real time.
  alpha = (endTime - Date.now())/(1000*60*60)
  timeSpan.innerText = `${paused ? "Paused": ""}`
}

pauseButton.onclick = function() {
  if (paused) {
    this.innerText = 'Pause';
    paused = false
    endTime += Date.now() - pauseTime
    intervalId = setInterval(updateTorch, 1000/8)
    setText()
  } else {
    this.innerText = "Play"
    paused = true
    pauseTime = Date.now()
    setText()
    clearInterval(intervalId)
  }
}

torchButton.onclick = function() {
  endTime = Date.now() + 1000*60*60
  endSound.pause()
  setText()
}

timeSlider.onchange = function(e) {
  clearInterval(intervalId)
  endSound.pause()
  endTime = Date.now() + 60*1000*e.target.value
  setText()
  intervalId = setInterval(updateTorch, 1000/8)
}

function updateTorch() {
  
  setText()

  if (alpha < 0.1 && alpha > 0) {
    fire.style.opacity = "0.1"
  } else {
    fire.style.opacity = "" + alpha
  }
  // console.log(ctx.globalAlpha)
  if (paused != true) {
    if (alpha*60 > 0) {
      if (timeSlider != document.activeElement) {
        timeSlider.value = "" + alpha*60
      }
    } else {
      timeSpan.innerText = "Darkness surrounds you. Death is near."
      fire.alpha = "0"
      endSound.play()
    }
  }
}

