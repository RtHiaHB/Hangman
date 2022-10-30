// var words = require('./words.json');
// module.exports = words.words;
// words.words.lengths = words.lengths;

let words;
let wordCollection = [];
let solutionWord = "";
let workingWord = "";
const workSpace = document.getElementById("workSpace");
const startButton = document.getElementById("startButton");
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

function startButton_click(e){
    //For testing purposes, I'm going to test with wordlength 6
    //I plan a dropdown box where the user can select how long the
    //word they want
    const wordLength = 6;
    const numberOfWords = wordCollection[wordLength].length;
    let indexOfWord = Math.floor(Math.random() * numberOfWords);
    solutionWord = wordCollection[wordLength][indexOfWord];
    workingWord = removeLetters(solutionWord);
    workSpace.textContent = workingWord;
}