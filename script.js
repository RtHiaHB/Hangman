// var words = require('./words.json');
// module.exports = words.words;
// words.words.lengths = words.lengths;

let wordCollection = [];

let gameState = {
    solutionWord: "",
    workingWord: "",
    lettersUsed: [],
    gallowsState: 0,
    checkWinningState: function() {
        return (this.workingWord === this.solutionWord)
    },
    checkLosingState: function() {
        return (this.gallowsState >= 9);
    },
    increaseGallowsState: function() {
        this.gallowsState++
    },
    gallowsLevel: ["None","Head","Neck","Arm 1", "Arm 2", "Torso", "Leg 1", "Leg 2", "Foot 1", "Foot 2"]
};

const workSpace = document.getElementById("wordBlank");
const startButton = document.getElementById("startButton");
const lettersUsedPara = document.getElementById("lettersused");
const wordLengthCombo = document.getElementById("wordLengthSelection");
const wordLengthLabel = document.getElementById("wordLengthLabel");
const instructionsHeader = document.getElementById("instructions");
const conditionsHeader = document.getElementById("condition")
async function setup() {
    //get the word list and jsonify it
    wordCollection = await fetch("./wordlist.json");
    wordCollection = await wordCollection.json();
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
    //For testing purposes, I'm going to test with wordlength 6
    //I plan a dropdown box where the user can select how long the
    //word they want
    const wordLength = 6;
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
}

function body_keypress(e) {
    //e.key will give you the key actually pressed
    const keyPressed = e.key.toUpperCase();
    let charCode = keyPressed.charCodeAt(0);
    //if the key isn't a letter, stop processing.
    if(charCode < 65 || charCode > 90) {return null}
    //if the letter has been pressed before, stop processing
    if(isInArray(keyPressed, gameState.lettersUsed)) {
        return null;
    }
    gameState.lettersUsed.push(keyPressed);
    gameState.lettersUsed.sort();
    //display letters used on the page so the player gets hints of what isn't in the word
    lettersUsedPara.textContent = gameState.lettersUsed.join(", ");
    
    let letterPositions = checkLetter(keyPressed, gameState.solutionWord);
    
    //Change this so that it advances the gallows
    if(letterPositions.length === 0) {
        gameState.increaseGallowsState();
        let loss = gameState.checkLosingState();
        conditionsHeader.textContent = gameState.gallowsLevel[gameState.gallowsState];
        if(loss){
            conditionsHeader.textContent = "YOU'VE LOST!"
        }
    }
    letterPositions.forEach((index) => {
        gameState.workingWord = replaceAt(gameState.workingWord, index, keyPressed);
    })
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