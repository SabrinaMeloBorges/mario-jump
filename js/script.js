const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');
const scoreElement = document.getElementById('score');
const gameOverScreen = document.getElementById('game-over-screen');
const finalScore = document.getElementById('final-score');

let loop;
let scoreInterval;
let score = 0;
let isGameOver = false;

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
    }
  }, 100);
}

document.addEventListener('keydown', function(event) {
  if (event.code === 'Space' || event.code === 'ArrowUp') {
    if (isGameOver) {
      restartGame();
    } else {
      jump();
    }
  }
});

// Adicionando suporte ao toque na tela
document.addEventListener('touchstart', function(event) {
  event.preventDefault(); // previne scroll, zoom, etc

  if (isGameOver) {
    restartGame();
  } else {
    jump();
  }
});

function gameOver() {
  isGameOver = true;
  clearInterval(scoreInterval);

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

   gameOverScreen.style.display = 'none';

   startLoop();
   startScore();
}

// Inicializa o jogo
startLoop();
startScore();
