// var words = require('./words.json');
// module.exports = words.words;
// words.words.lengths = words.lengths;

let words;
let wordCollection = [];

let gameState = {
    solutionWord: "",
    workingWord: "",
    lettersUsed: [],
};
const workSpace = document.getElementById("workSpace");
const startButton = document.getElementById("startButton");
const lettersUsedPara = document.getElementById("lettersused");
async function setup() {
    words = await fetch("./words.json");
    words = await words.json();

    //bust out the word list so I can refer to a word by 
    //wordCollection[wordLength][index].  I may change how this
    //works later to wordCollection being a function that returns
    //an array of all of the words of a certain length
    for(let i = 0; i < 9; i++) {
        if(i < 4) {
            wordCollection.push([]);
        } else {
            let newWords = [];
            for(j = words.lengths[i-1] + 1;j < words.lengths[i]; j++) {
                newWords.push(words.words[j]);
            }
            wordCollection.push(newWords);
        }
    }
    startButton.addEventListener('click', (e) => startButton_click(e));
    document.body.addEventListener('keypress', (e) => body_keypress(e));
}

async function main() {
    //setup the initial full word list
    
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
    lettersUsedPara.innerHTML = "&nbsp;"
    workSpace.textContent = gameState.workingWord;
    
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
    if(letterPositions.length === 0) return null;
    letterPositions.forEach((index) => {
        gameState.workingWord = replaceAt(gameState.workingWord, index, keyPressed);
    })
    workSpace.textContent = gameState.workingWord;
}

function checkLetter(letter, word) {
    //checks if a letter is in a word.  Returns an array
    //containing the indices of the letter in question
    console.log(letter, word);
    let indices = [];
    for(let i = 0; i < word.length; i++) {
        console.log(i);
        if (word[i] === letter) {
            indices.push(i);
        }
    }
    console.log(indices.join(", "))
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