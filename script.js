// var words = require('./words.json');
// module.exports = words.words;
// words.words.lengths = words.lengths;

let wordCollection = [];

let gameState = {
    solutionWord: "",
    workingWord: "",
    lettersUsed: [],
    gallowsState: 0,
    gallowsImage: null,
    checkWinningState: function() {
        return (this.solutionWord != "" && this.workingWord === this.solutionWord)
    },
    checkLosingState: function() {
        return (this.gallowsState >= 9);
    },
    increaseGallowsState: function() {
        this.gallowsState++;
        this.gallowsImage.src = "assets/gallows-" + this.gallowsState + '.png';
    },
    timeMultiplier: function() {
        let elapsedTime = parseFloat(gameState.endDate - gameState.startDate);
        if (elapsedTime > 119000) {
            return 1;
        } else {
            let milliseconds = Math.round(elapsedTime);
            return (120000 - milliseconds);
        }
    },
    levelScore: function(){
        return 9 - this.gallowsState;
    },
    totalScore: function() {
        let tm = this.timeMultiplier();
        let ls = this.levelScore();
        let ts = tm * ls;
        return ts;
    },
    gallowsLevel: ["None","Head","Neck","Arm 1", "Arm 2", "Torso", "Leg 1", "Leg 2", "Foot 1", "Foot 2"],
    gameEnded: false,
    anyKey: false,
    startDate: null,
    endDate: null,
};

const workSpace = document.getElementById("wordBlank");
const startButton = document.getElementById("startButton");
const lettersUsedPara = document.getElementById("lettersused");
const wordLengthCombo = document.getElementById("wordLengthSelection");
const wordLengthLabel = document.getElementById("wordLengthLabel");
const instructionsHeader = document.getElementById("instructions");
const conditionsHeader = document.getElementById("condition");
const gameScore = document.getElementById("gamescore");
async function setup() {
    //get the word list and jsonify it
    wordCollection = await fetch("./wordlist.json");
    wordCollection = await wordCollection.json();
    gameState.gallowsImage = document.getElementById("gallowspicture");
    //add event listeners
    startButton.addEventListener('click', (e) => startButton_click(e));
    document.body.addEventListener('keypress', (e) => body_keypress(e));
    //words = null;
}

async function main() {
    
    await setup();
    //is this even necessary?
    
    
}

main()

function removeLetters(word) {
    const rx = /[a-z]/ig;
    let myReturn = word.replace(rx, "_");
    return myReturn;
}

function startButton_click(e) {
    const wordLength = wordLengthCombo.value;
    const numberOfWords = wordCollection[wordLength].length;
    let indexOfWord = Math.floor(Math.random() * numberOfWords);
    gameState.solutionWord = wordCollection[wordLength][indexOfWord].toUpperCase();
    gameState.workingWord = removeLetters(gameState.solutionWord);
    gameState.lettersUsed = [];
    lettersUsedPara.innerHTML = "&nbsp;";
    workSpace.textContent = gameState.workingWord;
    wordLengthCombo.hidden = true;
    wordLengthLabel.hidden = true;
    startButton.hidden = true;
    instructionsHeader.textContent = "Press any letter on your keyboard!";
    gameState.gameEnded = false;
    gameState.startDate = new Date().getTime();
}

function body_keypress(e) {
    //e.key will give you the key actually pressed
    const keyPressed = e.key.toUpperCase();

    //This is to correct a bug until I get a better handle on it
    if(keyPressed === "ENTER" && gameState.gameEnded === true && !gameState.anyKey) return null

    //if the game has ended, restart the game and exit
    if(gameState.gameEnded) {
        restartGame();
        gameState.anyKey = false;
        return null;
    }
    let charCode = keyPressed.charCodeAt(0);
    
    //if the key isn't a letter, stop processing.
    //'enter' is a special case, because for some reason, JavaScript makes the <enter> key the string "enter,"
    //not char(13) like it does in every other programming language.
    //Bug or feature?  You decide.
    if(charCode < 65 || charCode > 90 || keyPressed === "ENTER") {return null}
    //if the letter has been pressed before, stop processing
    if(isInArray(keyPressed, gameState.lettersUsed)) {
        return null;
    }
    gameState.lettersUsed.push(keyPressed);
    gameState.lettersUsed.sort();
    
    //display letters used on the page so the player gets hints of what isn't in the word
    lettersUsedPara.textContent = gameState.lettersUsed.join(", ");
    
    //check letter checks to see if a letter (in this case, keyPressed) is in a word (in this case, gs.solutionWord)
    //checkLetter returns an array with the 0-based indices of where in the word the particular letter was found.
    //for example, checkLetter('a','attack') will return [0,3] because 'a' is in the first and the fourth positions.
    let letterPositions = checkLetter(keyPressed, gameState.solutionWord);
    
    //if nothing came back from the checkLetter(a,b) function, the letter wasn't in the
    //solution.  Advance the gallows one step, check to see if we've lost the game
    if(letterPositions.length === 0) {
        gameState.increaseGallowsState();
        let loss = gameState.checkLosingState();
        if(loss){
            conditionsHeader.textContent = "YOU'VE LOST!";
            instructionsHeader.textContent = "Press any key to continue";
            workSpace.textContent = gameState.solutionWord;
            gameState.gameEnded = true;
            gameState.anyKey = true;
            return null;
        }
    }

    //the working word is what the player has figured out so far, so we need to record that:
    letterPositions.forEach((index) => {
        gameState.workingWord = replaceAt(gameState.workingWord, index, keyPressed);
    })

    //check for the winning condition
    if(gameState.checkWinningState()) {
        gameState.endDate = new Date().getTime();
        conditionsHeader.textContent = "YOU'VE WON!";
        instructionsHeader.textContent = "Press any key to continue";
        gameState.gameEnded = true;
        gameState.anyKey = true;
        gameScore.textContent = `Score: ${gameState.totalScore().toLocaleString()}`;
    }
    
    //put what the player has achieved in the gameboard
    workSpace.textContent = gameState.workingWord;
}

function checkLetter(letter, word) {
    //checks if a letter is in a word.  Returns an array
    //containing the indices of the letter in question
    let indices = [];
    for(let i = 0; i < word.length; i++) {
        if (word[i] === letter) {
            indices.push(i);
        }
    }
    return indices;
}


//code modified from https://stackoverflow.com/a/1431113
function replaceAt(original, index, replacement) {
    return  original.substring(0, index) + replacement + original.substring(index + replacement.length);
}

function isInArray(letter, arr) {
    let filtered = arr.filter((item) => item === letter);
    return (filtered.length > 0)
}

function restartGame() {
    if(instructionsHeader.innerHTML === '&nbsp;') return null;
    instructionsHeader.innerHTML = "&nbsp;";
    gameScore.innerHTML = "&nbsp;";
    wordLengthCombo.hidden = false;
    wordLengthCombo.value = gameState.solutionWord.length;
    wordLengthLabel.hidden = false;
    startButton.hidden = false;
    gameState.workingWord = "";
    gameState.solutionWord = "";
    gameState.gallowsState = 0;
    gameState.gallowsImage.src = "./assets/gallows-0.png"
    workSpace.innerHTML = "&nbsp;";
    conditionsHeader.innerHTML = '&nbsp;';
    startButton.focus();
    lettersUsedPara.innerHTML = '&nbsp;';
}

