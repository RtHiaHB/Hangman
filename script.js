// var words = require('./words.json');
// module.exports = words.words;
// words.words.lengths = words.lengths;

let words = [];

async function main() {
    words = await fetch("./node_modules/word-list-json/words.json");
    words = await words.json();
    console.log(words.lengths[3]);
    console.log(words.lengths[4]);
    console.log(words.lengths[5]);
    console.log(words.words[words.lengths[3]])
    for(let i = words.lengths[3]; i < words.lengths[4]-1; i++)
    {
        console.log(words.words[i])
    }
    // for(let i = (words.lengths[3] - 1); i < words.lengths[4]; i++) {
    //     console.log(words.words[i]);
    // }
}

main();