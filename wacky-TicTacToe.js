/*jshint esversion: 6 */
console.clear();

/**
 * A tic tac toe board for wacky sizes and the ability for as many players as you want!
 * You can literally make the board, players, and symbols how every you want.
 * Why you would ever want a game like this is beyond me. Determining who (If anyone) has won
 * at any point during the game gets trickier because the symbols, players, and size of the
 * board are never constant! The game detects winners in all directions (horizontally, vertically, and diagonally).
 * 
 * @param cols - the number of columns the board will have; [cols > 0]
 * @param rows - the number of rows the board will have; [rows > 0]
 * @param winLength - the number of tiles you need connected to win, winLength must be less than cols and less than rows.
 * @param symbols - array of custom symbols to be used, if not supplied, will default to 'X' and 'O'
 * @param playerName - the names of the players, if not supplied defaults player1 and player2
 *						(the number of players and the number of symbols provided must match)
 */
function ticTacToe(_cols, _rows, _winLength, _symbols, _playerNames) {
    // Variable declarations
    let board = {};
    this.cols = _cols; 
    this.rows = _rows;
    this.winLength = _winLength;
    this.symbols = _symbols || ['X', 'O'];
    this.playerNames = _playerNames || ["Player1", "Player2"];
    this.availablePositions = 0;

    // An empty object to return when an error is thrown at the beginning
    // Makes sure an error doesn't happen latter by calling a method that does not exist
    this.emptyObj = {
        renderBoard: function () {},
        makeMove: function() {},
        play: function() {}
    };

    // Check the inputs supplied
    if ((this.winLength > this.rows) || (this.winLength > this.cols)) {
        console.error("WinLength can not exceed the width or height of your board!");
        return this.emptyObj;
    } else if ((this.cols <= 0) || (this.rows <= 0)) {
        console.error("The cols and rows must be greater than 0!");
        return this.emptyObj;
    } else if ((this.cols >= 100) || (this.rows >= 100)) {
        console.log("Things are going to start to look funny, thats a really big board!");
    }
    if (this.playerNames.length != this.symbols.length) {
    	console.error("The number of symbols and the number of players must match!");
    	return this.emptyObj;
    }

	// Generate the game board
    this.availablePositions = this.cols * this.rows;
    for (let i = 0; i < this.rows * this.cols; i++) {
        board[i] = i + 1;
    }

    // Validate symbols
    for (let i = 0; i < this.symbols.length; i++) {
        if (this.symbols[i].length > 2) {
            this.symbols[i] = this.symbols[i].slice(0, 2);
        }

        if (this.symbols[i] == "#") {
            console.error("No player can select the symbol: # (it is reserved). Select a new symbol to play again");
            return this.emptyObj;
        }
    }

    /**
     * Renders the board to the screen (Javascript console)
     */
    this.renderBoard = function() {
        let horizontalPadding = '          ';
        let str = "";
        
        // Loop over every board position
        for (let j = 0; j < this.rows; j++) {
            for (let i = 0; i < this.cols; i++) {
                // If it is the beginning of a new row, add the padding
                if (i === 0) str += horizontalPadding + "  ";
                
                // Add the positional data to display
                let value = board[j * this.cols + i];
                str += value;
                if ((value < 10) || (value.length < 2)) str += '  ';   // Make the smaller number line up with the bigger numbers
                if ((value >= 10) || (value.length >= 2)) str += ' ';  // Make the smaller number line up with the bigger numbers
                
                // Add the spacers between squares
                if (i !== this.cols - 1) {
                    str += "|  ";
                }
            }
            
            // At the end of every row, add a new line
            str += "\n";
            if (j === this.rows - 1) break;
            
            str += horizontalPadding;
            // Add some horizontal lines the the '+' symbols to join the horizontal and vertical lines
            for (let i = 0; i < this.cols; i++) {
                str += "-----";
                
                if (i === this.cols - 1) str += "\n";
                if (i !== this.cols - 1) str += "+";
            }
        }
        
        // After looping over every position, log what the board looks like
        console.log(str);
    };
    
    /**
     * Marks the board with a given move
     * 
     * @param pos - the selected position for the move
     * @param player - the player making the move, [player1, player2]
     */
    this.makeMove = function(pos, player) {
        if (player !== "winner") {
            console.log(player + " has selected board position: " + pos);
        }
    	
    	// Check the player argument
        if (this.playerNames.indexOf(player) <= -1) {
            console.error("You must supply a valid player when calling makeMove()");
            return -1;
        }
        
        // Check the position argument
        if ((isNaN(parseInt(pos))) || (pos > this.cols * this.rows)) {
            console.log("please select a valid board position");
            return 0;
        }
        pos = parseInt(pos) - 1;
        
        // Check if a move was already played there
        for (let i = 0; i < this.symbols.length; i++) {
            if ((board[pos] == this.symbols[i]) && (player !== "winner")) {
                console.log("can not override previous action, try a new move.");
                return 0;
            }   
        }

		// Everything is good and make the move
        let idx = this.playerNames.indexOf(player);
        board[pos] = this.symbols[idx];
        return 1;
    };
    
    /**
     * Checks if a player has won yet in any direction!
     * 
     * @return "no one" if no one has won yet, or the name of the player who has won
     */
    let winner = "no one";
    this.winState = function() {
        if (winner != "no one") {
            return winner;
        }

        // Change in x and change in y
        let dx, dy;

        for (let dir = 0; dir < 8; dir++) {
            // Set the change values
            if      (dir === 0) { dx =  1; dy =  0; } // Right
            else if (dir === 1) { dx = -1; dy =  0; } // Left
            else if (dir === 2) { dx =  0; dy =  1; } // Down
            else if (dir === 3) { dx =  0; dy = -1; } // Up

            else if (dir === 4) { dx =  1; dy =  1; } // Diagonal up-right
            else if (dir === 5) { dx =  1; dy = -1; } // Diagonal down-right
            else if (dir === 6) { dx = -1; dy =  1; } // Diagonal left-down
            else if (dir === 7) { dx = -1; dy = -1; } // Diagonal left-up

            // Loop over every game tile while looping over every direction
            for (let y = 0; y < this.cols; y++) {
                for (let x = 0; x < this.rows; x++) {
                    // Get the symbol at the game tile
                    let spot = board[(y * this.cols + x)];

                    // Check if someone has played there yet
                    if (this.symbols.indexOf(spot) <= -1) {
                        // no one has played there yet so next loop iteration
                        continue;
                    }

                    // Someone has played here so start a count!
                    let count = 1;

                    for (let i = 1; i <= this.winLength; i++) {
                        // Find the new coordinates
                        let newX = x + (i * dx);
                        let newY = y + (i * dy);

                        // Check that they are still valid
                        if ((newX < 0) || (newX >= this.cols) || (newY < 0) || (newY >= this.rows)) {
                            // Not valid anymore
                            break;
                        }

                        // Otherwise, check if there is a count building up
                        let spotToJudge = board[(newY * this.cols + newX)];

                        // Determine if it is the same symbol
                        if (spotToJudge == spot) {
                            // If it is the same symbol, increase the count and check for a win!
                            count ++;
                            if (count >= this.winLength) {
                                // We have a winner!
                                winner = this.playerNames[this.symbols.indexOf(spot)];

                                // Mark the winner's tokens
                                for (let winningPathLength = 1; winningPathLength <= this.winLength; winningPathLength++) {
                                    this.symbols.push("#");
                                    this.playerNames.push("winner");

                                    this.makeMove( (y + (winningPathLength * dy) - dy) * this.cols + (x + (winningPathLength * dx) - dx) + 1, "winner" );

                                    this.symbols.splice(this.symbols.length - 1, 1);
                                    this.playerNames.splice(this.playerNames.length - 1, 1);
                                }

                                return winner;
                            }
                        }
                        // Other wise, we are done here
                        else {
                            break;
                        }
                    } // End Y loop
                } // End X loop
            } // End direction loop
        
        // And then since all this is in one big loop, it will do that for every board position
        }

    	return winner;
    };
    
    /**
     * Plays the game and checks for the winner (this is a recursive function)
     * @param player - the player who gets to start the game
     */
    this.play = function(_player) {
        // Only if _player is not supplied will player = 0;
        let player = _player || 0;
       
        // If there are options left on the board
        if ((this.availablePositions > 0) && (this.winState() == "no one")) {
        	console.log("\n");
        	
            // Send a message and render the current state of the board
            console.log("It is " + this.playerNames[player] + "'s turn, the board looks like: \n");
            this.renderBoard();
            
            // Funky business to bind the pointer of this for the setInterval function
            let that = this;
            
            // Ask the player to make their move (The setTimeout is necessary so the console log shows up before the prompt)
			setTimeout(function() {
				let move = prompt("What position would you like to select?");
				let confir = confirm("Are you sure you want to select position: " + move + "?");
				if (!confir) {
					that.play(player);
					return;
				}
				
				let valid = that.makeMove(move, that.playerNames[player]);
				
				// Check to make sure that the move was legal
				if (valid == 1) {
					that.availablePositions --;
					
					// Switch to the next player in the loop
					player = (player + 1) % that.playerNames.length;
				}
				
				console.log("There is " + that.availablePositions + " positions left on the board");
				// Call the same function again with the other player
				that.play(player);
		    }, 100);
        } 
        
        // Otherwise, it might be a stalemate or there must be a winner
        else {
            console.log("\n\n\n");
            
            // Concatenate the names of all the players into one nice string
            let playerText = "";
            this.playerNames.forEach(function(name, index, arr) {
                if (index === arr.length - 1) playerText += "and ";
                // Add all the names
                playerText += name;
                if (index !== arr.length - 1) playerText += ", ";
            });

            // Check a stalemate
            if ((this.availablePositions === 0) && (this.winState() == "no one")) {
                console.log("After " + (this.cols * this.rows) + " turns between " + playerText + " the board looks like...");
                this.renderBoard();

                console.log("And the game is deemed a Stalemate!");
            }

            // Check a winner
            else if ((this.availablePositions > 0) && (this.winState() !== "no one")) {
                // Calculate how many turns there has been
                let turnsFromBeginning = (this.cols * this.rows) - this.availablePositions;
                console.log("After " + turnsFromBeginning + " turns between " + playerText + " the board looks like...");
                this.renderBoard();

                console.log("Congratulations to " + this.winState() + " for winning this game of tic-tac-toe");
                console.log(this.winState() + "'s moves have been changed into '#'");
            }
        }
    }; // End play method
}
