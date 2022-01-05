/*
Event Handling and Game Play

- Bind a keypress event to the document that will check the guessed letter against the word
  - Only process key presses that are letters. In other words, from a-z
  - add the letter to the array of guessed letters
  - if guess matches at least one letter, output each instance of the guessed letter in the respectie blank spaces
  - if guess is not a match, increment the incorrect guess count and change the class name on the apples container to change the count of apples
  - if the letter has already been guessed, ignore it.

- when a letter is guessed, write it to the guesses container
- if the number of incorrect guesses matches the number of guesses available for a game (6 in this case), the game is over. Display a message and a link to start a new game. Unbind the keypress event
- When the "Play another button is clicked, a new game is constructed." The class on the apples container gets reset to show 6 apples again.
  - guess_1 for 1 incorrect guess, guess_2 for 2, etc.

*/
// the words are: 'apple', 'banana', 'orange' and 'pear'

function createRandomWordFunc() {
  let words = ['apple', 'banana', 'orange', 'pear'];

  return function() {
    let numAvailableWords = words.length;
    if (numAvailableWords === 0) return undefined;

    let randomIndex = Math.floor(Math.random() * numAvailableWords);
    return words.splice(randomIndex, 1)[0];
  }
}

let randomWord = createRandomWordFunc();

function Game() {
  this.word = randomWord();
  this.allowedWrongGuesses = 6;
  this.incorrectGuesses = 0;
  this.lettersGuessed = [];

  if (this.word !== undefined) {
    this.initializeBlanks(this.word);
  } else {
    this.displayMessage("Sorry, I've run out of words");
  }
}

Game.prototype.displayMessage = function(text) {
  let message = document.getElementById('message');
  message.textContent = text;
}

Game.prototype.incorrectGuess = function() {
  let apples = document.getElementById('apples');
  this.incorrectGuesses += 1;
  apples.className = `guess_${this.incorrectGuesses}`;
}

Game.prototype.guess = function(letter) {
  let letterAlreadyGuessed = this.lettersGuessed.includes(letter);
  let letterInWord = this.word.split('').includes(letter);

  if (letterAlreadyGuessed) return;

  if (letterInWord) {
    this.correctGuess(letter);
  } else {
    this.incorrectGuess();
  }

  this.addGuessedLetter(letter);
}

Game.prototype.addGuessedLetter = function(letter) {
  let guessesDiv = document.getElementById('guesses');
  let guess = document.createElement('span');
  guess.textContent = letter;
  guessesDiv.appendChild(guess);

  this.lettersGuessed.push(letter);
}

Game.prototype.correctGuess = function(letter) {
  this.word.split('').forEach((wordLetter, index) => {
    if (wordLetter === letter) {
      document.getElementById(`${index}`).textContent = letter;
    }
  });
}

Game.prototype.gameOver = function() {
  let won = this.word.split('').every(letter => {
    return this.lettersGuessed.includes(letter);
  });

  let lost = this.allowedWrongGuesses === this.incorrectGuesses;
  return won || lost;

}

Game.prototype.initializeBlanks = function(word) {
  let spacesDiv = document.getElementById('spaces');
  deleteOldSpans(spacesDiv);

  let numberOfBlanks = word.length;

  for (let i = 0; i < numberOfBlanks; i += 1) {
    let space = document.createElement('span');
    space.id = i;
    spacesDiv.appendChild(space);
  }
}

function deleteOldSpans(div) {
  div.querySelectorAll('span').forEach((span) => span.remove());
}

function createNewGame() {
  game = new Game();
  document.getElementById('apples').className = "";
  deleteOldSpans(document.getElementById('guesses'));
}

let game;

document.addEventListener('DOMContentLoaded', () => {
  game = new Game();
  document.addEventListener('keydown', (e) => {
    if (game.gameOver()) return;
    if (game.word && /^[a-z]$/.test(e.key)) {
      game.guess(e.key);
    }
  });

  let replay = document.getElementById('replay');
  replay.addEventListener('click', (e) => {
    e.preventDefault();
    createNewGame();
  })
})
