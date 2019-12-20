function select(element) {
  return document.querySelector(element);
}

function selectAll(element) {
  return document.querySelectorAll(element);
}

const minutes = select('#minutes');
const seconds = select('#seconds');
const cards = selectAll('.card i');
const starsnumber = selectAll('.stars li');
const displayMoves = select('.moves');
let timerCounter;
let minutesCounter = 0;
let secondsCounter = 0;
let numberOfEarnedStars = 3;
let lockBoard = false; 


let clicked = 0;
let numberOfMoves = 0;
let openedCards = [];
let isGameOver = false;
let matchedCards = 0;

// list to hold all the cards
const cardsList = [
  'fa-diamond',
  'fa-paper-plane-o',
  'fa-anchor',
  'fa-bolt',
  'fa-cube',
  'fa-leaf',
  'fa-bicycle',
  'fa-bomb',
  'fa-diamond',
  'fa-paper-plane-o',
  'fa-anchor',
  'fa-bolt',
  'fa-cube',
  'fa-leaf',
  'fa-bicycle',
  'fa-bomb'
];

// shuffle the list of cards 
shuffleCards();

const GameBoard = select('.container');


GameBoard.addEventListener('click', startGame());

function startGame() {
  return event => {
    if (lockBoard) return;

    DisplayCard(event);

    // Compare Cards
    compareCards();

    // Game over logic
    allCardsMatched();

    // Star rating
    calculateStars();

    restartGame(event);

    closeModal(event);
  };
}

    document.querySelector("#btn-play-again").addEventListener("click", startGame);
    document.querySelector("#btn-cancel").addEventListener("click", closeDialog);
    document.querySelector(".restart").addEventListener("click", startGame);


// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  let currentIndex = array.length;
  let temporaryValue;
  let randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

// Shuffle cards
function shuffleCards() {
  const shuffledCards = shuffle(cardsList);
  cards.forEach((card, position) => {
    if (cards [position].classList.length > 1) {
      card.classList = 'fa';
    }
    card.classList.add(shuffledCards[position]);
  }, shuffledCards);
}

// Display and then store clicked cards
function DisplayCard(event) {
  const cardClicked = event.target;
  if (cardClicked.className === 'card') {
    startTimer();

    cardClicked.classList.add('open', 'show');
    if (
      !openedCards.includes(cardClicked) &&
      !cardClicked.classList.contains('match')
    ) {
      openedCards.push(cardClicked);
    }
    clicked++;
    numberOfMoves = clicked / 2;
    displayMoves.innerHTML = Math.floor(numberOfMoves);
  }
}

// start time counter
function startTimer() {
  if (!timerCounter) {
    timerCounter = setInterval(timer, 1000);
  }
}

// compare cards to check if its matched or not
function compareCards() {
  if (openedCards.length === 2) {
    const cardsMatches =
      openedCards[0].firstElementChild.classList[1] ===
      openedCards[1].firstElementChild.classList[1];
    cardsMatches ? matchedCard(): notMatchedCards();
  }

  function matchedCard() {
    openedCards[0].classList.add('match');
    openedCards[1].classList.add('match');
    matchedCards++;
    openedCards = [];
  }

  function notMatchedCards() {
    lockBoard = true;
    setTimeout(() => {
      openedCards[0].classList.remove('open', 'show', 'nomatch');
      openedCards[1].classList.remove('open', 'show', 'nomatch');
      openedCards = [];
      lockBoard = false;
    }, 1000);
    openedCards[0].classList.add('nomatch');
    openedCards[1].classList.add('nomatch');
  }
}

// Game completion function
/*
 *TODO: Consider using this condition:
 * const appendedCards = selectAll('.card');
 * const appendedCardsArray = Array.from(appendedCards);
 * (appendedCardsArray.every(card => card.className === 'card open show match'))
 */
function allCardsMatched() {
  const winConditionMet = matchedCards === 8;
  if (winConditionMet) {
    endGame();
  }

  function endGame() {
    const modalBody = select('.modal-container');
    const modalStars = select('#stars-deserved');
    const modalMoves = select('#moves-made');
    const modalTime = select('#time-taken');
    setTimeout(() => {
      modalBody.style.display = 'flex';
      modalStars.innerHTML = ` ${numberOfEarnedStars}`;
      modalMoves.innerHTML = ` ${numberOfMoves}`;
      modalTime.innerHTML = ` ${minutesCounter} min(s) ${secondsCounter} secs`;
    }, 500);
    clearInterval(timerCounter);
    isGameOver = true;
    matchedCards = 0;
  }
}

// Calculate and display stars earned
function calculateStars() {
  if (numberOfMoves < 18) {
    const threeStars = starsnumber[3];
    starsDeserved(threeStars);
    numberOfEarnedStars = 3;
  }
 else if (numberOfMoves < 25 ) {
    const twoStars = starsnumber[2];
    starsDeserved(twoStars);
    numberOfEarnedStars = 2;
  }
    else {
       const oneStar = starsnumber[1];
    starsDeserved(oneStar);
    numberOfEarnedStars = 1; 
    }

  function starsDeserved(starlevel) {
    starlevel.firstElementChild.style = 'visibility:hidden';
  }
}

// Timer
function timer() {
  if (secondsCounter < 60) {
    secondsCounter++;
  }
  if (secondsCounter === 60) {
    secondsCounter = 0;
    minutesCounter++;
  }
  if (secondsCounter < 10) {
    seconds.innerHTML = `0${secondsCounter}`;
  } else {
    seconds.innerHTML = secondsCounter;
  }
  minutes.innerHTML = minutesCounter;
}

// Game Over Modal
function restartGame(event) {
  const replayButton = event.target;
  const replayButtonOne = replayButton.className === 'fa fa-repeat';
  const replayButtonTwo = replayButton.className === 'modal-replay-btn';
  if (replayButtonOne || replayButtonTwo) {
    resetGame();
  }
}

function closeModal(event) {
  const closeButton = event.target;
  if (closeButton.className === 'modal-close-btn') {
    dismissModal();
  }
}

function dismissModal() {
  select('.modal-container').style.display = 'none';
}

// Reset/Restart Game
function resetGame() {
  if (isGameOver) {
    dismissModal();
  }
  resetCards();
 shuffleCards();
  resetStars();
  resetTime();
  resetMoves();
  isGameOver = false;
  matchedCards = 0;
}

function resetMoves() {
  clicked = 0;
  numberOfMoves = 0;
 displayMoves.innerHTML = ` ${moves}`;
}

function resetTime() {
  clearInterval(timerCounter);
  secondsCounter = 0;
  minutesCounter = 0;
  seconds.innerHTML = `0${secondsCounter}`;
  minutes.innerHTML = minutesCounter;
  isTimeStarted = false;
}

function resetStars() {
  numberOfEarnedStars = 3;
  starsnumber.forEach(star => {
    star.firstElementChild.style.visibility = 'initial';
  });
}

function resetCards() {
  lockBoard = false;
  openedCards = [];
  cards.forEach(card => {
    card.parentElement.classList = 'card';
  });
}
