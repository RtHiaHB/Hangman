// var words = require('./words.json');
// module.exports = words.words;
// words.words.lengths = words.lengths;

let words;
let wordCollection = [];

async function setup() {
    words = await fetch("./words.json");
    words = await words.json();
    
}

async function main() {
    await setup();
    
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
    wordCollection[4].forEach((word) => console.log(word))
}

main()