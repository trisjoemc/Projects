/**
 * Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 *
 * @format
 */

class game {
	constructor(WIDTH = 7, HEIGHT = 6) {
		this.WIDTH = WIDTH;
		this.HEIGHT = HEIGHT;
		this.currPlayer = 1;
		this.board = [];
		this.gameOver = false;
		this.init();
	}

	init() {
		this.makeBoard();
		this.makeHtmlBoard();
	}

	makeBoard() {
		this.board = Array.from({ length: this.HEIGHT }, () =>
			Array(this.WIDTH).fill(null)
		);
	}
	//const WIDTH = 7;
	//const HEIGHT = 6;

	//let currPlayer = 1; // active player: 1 or 2
	//let board = []; // array of rows, each row is array of cells  (board[y][x])
	//let gameOver = false; // new property to track game state

	/** makeBoard: create in-JS board structure:
	 *   board = array of rows, each row is array of cells  (board[y][x])
	 */

	//function makeBoard() {
	// for (let y = 0; y < HEIGHT; y++) {
	//    board.push(Array.from({ length: WIDTH }));
	// }
	//}

	/** makeHtmlBoard: make HTML table and row of column tops. */

	makeHtmlBoard() {
		const board = document.getElementById("board");
		board.innerHTML = ""; // clear previous board

		// make column tops (clickable area for adding a piece to that column)
		const top = document.createElement("tr");
		top.setAttribute("id", "column-top");
		top.addEventListener("click", (evt) => this.handlePlayer(evt));

		for (let x = 0; x < this.WIDTH; x++) {
			const headCell = document.createElement("td");
			headCell.setAttribute("id", x);
			top.append(headCell);
		}

		board.append(top);

		// make main part of board
		for (let y = 0; y < this.HEIGHT; y++) {
			const row = document.createElement("tr");

			for (let x = 0; x < this.WIDTH; x++) {
				const cell = document.createElement("td");
				cell.setAttribute("id", `${y}-${x}`);
				row.append(cell);
			}

			board.append(row);
		}
	}

	/** findSpotForCol: given column x, return top empty y (null if filled) */

	findSpotForCol(x) {
		for (let y = this.HEIGHT - 1; y >= 0; y--) {
			if (!this.board[y][x]) {
				return y;
			}
		}
		return null;
	}

	/** placeInTable: update DOM to place piece into HTML table of board */

	placeInTable(y, x) {
		const piece = document.createElement("div");
		piece.classList.add("piece");
		piece.classList.add(`p${this.currPlayer}`);
		piece.style.top = -50 * (y + 2);

		const spot = document.getElementById(`${y}-${x}`);
		spot.append(piece);
	}

	handlePlayer(evt) {
		if (this.gameOver) return; //cehck if the game is over

		// get x from ID of clicked cell
		const x = +evt.target.closest("td").id;

		// get next spot in column (if none, ignore click)
		const y = this.findSpotForCol(x);
		if (y === null) {
			return;
		}

		// place piece in board and add to HTML table
		this.board[y][x] = this.currPlayer;
		this.placeInTable(y, x);

		// check for win
		if (this.checkForWin()) {
			return this.endGame(`Player ${this.currPlayer} won!`);
		}

		// check for tie
		if (this.board.every((row) => row.every((cell) => cell))) {
			return this.endGame("Tie!");
		}

		// switch players
		this.currPlayer = this.currPlayer === 1 ? 2 : 1;
	}
	/** endGame: announce game end */

	endGame(msg) {
		alert(msg);
		this.gameOver = true;
	}

	/** handleClick: handle click of column top to play piece */

	/** checkForWin: check board cell-by-cell for "does a win start here?" */

	checkForWin() {
		function _win(cells) {
			// Check four cells to see if they're all color of current player
			//  - cells: list of four (y, x) cells
			//  - returns true if all are legal coordinates & all match currPlayer

			return cells.every(
				([y, x]) =>
					y >= 0 &&
					y < this.HEIGHT &&
					x >= 0 &&
					x < this.WIDTH &&
					this.board[y] &&
					this.board[y][x] === this.currPlayer
			);
		}

		for (let y = 0; y < this.HEIGHT; y++) {
			for (let x = 0; x < this.WIDTH; x++) {
				// get "check list" of 4 cells (starting here) for each of the different
				// ways to win
				const horiz = [
					[y, x],
					[y, x + 1],
					[y, x + 2],
					[y, x + 3],
				];
				const vert = [
					[y, x],
					[y + 1, x],
					[y + 2, x],
					[y + 3, x],
				];
				const diagDR = [
					[y, x],
					[y + 1, x + 1],
					[y + 2, x + 2],
					[y + 3, x + 3],
				];
				const diagDL = [
					[y, x],
					[y + 1, x - 1],
					[y + 2, x - 2],
					[y + 3, x - 3],
				];

				// find winner (only checking each win-possibility as needed)
				if (
					_win.call(this, horiz) ||
					_win.call(this, vert) ||
					_win.call(this, diagDR) ||
					_win.call(this, diagDL)
				) {
					return true;
				}
			}
		}
		return false;
	}
}

function startGame() {
	connectFourGame = new game();
}

let connectFourGame;

document.addEventListener("DOMContentLoaded", () => {
	//initial setup
	startGame();

	document.getElementById("startButton").addEventListener("click", startGame);
});
