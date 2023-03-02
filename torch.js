
// var fireImg = document.getElementById("fire-gif")
var canvas = document.getElementById("canvas")
var ctx = canvas.getContext("2d")
var pauseButton = document.getElementById("pause")
var torchButton = document.getElementById("torch")
var timeSlider = document.getElementById("timeSlider")
var endSound = document.getElementById("sound")
var timeSpan = document.getElementById("time")
var alpha = 1
var paused = true
var intervalId

var endTime = Date.now() + 60*60*1000
var fire = document.getElementById("torchImg")
var frame = 0

ctx.clearRect(0,0,800,500)


function setText() {
  // get real time.
  alpha = (endTime - Date.now())/(1000*60*60)

  let minutes = `${Math.floor(alpha*60)}`.padStart(2, '0')
  let seconds = `${Math.floor(alpha*60*60%60)}`.padStart(2, '0')
  timeSpan.innerText = `${paused ? "Game Paused ... ": ""}${minutes}:${seconds}`
}

pauseButton.onclick = function() {
  if (paused) {
    this.innerText = 'Pause';
    paused = false
    intervalId = setInterval(updateTorch, 1000/8)
    setText()
  } else {
    this.innerText = "Play"
    paused = true
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
  paused = true
  pauseButton.innerText = "Play"
  endTime = Date.now() + 60*1000*e.target.value
  setText()
}

function updateTorch() {
  
  setText()

  ctx.globalAlpha = 1
  ctx.fillRect(0,0,300,600)

  if (alpha < 0.25 && alpha > 0) {
    ctx.globalAlpha = 0.25
  } else {
    ctx.globalAlpha = alpha
  }
  // console.log(ctx.globalAlpha)
  if (paused != true) {
    if (alpha*60 > 0) {
      timeSlider.value = "" + alpha*60
    } else {
      timeSpan.innerText = "Darkness surrounds you. Death is near."
      ctx.globalAlpha = 0
      endSound.play()
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

