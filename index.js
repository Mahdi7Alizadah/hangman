const figure = document.querySelector('figure');
const resetbutton = document.querySelector('button');
const mainContent = document.querySelector('main');
const popup = document.querySelector('.popup');

let time = 60;
let countInterval;

let hangman = ['scaffold', 'head', 'body', 'arms', 'legs'];

let currentWord = [];
let currentGuessed = [];

let words = [
  'glad',
  'spel',
  'javascript',
  'programmering',
  'gubbe',
  'rapp',
  'undersköterska',
  'sjuksköterska'
];

function randomizeWord() {
  const index = Math.floor(Math.random() * words.length);
  currentWord = [...words[index]];
  words.splice(index, 1);
  drawLetterUnderLine();
}

function drawLetterUnderLine() {
  const boxes = document.querySelector('#boxes');
  amountBoxes = currentWord.length;

  for (let index = 0; index < amountBoxes; index++) {
    let box = document.createElement('div');
    box.setAttribute('data-word-index', index);
    boxes.append(box);
  }
}

function startCounter() {
  countInterval = setInterval(counter, 1000);
}

function counter() {
  time--;
  document.getElementById('counter').innerHTML = time;

  if (time === 0) {
    popupScreen(
      `Tiden gick ut! </br> Korrekt ord var: ${currentWord.join('')}`,
      'darkred'
    );
  }
}

function onKeyPress(e) {
  let letterPressed = e.key;
  letterPressed = letterPressed.toLowerCase();
  if (
    !currentGuessed.includes(letterPressed) &&
    /^[a-ö]+$/i.test(letterPressed)
  ) {
    currentGuessed.push(letterPressed);

    if (currentGuessed.length === 1) {
      startCounter();
    }

    drawLetter(letterPressed);

    if (currentWord.includes(letterPressed)) {
      currentWord.forEach((letter, index) => {
        if (letter === letterPressed) {
          document.querySelector(`[data-word-index='${index}']`).innerHTML =
            letter;
          let allCorrect = [];
          currentWord.forEach((char) => {
            const bool = currentGuessed.includes(char);
            allCorrect.push(bool);
          });

          if (!allCorrect.includes(false)) {
            popupScreen('Du vann!', 'darkgreen');
          }
        }
      });
    } else {
      const bodyPart = hangman.shift();
      figure.classList.add(bodyPart);

      if (hangman.length === 0) {
        popupScreen(
          `Du förlorade! </br> Korrekt ord var: ${currentWord.join('')}`,
          'darkred'
        );
      }
    }
  }
}

function drawLetter(guessedLetter) {
  const letters = document.querySelector('#letters');
  const letter = document.createElement('span');
  letter.innerHTML = guessedLetter;
  letters.append(letter);
}

function popupScreen(text, color) {
  document.getElementById('counter').innerHTML = '60';
  clearInterval(countInterval);
  window.removeEventListener('keypress', onKeyPress);
  popup.querySelector('h2').innerHTML = text;
  mainContent.classList.toggle('hide');
  popup.classList.toggle('hide');
  popup.style.background = color;
}

function resetGame() {
  hangman = ['scaffold', 'head', 'body', 'arms', 'legs'];
  figure.className = '';
  currentGuessed = [];
  currentWord = [];
  deleteElements('boxes', 'div');
  deleteElements('letters', 'span');
  randomizeWord();
}

function deleteElements(parent, child) {
  const elements = document.querySelectorAll(`#${parent} ${child}`);
  elements.forEach((element) => {
    element.remove();
  });
}

window.addEventListener('keypress', onKeyPress);

resetbutton.addEventListener('click', () => {
  resetGame();
  window.addEventListener('keypress', onKeyPress);
  mainContent.classList.toggle('hide');
  popup.classList.toggle('hide');
  time = 60;
});

randomizeWord();