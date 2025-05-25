const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');
const scoreElement = document.getElementById('score');
const gameOverScreen = document.getElementById('game-over-screen');
const finalScore = document.getElementById('final-score');

const audio = document.getElementById('backgroundMusic');
const playPauseBtn = document.getElementById('playPauseBtn');
const playPauseIcon = document.getElementById('playPauseIcon');

const startScreen = document.getElementById('start-screen');
const startBtn = document.getElementById('start-btn');
const personalBestElement = document.getElementById('personal-best');

let personalBest = localStorage.getItem('marioBest') || 0;
personalBestElement.textContent = 'Best Score: ' + personalBest;

function hideStartScreen() {
  startScreen.style.display = 'none';
  pipe.style.display = 'block';  

  setTimeout(() => {
    startLoop();
    startScore();
  }, 50);
}

function updatePipeSpeed(score) {
  const maxDuration = 1.5; 
  const minDuration = 0.5; 

  let newDuration = maxDuration - score / 1000;

  if (newDuration < minDuration) {
    newDuration = minDuration;
  }

  pipe.style.animationDuration = `${newDuration}s`;
}


startBtn.addEventListener('click', hideStartScreen);

document.addEventListener('keydown', function(event){
  if (startScreen.style.display !== 'none') {
    if (event.code == 'Space' || event.code == 'ArrowUp') {
      hideStartScreen();
    }
  }
});

let loop;
let scoreInterval;
let score = 0;
let isGameOver = false;
let isPlaying = false;

function updateIcon() {
  if (isPlaying) {
    playPauseIcon.classList.remove('fa-play');
    playPauseIcon.classList.add('fa-pause');
  } else {
    playPauseIcon.classList.remove('fa-pause');
    playPauseIcon.classList.add('fa-play');
  }
}

function playMusic() {
  audio.play().then(() => {
    isPlaying = true;
    updateIcon();  
  }).catch(err => {
    console.error('Erro ao tentar tocar a música:', err);
  });
}

function pauseMusic() {
  audio.pause();
  isPlaying = false;
  updateIcon();  
}

document.addEventListener('click', function autoPlayOnce() {
  if (!isPlaying) {
    playMusic();
  }
  document.removeEventListener('click', autoPlayOnce);
});

document.addEventListener('keydown', function autoPlayOnce() {
  if (!isPlaying) {
    playMusic();
  }
  document.removeEventListener('keydown', autoPlayOnce);
});

playPauseBtn.addEventListener('click', function() {
  if (isPlaying) {
    pauseMusic();
  } else {
    playMusic();
  }
});

const jump = () => {
   mario.classList.add('jump');

   setTimeout(() => {
      mario.classList.remove('jump');
   }, 500);
}

function startLoop() {
  loop = setInterval(() => {
    const pipePosition = pipe.offsetLeft;
    const marioPosition = +window.getComputedStyle(mario).bottom.replace('px', '');

    if(pipePosition <= 120 && pipePosition > 0 && marioPosition < 80) {

      pipe.style.animation = 'none';
      pipe.style.left = `${pipePosition}px`;

      mario.style.animation = 'none';
      mario.style.bottom = `${marioPosition}px`;

      mario.src = './images/game-over.png';
      mario.style.width = '75px';
      mario.style.marginLeft = '50px';

      clearInterval(loop);
      gameOver();
    }
  }, 10);
}

function startScore() {
  scoreInterval = setInterval(() => {
    if (!isGameOver) {
      score++;
      scoreElement.textContent = 'Score: ' + score;

      updatePipeSpeed(score);
    }
  }, 100);
}

// Evento para pular e reiniciar
document.addEventListener('keydown', function(event) {
  if (event.code === 'Space' || event.code === 'ArrowUp') {
    if (isGameOver) {
      console.log('Restart triggered');
      restartGame();
    } else {
      jump();
    }
  }
});

document.addEventListener('touchstart', function(event) {
  event.preventDefault(); 

  if (isGameOver) {
    restartGame();
  } else {
    jump();
  }
});

function gameOver() {
  isGameOver = true;
  clearInterval(scoreInterval);

  if (score > personalBest) {
    personalBest = score;
    localStorage.setItem('marioBest', personalBest);
  }

  finalScore.textContent = 'Final Score: ' + score;

  gameOverScreen.style.display = 'block';
}

function restartGame() {
   isGameOver = false;
   score = 0;
   scoreElement.textContent = 'Score: 0';

   mario.src = './images/mario.gif';
   mario.style.width = '150px';
   mario.style.marginLeft = '0';

   mario.style.bottom = '0px';
   mario.style.animation = '';
   pipe.style.animation = 'pipe-animation 1.5s infinite linear';
   pipe.style.left = '';

   updatePipeSpeed(score);

   gameOverScreen.style.display = 'none';

   startLoop();
   startScore();
}
