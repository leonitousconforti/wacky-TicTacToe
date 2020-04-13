# wacky TicTacToe

A tic tac toe board for wacky sizes and the ability for as many players as you want! The game detects winners in all directions (horizontally, vertically, and diagonally). Check it out [here](https://leoconforti.us/wacky-tic-tac-toe).

## usage

include the js file in your project then

```js
let players = ["bob", "frank", "alice", "june"];
let symbols = ["Bo", "F", "Al", "Jne"];
let lengthToWin = 3;
let numOfCols = 5;
let numOfRows = 4;

tic_tac_toe = new ticTacToe(numOfCols, numOfRows, lengthToWin, symbols, players);
tic_tac_toe.play();
```
