# Hangman

Just a simple game of Hangman.

Still in development

## How to Play

First, select how long of a word you want and press "Start." Once the game has started, press any letter to select it. When the game is over, select word length again, and press "Start" (you can also press Enter). 

## How it Works (Technical)
First, it grabs a list of words from a open source word list.  It doesn't arrange this list in a way that I prefer, so I rearrange it by word length.  This way, I know how many words I have of each length and can generate a random number.

The page will (eventually... I'm working on it!) have a drop down box so the player can select how many letters should be in the word he gets.  This would be in a range of 4-9, with 6 being the default.  Words in the English language can get pretty long ("pneumonoultramicroscopicsilicovolcanoconiosis" is the longest word in the English language at 45 letters; "antidisestablishmentarianism" is another long one, and probably more commonly used), but 9 seems a reasonable limit.

JavaScript includes a random number generator: Math.random().  It returns a number between 0 and 1. It also includes Math.floor(), which (for positive numbers, at least) drops the fractional part of a float, leaving just the whole number.  So, to get the index we need, the formula would be:

`indexOfWord = Math.floor(Math.random() * wordCollection[wordLength].length)`

The word selected will be:

`wordSelected = wordCollection[wordLength][indexOfWord]`

We then have to go through and exchange all letters in the word for an underscore. This will leave things like dashes and apostrophes.  I don't think the word list I found (see my acknowledgements below) has any words with dashes (top-off) or apostrophes (they've), but I think it's good practice to make sure.

Anyway, to start a game, the player selects how long of a word they want, then click "Start." The game selects a word of the requested length, and displays a letter indicator.  The player then types letters into his keyboard. First, the game checks to see if it has already been selected; if it has, the game ignores it, else:

If the letter is in the solution, it updates the letter indicators to show position(s) in the solution.  If not, it adds a level of sorrow for the hanging man: head first, then neck, left arm, right arm, torso, left leg, right leg, left foot, right foot.  Either way, it adds the letter to the list of selected letters.  This will also be visible to the player.

It then checks for a win or loss condition.  If it finds either one, it will end the game.

If they lost, it will indicate that to them and what the solution word actually was.

If they won, a window will pop up to give them their score and their top ten scores.

Here's how the game calculates the score: behind the scenes, the game keeps track of the time as milliseconds since the game started. It also stores the hangman level as a number from 0 through 9.  So the complete score is:

(120,000 - elapsed time in ms) × (9 - hangman level)

This will produce a number as low as 1 and as high as 1,080,000.

## Acknowledgements

Wordlist forked from: [first20hours' Github repo](https://github.com/first20hours/google-10000-english).

Hangman art by Tim Callihan.  Thanks, Tim!