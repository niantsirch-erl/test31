function RectCollisions({ rectangle1, rectangle2 }) {
    return (
      rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
        rectangle2.position.x &&
      rectangle1.attackBox.position.x <=
        rectangle2.position.x + rectangle2.width &&
      rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
        rectangle2.position.y &&
      rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    )
}

var victorySound = document.getElementById('victorySound');
var bgmSound = document.getElementById('bgmSound');
var tieSound = document.getElementById('tieSound')

bgmSound.volume = 0.50;
bgmSound.play();

function playTieSound(){
    tieSound.play();
}
function playVictory() {
    victorySound.play();
}

function pauseBgm(){
    bgmSound.pause()
}
  
function determineWinner({ player, enemy, timerId }) {
  clearTimeout(timerId)
  document.querySelector('#displayText').style.display = 'flex'
  if (player.health === enemy.health) {
    document.querySelector('#displayText').innerHTML = 'Tie'
    playTieSound()
    pauseBgm()
  } else if (player.health > enemy.health) {
    document.querySelector('#displayText').innerHTML = 'Player 1 Wins'
    playVictory()
    pauseBgm()
  } else if (player.health < enemy.health) {
    document.querySelector('#displayText').innerHTML = 'Player 2 Wins'
    playVictory()
    pauseBgm()
  }

    document.querySelector('#restartButton').innerHTML = 'Restart';
    document.querySelector('#restartButton').style.display = 'flex';

    document.querySelector('#restartButton').addEventListener('click', function(){
        location.reload()
    })
}

let timer = 60
let timerId
function decreaseTimer() {
  if (timer > 0) {
    timerId = setTimeout(decreaseTimer, 1000)
    timer--
    document.querySelector('#timer').innerHTML = timer
  }

  if (timer === 0) {
    determineWinner({ player, enemy: player2, timerId })
  }
}